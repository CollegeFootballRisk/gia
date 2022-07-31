<script>
  import SvelteTable from "svelte-table";
  import { getPlayer } from "../utils/loads";
  import Loader from "../components/Loader.svelte";
  import { getTurnID, dynamicSort, normalizeTeamName, getTurnInfo } from "../utils/normalization";
  import { team, teams, turn, turns } from "../state/state.js";
  import { onMount, onDestroy } from "svelte";
  import { faSort } from "@fortawesome/free-solid-svg-icons";
  //import {push} from 'svelte-spa-router'


  export var currentRoute;
  export var params;
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
    let turn = getTurnInfo(get(turn));
    push(`/odds/${turn.season}/${turn.day}/${get(team)}`);
  }

  const unsub_turn = turn.subscribe(newUrl);
  const unsub_team = team.subscribe(newUrl);
  onDestroy(() => {unsub_turn, unsub_team});
</script>

{currentRoute.namedParams.season}/{currentRoute.namedParams.day} for {currentRoute
  .namedParams.team}
<div class="map-controls top-control">
  <select bind:value={$turn} title="select day">
    <option value={null}>Latest</option>
    {#each $turns.reverse().slice(1, $turns.length) as day}
      <option value={day.id}>{day.season}/{day.day}</option>
    {/each}
  </select>
  <select bind:value={$team} title="select team">
    <option value={null}>Team</option>
    {#each $teams.sort(dynamicSort("name")) as tea}
      <option value={normalizeTeamName(tea.name)}>{tea.name}</option>
    {/each}
  </select>
</div>

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
