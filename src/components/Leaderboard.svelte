<script>
  import SvelteTable from "svelte-table";
  import { getLeaderboard } from "../utils/loads";
  import Loader from "./Loader.svelte";
  import {turn} from '../state/state.js';
  let sortBy = "rank";
  let sortOrder = 1;
  let selectedCols = [
    "rank",
    "name",
    "territories",
    "team_players",
    "mercenaries",
    "star_power",
    "efficiency",
  ];
  const COLUMNS = {
    rank: { key: "rank", title: "Rank", value: (v) => v.rank, sortable: true },
    name: { key: "name", title: "Team", value: (v) => v.name, sortable: true },
    territories: { key: "territories", title: "Territories", value: (v) => v.territoryCount, sortable: true },
    team_players: {
      key: "team_players",
      title: "Players",
      value: (v) => v.playerCount,
      sortable: true,
    },
    mercenaries: { key: "mercenaries", title: "Mercenaries", value: (v) => v.mercCount, sortable: true },
    star_power: { key: "star_power", title: "Star Power", value: (v) => v.starPower, sortable: true },
    efficiency: { key: "efficiency", title: "Efficiency", value: (v) => v.efficiency.toFixed(2), sortable: true },
  };
  let numRows = 15;
  let data = getLeaderboard($turn);
  $: cols = selectedCols.map(key => COLUMNS[key]);
</script>

<h1>Leaderboard</h1>
{#await data}
<Loader/>
{:then data_json}
<SvelteTable
  columns={cols}
  rows={data_json}
  bind:sortBy
  bind:sortOrder
  classNameTable={["table table-striped"]}
  classNameThead={["table-primary"]}
  classNameSelect={["custom-select"]}
/>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  :global(.table) {
    color: var( --main-foreground-color);
    background: var(--main-background);
  }
</style>
