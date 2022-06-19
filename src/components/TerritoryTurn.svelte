<script>
  export let territory;
  export let season;
  export let day;
  import SvelteTable from "svelte-table";
  import { getTerritoryTurn } from "../utils/loads";
  import Loader from "./Loader.svelte";
  import {Doughnut} from "svelte-chartjs/src";
import { normalizeTeamName } from "../utils/normalization";

  let sortBy = "team";
  let sortOrder = 1;
  let selectedCols = [
    "team",
    "player",
    "stars",
    "weight",
    "multiplier",
    "power",
  ];
  const COLUMNS = {
    team: { key: "team", title: "Team", value: (v) => v.team, sortable: true },
    player: {
      key: "player",
      title: "Player",
      value: (v) => `${(v.mvp==true)?String.fromCharCode(0x272F):''}<a href="/player/${v.player}">${v.player}</a>`,
      sortable: true,
    },
    stars: {
      key: "stars",
      title: "Stars",
      value: (v) => v.stars,
      sortable: true,
    },
    weight: {
      key: "weight",
      title: "Weight",
      value: (v) => v.weight,
      sortable: true,
    },
    multiplier: {
      key: "multiplier",
      title: "Multiplier",
      value: (v) => v.multiplier.toFixed(1),
      sortable: true,
    },
    power: {
      key: "power",
      title: "Power",
      value: (v) => v.power.toFixed(1),
      sortable: true,
    },
  };
  let data = getTerritoryTurn(territory, season, day);
  function c_data(teams) {return {
    labels: teams.map(a => a.team),
    datasets: [
      {
        data: teams.map(a => a.power),
        backgroundColor: teams.map(a => getComputedStyle(document.body).getPropertyValue(`--${normalizeTeamName(a.team)}-primary`)),
        hoverBackgroundColor: teams.map(a => getComputedStyle(document.body).getPropertyValue(`--${normalizeTeamName(a.team)}-secondary`))
      }
    ]
  };}

  let c_options = {
    responsive: true,
  };
  
  $: cols = selectedCols.map((key) => COLUMNS[key]);
</script>

<h1>{territory}</h1>
<h2>{season}/{day}</h2>
{#await data}
  <Loader />
{:then data_json}
<h3>Players</h3>
  <SvelteTable
    columns={cols}
    rows={data_json.players}
    bind:sortBy
    bind:sortOrder
    classNameTable={["table table-striped"]}
    classNameThead={["table-primary"]}
    classNameSelect={["custom-select"]}
  />
  <h3>Power</h3>
    <Doughnut data={c_data(data_json.teams)} options={c_options}
    />
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  h2 {
      font-size: 1.4rem;
      text-align: center;
  }

  h3 {
      font-size: 1.2rem;
      text-align: center;
  }

  :global(.table) {
    color: var(--main-foreground-color);
    background: var(--main-background);
  }
</style>
