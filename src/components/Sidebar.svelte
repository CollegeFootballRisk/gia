<script>
  import {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText,
  } from "fontawesome-svelte";

  import {
    highlighted_territories,
    lock_highlighted,
    sidebarOpen,
    turn,
  } from "../state/state.js";

  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";

  import Loader from "./Loader.svelte";
  import { onMount, onDestroy } from "svelte";
  import { getTerritoryHistory } from "../utils/loads.js";
  var promise;
  export function doPromiseChange() {
    if (isNullTerr()) {
      promise = new Promise(() => {});
    } else {
      promise = getTerritoryHistory($highlighted_territories.info.name, $turn);
    }
  }
  doPromiseChange();

  function isNullTerr() {
    return $highlighted_territories == null;
  }

  const unsub_lock = lock_highlighted.subscribe(doPromiseChange);

  onDestroy(() => {
    unsub_lock;
  });

  onMount(() => {
    // credit to Timothy Huang for this regex test:
    // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      sidebarOpen.set(false);
    }
  });
</script>

<div class="sidebar" class:is-closed={!$sidebarOpen} title="Sidebar Toggle">
  <button
    class="sidebar-toggle"
    on:click={() => sidebarOpen.set(!$sidebarOpen)}
  >
    <FontAwesomeIcon
      icon={!$sidebarOpen ? faChevronLeft : faChevronRight}
      style="color: var(--accent-fg);"
    />
  </button>
  {#await promise}
    <center
      ><h2>
        {isNullTerr() ? "North America" : $highlighted_territories.info.name}
      </h2></center
    >
    <hr style="color: var(--accent-fg);" />
    {#if $highlighted_territories != null && $highlighted_territories.info.attributeInformation.power != null}
      <center
        ><h4>
          Winner: {$highlighted_territories.info.attributeInformation.winner}
        </h4>
        <h4>
          Power: {$highlighted_territories.info.attributeInformation.power}
        </h4>
        <h4>
          Players: {$highlighted_territories.info.attributeInformation.players}
        </h4></center
      >
    {/if}
    {#if $highlighted_territories != null && $highlighted_territories.info.attributeInformation.neighbors != null}
      <center
        ><h4>
          Owner: {$highlighted_territories.info.attributeInformation.owner}
        </h4></center
      >
      <hr style="color: var(--accent-fg);" />
      <div style="width: 100%;max-height:20%;overflow:auto;">
        <center><h4>Neighbors</h4></center>
        {#each $highlighted_territories.info.attributeInformation.neighbors.sort( function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          } ) as neighbor}
          <li>
            {neighbor.name}
          </li>
        {/each}
      </div>
    {/if}
    {#if $lock_highlighted}
      <Loader />
    {/if}
  {:then territory}
    <center
      ><h2>
        {isNullTerr() ? "North America" : $highlighted_territories.info.name}
      </h2></center
    >
    <hr style="color: var(--accent-fg);" />
    {#if $highlighted_territories != null && $highlighted_territories.info.attributeInformation.power != null}
      <center
        ><h4>
          Winner: {$highlighted_territories.info.attributeInformation.winner}
        </h4>
        <h4>
          Power: {$highlighted_territories.info.attributeInformation.power}
        </h4>
        <h4>
          Players: {$highlighted_territories.info.attributeInformation.players}
        </h4></center
      >
    {/if}
    {#if $highlighted_territories != null && $highlighted_territories.info.attributeInformation.neighbors != null}
      <center
        ><h4>
          Owner: {$highlighted_territories.info.attributeInformation.owner}
        </h4></center
      >
      <hr style="color: var(--accent-fg);" />
      <div style="width: 100%;max-height:20%;overflow:auto;">
        <center><h4>Neighbors</h4></center>
        {#each $highlighted_territories.info.attributeInformation.neighbors.sort( function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          } ) as neighbor}
          <li>
            {neighbor.name}
          </li>
        {/each}
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style>
  /** Sidebar **/
  .sidebar-toggle {
    position: fixed;
    z-index: 10;
    border: 4px solid var(--main-foreground-color);
    outline: none;
    width: 40px;
    height: 60px;
    border-radius: 0% 20% 20% 0%;
    margin-left: 17.8em;
    margin-top: calc(50vh - var(--navbar-height));
    background-color: var(--accent-2);
    cursor: pointer;
    transition: 0.5s;
    font-size: 13.3333px;
  }

  .sidebar {
    z-index: 3;
    position: absolute;
    width: 15em;
    height: calc(100vh - var(--navbar-height));
    background-color: var(--accent-2);
    transition: 0.7s;
    border-right: 4px solid var(--main-foreground-color);
  }

  .sidebar.is-closed {
    transform: translateX(-15em);
  }
</style>
