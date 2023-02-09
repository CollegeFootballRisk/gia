<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script lang="ts">
  export let territory: string;
  export let season: number;
  export let day: number;
  export {};

  import SimpleTable from "@a-luna/svelte-simple-tables";
  import type { ColumnSettings } from "@a-luna/svelte-simple-tables/types";
  import type { TableSettings } from "@a-luna/svelte-simple-tables/types";
  import { getTerritoryTurn } from "../utils/loads";
  import Loader from "./Loader.svelte";
  import { Doughnut } from "svelte-chartjs/src";
  import { normalizeTeamName } from "../utils/normalization";
  import { settings } from "../state/settings";

  interface TerrTurn {
    team: string;
    player: string;
    stars: number;
    weight: number;
    multiplier: number;
    power: number;
    mvp: boolean;
  }

  const tableSettings: TableSettings<TerrTurn> = {
    tableId: "territory_turns",
    themeName: $settings.lightmode ? "light" : "dark",
    showHeader: true,
    header: "Territory Turns",
    showSortDescription: true,
    sortBy: "team",
    sortType: "string",
    sortDir: "asc",
    tableWrapper: true,
    clickableRows: false,
    animateSorting: false,
    paginated: true,
    pageSize: $settings.default_page_size,
    pageSizeOptions: [5, 10, 15, 20, 25, 50, 100],
    pageRangeFormat: "compact",
    pageNavFormat: "compact",
  };

  function formatData(x: any): TerrTurn[] {
    return x;
  }

  const teamLink = (v: TerrTurn): string =>
    `<a onclick="window.closeModal()" href="/team/${encodeURIComponent(
      v.team
    )}">${v.team}</a>`;

  const playerLink = (v: TerrTurn): string =>
    `<a onclick="window.closeModal()" href="/player/${encodeURIComponent(
      v.player
    )}">${v.player}</a>`;

  const columnSettings: ColumnSettings<TerrTurn>[] = [
    {
      propName: "team",
      headerText: "------------Team------------",
      tooltip: "Team played for",
      classList: ["text-center", "const-width"],
      colValue: teamLink,
    },
    {
      propName: "player",
      headerText: "---------Player--------",
      tooltip: "Territory name",
      classList: ["text-center", "const-width"],
      colValue: playerLink,
    },
    {
      propName: "stars",
      headerText: "Stars",
      tooltip: "Number of stars at time",
    },
    {
      propName: "weight",
      headerText: "Weight",
      tooltip: "Power determined by stars",
    },
    {
      propName: "multiplier",
      headerText: "Mult",
      tooltip: "Total multiplier",
    },
    {
      propName: "power",
      headerText: "Power",
      tooltip: "Power = multiplier * weight",
    },
    {
      propName: "mvp",
      headerText: "MVP",
      tooltip: "Most Valuable Player",
      colValue: (v) => (v.mvp ? "✯" : ""),
    },
  ];

  let data = getTerritoryTurn(territory, season, day);
  function c_data(teams) {
    return {
      labels: teams.map((a) => a.team),
      datasets: [
        {
          data: teams.map((a) => a.power),
          backgroundColor: teams.map((a) =>
            getComputedStyle(document.body).getPropertyValue(
              `--${normalizeTeamName(a.team)}-primary`
            )
          ),
          hoverBackgroundColor: teams.map((a) =>
            getComputedStyle(document.body).getPropertyValue(
              `--${normalizeTeamName(a.team)}-secondary`
            )
          ),
        },
      ],
    };
  }

  let c_options = {
    responsive: true,
  };
</script>

<h1>{territory}</h1>
<h2>{season}/{day}</h2>
{#await data}
  <Loader />
{:then data_json}
  <h3>Players</h3>
  {#if data_json.players.length > 0}
    <SimpleTable
      data={formatData(data_json.players)}
      {columnSettings}
      {tableSettings}
    />
  {:else}
    <center><b>None this turn...</b></center>
  {/if}
  <h3>Power</h3>
  {#if data_json.teams.length > 0}
    <div class="chartContainer">
      <Doughnut data={c_data(data_json.teams)} options={c_options} />
    </div>
  {:else}
    No teams made a move on this territory this turn...
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
{#if $settings.extra_space_bottom_prompt}
  <div class="exta-long" />
{/if}

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

  .chartContainer {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }

  :global(.extra-long) {
    width: 100%;
    height: 45vh;
  }
</style>
