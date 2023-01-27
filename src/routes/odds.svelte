<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { getDay, getTurnID } from "../utils/loads";
  import { team, turn, turns } from "../state/state.js";
  import { onMount } from "svelte";
  import Odds from "../components/Odds.svelte";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
  import FontAwesomeIcon from "fontawesome-svelte/src/FontAwesomeIcon.svelte";
  import { modal } from "../state/state.js";
  import { bind } from "svelte-simple-modal";
  import OddsDescription from "../components/OddsDescription.svelte";
  export var currentRoute;
  var teams_available = [];
  var local_map_type = "chance";
  // Set the current day to that of the url if needed
  onMount(async () => {
    let dt = await getTurnID(
      currentRoute.namedParams.season,
      currentRoute.namedParams.day
    );
    if ($turn != dt) {
      turn.set(dt);
    }
    if (currentRoute.namedParams.team != undefined) {
      team.set(currentRoute.namedParams.team);
    }
  });
  async function changeTeams(turnNum) {
    let turn_data = await getDay(turnNum);
    teams_available = [
      ...new Set(turn_data.map((item) => item.attributeInformation.owner)),
    ];
    if ($team == null) $team = teams_available.sort()[0];
    if ($turn == null) $turn = $turns.length - 1;
  }

  const showOddsInfoPrompt = () => modal.set(bind(OddsDescription));

  function changeUrl(turn, team) {
    if (turn == null || team == null) {
      history.pushState(null, "College Football Risk", `/odds`);
      return;
    }
    let t = $turns.find((e) => e.id == turn);
    history.pushState(
      null,
      "College Football Risk",
      `/odds/${t.season}/${t.day}/${team}/`
    );
  }

  $: changeTeams($turn);
  $: changeUrl($turn, $team);
</script>

<div class="map-controls top-control">
  <select bind:value={$turn} title="select day">
    {#each $turns.slice(1, $turns.length) as day, index}
      <option value={day.id}>{day.season}/{day.day}</option>
    {/each}
  </select>
  {#key teams_available}
    <select bind:value={$team} title="select team">
      {#each teams_available.sort() as tea}
        <option value={encodeURIComponent(tea)}>{tea}</option>
      {/each}
    </select>
  {/key}
  <select name="maptype" bind:value={local_map_type} title="select display">
    <option value="chance">Chance</option>
    <option value="players">Players</option>
    <option value="wins">Wins</option>
    <option value="ones">✯</option>
    <option value="twos">✯✯</option>
    <option value="threes">✯✯✯</option>
    <option value="fours">✯✯✯✯</option>
    <option value="fives">✯✯✯✯✯</option>
    <option value="teamPower">Team Power</option>
    <option value="territoryPower">Territory Power</option>
  </select>
  <label for="maptype" on:click={showOddsInfoPrompt}
    ><FontAwesomeIcon icon={faQuestionCircle} /></label
  >
</div>
{#if $turns != null && $turn != null && $team != null}
  <Odds
    season={$turns.find((e) => e.id == $turn).season}
    day={$turns.find((e) => e.id == $turn).day}
    team={$team}
    {local_map_type}
  />
{:else}
  <br /><br /><br />
  <center class="note"
    >Select a turn and team to get started <i style="font-size:2em;">&#10548;</i
    ></center
  >
{/if}

<style>
  .map-controls {
    position: absolute;
    bottom: calc(0.1 * var(--navbar-height));
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 2;
    white-space: nowrap;
  }

  .map-controls select {
    color: var(--accent-fg);
    background: var(--accent-2);
    height: 2em;
    border: none;
    padding: 0.3em;
    font-size: 1.3em;
    line-height: 1em;
  }

  .map-controls select {
    float: left;
  }

  .top-control select {
    flex: 1;
  }

  .top-control {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    top: calc(var(--navbar-height));
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 2;
    white-space: nowrap;
    bottom: unset !important;
  }

  .top-control label {
    height: 2em;
    color: var(--accent-fg);
    position: relative;
    padding-top: 0.4em;
    font-size: 1.3em;
    padding-left: 0.4em;
  }

  .map-controls select:hover,
  .map-controls label:hover {
    color: var(--itemHoverBG);
  }
</style>
