<script>
  import SvelteTable from "svelte-table";
  import { get } from 'svelte/store'
  import { getPlayer } from "../utils/loads";
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

  const unsub_turn = turn.subscribe(newUrl);
  const unsub_team = team.subscribe(newUrl);
  onDestroy(() => {unsub_turn, unsub_team});
</script>
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
      <option value={encodeURIComponent(tea.name)}>{tea.name}</option>
    {/each}
  </select>
</div>
{#if $turns != null && $turn != null && $team != null}
  <Odds season={$turns.find(e => e.id == $turn).season} day={$turns.find(e => e.id == $turn).day} team={$team}></Odds>
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
