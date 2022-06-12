<script>
  import { getTerritoryHistory } from "../utils/loads";
  import Loader from "./Loader.svelte";
  import TerritoryTurn from "./TerritoryTurn.svelte";
  import { modal } from "../state/state.js";
  import { bind } from "svelte-simple-modal";

  export let turn;
  export let territory;
  let promise = getTerritoryHistory(territory, turn);
</script>

<center><h4>History</h4></center>
<div style="width: 100%;max-height:20%;overflow:auto;">
  {#await promise}
    <Loader />
  {:then turns}
  <li>{turns[0].season}/{turns[0].day} -> {turns[0].owner} (current)</li>
    {#each turns.slice(1,turns.length) as turnDisplay}
        <li>
          <a
            on:click={modal.set(
              bind(TerritoryTurn, {
                territory: territory,
                season: turnDisplay.season,
                day: turnDisplay.day,
              })
            )}>{turnDisplay.season}/{turnDisplay.day} -> {turnDisplay.owner}</a
          >
        </li>
    {/each}
  {/await}
</div>

<style>
  h2,
  h4 {
    margin: 5px;
  }
  a {
    cursor: pointer;
    text-decoration: underline;
    color: var(--main-foreground-color);
  }
</style>
