<script>
  import SvelteTable from "svelte-table";
  import { get } from 'svelte/store'
  import { getDay, getPlayer } from "../utils/loads";
  import Loader from "../components/Loader.svelte";
  import { getTurnID, dynamicSort, normalizeTeamName, getTurnInfo } from "../utils/normalization";
  import { team, teams, turn, turns } from "../state/state.js";
  import { onMount, onDestroy } from "svelte";
  import { faSort } from "@fortawesome/free-solid-svg-icons";
  import Odds from "../components/Odds.svelte";
  import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";
  //import {push} from 'svelte-spa-router'


  export var currentRoute;
  export var params;
  var teams_available = [];
  var map_type = 'heat';
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

  function newUrl(){
    let turnz = getTurnInfo(get(turn));
    //push(`/odds/${turnz.season}/${turnz.day}/${get(team)}`);
  }

  async function changeTeams(turnNum){
    let turn_data = await getDay(turnNum);
    teams_available = [...new Set(turn_data.map(item => item.attributeInformation.owner))];
  }

  function changeUrl(turn, team) {
    if (turn == null || team == null) {history.pushState(null, 'College Football Risk', `/odds`); return};
    let t= $turns.find(e => e.id == turn);
    history.pushState(null, 'College Football Risk', `/odds/${t.season}/${t.day}/${encodeURIComponent(team)}/`);
  }

  const unsub_turn = turn.subscribe(newUrl);
  const unsub_team = team.subscribe(newUrl);
  onDestroy(() => {unsub_turn, unsub_team});
  $: changeTeams($turn);
  $: changeUrl($turn, $team);
</script>
<div class="map-controls top-control">

  <select bind:value={$turn} title="select day">
    <option value={null}>Latest</option>
    {#each $turns.reverse().slice(1, $turns.length) as day}
      <option value={day.id}>{day.season}/{day.day}</option>
    {/each}
  </select>
  {#key teams_available}
  <select bind:value={$team} title="select team">
    <option value={null}>Team</option>
    {#each teams_available.sort() as tea}
      <option value={encodeURIComponent(tea)}>{tea}</option>
    {/each}
  </select>
  {/key}
  <select bind:value={map_type} title="select display">
    <option value="heat">Chance</option>
    <option value="players">Players</option>
  </select>
</div>
{#if $turns != null && $turn != null && $team != null}
  <Odds season={$turns.find(e => e.id == $turn).season} day={$turns.find(e => e.id == $turn).day} team={$team} map_type={map_type}></Odds>
  {:else}
  <!--blank-->
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
  .top-control {
    position: absolute;
    top: calc(var(--navbar-height));
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 2;
    white-space: nowrap;
    bottom: unset !important;
  }
</style>
