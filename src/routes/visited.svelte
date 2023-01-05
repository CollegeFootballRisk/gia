<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { getTurnsandTeams } from "../utils/loads";
  import { team, turn, turns, teams } from "../state/state.js";
  import { onMount } from "svelte";
  import Visited from "../components/Visited.svelte";

  export var currentRoute;
  var season = parseInt(currentRoute.namedParams.season);
  // Set the current day to that of the url if needed
  onMount(async () => {
    if (currentRoute.namedParams.team != undefined) {
      team.set(currentRoute.namedParams.team);
    }
    await getTurnsandTeams();
  });

  function changeUrl(season, team) {
    if (turn == null || team == null) {
      history.pushState(null, "College Football Risk", `/visited`);
      return;
    }
    let t = $turns.find((e) => e.id == turn);
    history.pushState(
      null,
      "College Football Risk",
      `/visited/${team}/${season}/`
    );
  }

  $: changeUrl(season, $team);
</script>

<div class="map-controls top-control">
  <select bind:value={season} title="select season" placeholder="season">
    {#each [...new Set($turns.map((turn) => turn.season))] as seasonal}
      <option value={seasonal}>Season {seasonal}</option>
    {/each}
  </select>
  {#key $teams}
    <select bind:value={$team} title="select team">
      {#each $teams.sort( (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) ) as tea}
        <option value={encodeURIComponent(tea.name)}>{tea.name}</option>
      {/each}
    </select>
  {/key}
</div>
{#if season != null && $team != null}
  <Visited {season} team={$team} />
{:else}
  <br /><br /><br />
  <center class="note"
    >Select a season and team to get started <i style="font-size:2em;"
      >&#10548;</i
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
