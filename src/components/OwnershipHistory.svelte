<script>
import { getTerritoryHistory } from "../utils/loads";
import Loader from "./Loader.svelte";
    export let turn;
    export let territory;
    let promise = getTerritoryHistory(territory, turn);
</script>
<center><h4>History</h4></center>
<div style="width: 100%;max-height:20%;overflow:auto;">
{#await promise}
    <Loader/>
{:then territories} 
    {#each territories as territory}
        <li>{territory.season}/{territory.day} -> {territory.owner}</li>
    {/each}
{/await}
</div>

<style>
  h2,
  h4 {
    margin: 5px;
  }
</style>