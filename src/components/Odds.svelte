<script>
    export let season;
    export let day;
    export let team;
    import SvelteTable from "svelte-table";
  import { dataset_dev } from "svelte/internal";
    import { getTeamOdds } from "../utils/loads";
  import { normalizeOdds } from "../utils/normalization";
    import Loader from "./Loader.svelte";
    $: waitKey = getTeamOdds(season, day, team).then(sent => normalizeOdds(sent,team)).catch(error => {return {"error": error}});
</script>
{#key team, season, day}
{#await waitKey}
    <Loader/>
{:then data}
{#if data.error != null}
<center> <br/><br/><br/><br/>
    <h2 style="color:red;">{decodeURIComponent(team)} was eliminated before day {season}/{day}</h2>
</center>
{:else}
<ul>
    {season}/{day} for {team}
    <li>Survival Odds: {data.oddsSurvival}</li>
    <li>Territories Expected: {data.territoryExpectedCount.toFixed(2)}</li>
    <li>Territories Won: {data.territoryCount}</li>
    <li>Heat Map (where team deployed forces):
        <ul>
            {#each data.oddsArray.sort((a,b) => a.players < b.players) as odd}
                <li style:color={odd.colorPlayer}>{odd.territory}: {odd.players}</li>
            {/each}
        </ul>
    </li>
    <li>Odds Map (where team had highest odds of winning):
        <ul>
            {#each data.oddsArray.sort((a,b) => a.chance < b.chance) as odd}
                <li style:color={odd.colorHeat}>{odd.territory}: {odd.chance.toFixed(2)}</li>
            {/each}
        </ul>
    </li>
    <li>odds-players-table: "/api/team/odds?team=" +   headings: ["Territory","Owner","Winner",encodeURIComponent()"MVPs","Players","1✯","2✯","3✯","4✯","5✯","Team Power","Territory Power","Chance",
    ],</li>
  </ul>
{/if}
{/await}
{/key}