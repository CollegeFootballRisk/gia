<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script lang="ts">
  //TODO : Add PPP back...
  //value: (v) => (v.starPower / (v.mercCount + v.playerCount)).toFixed(2),
  import SimpleTable from "@a-luna/svelte-simple-tables";
  import type { ColumnSettings } from "@a-luna/svelte-simple-tables/types";
  import type { TableSettings } from "@a-luna/svelte-simple-tables/types";
  import Loader from "./Loader.svelte";
  import { turn } from "../state/state.js";

  import { base_url, getTurnInfo } from "../utils/loads";
  import { settings } from "../state/settings";

  // Returns Leaderboard data for turn
  export async function getLeaderboard(turn): Promise<Lboard[]> {
    let turnData = await getTurnInfo(turn);
    let get = await fetch(
      `${base_url}/api/stats/leaderboard${
        turn == null ? "" : `?season=${turnData.season}&day=${turnData.day + 1}`
      }`
    );
    let json: Lboard[] = await get.json();

    if (get.ok) {
      return json;
    } else {
      throw new Error("Error fetching leaderboard.");
    }
  }
  const teamLink = (v: Lboard): string =>
    `<a onclick="window.closeModal()" href="/team/${encodeURIComponent(
      v.name
    )}">${v.name}</a>`;

  const formatPower = (v: Lboard): string =>
    v.starPower == null ? "0" : v.starPower.toString();
  const formatEff = (v: Lboard): string =>
    v.efficiency == null ? "0.00" : v.efficiency.toFixed(2);

  interface Lboard {
    rank: number;
    name: string;
    logo: string;
    territoryCount: number;
    playerCount: number;
    mercCount: number;
    starPower: number;
    efficiency: number;
  }

  const tableSettings: TableSettings<Lboard> = {
    tableId: "pfx",
    themeName: $settings.lightmode ? "light" : "dark",
    showHeader: true,
    header: "Leaderboard",
    showSortDescription: true,
    sortBy: "rank",
    sortType: "number",
    sortDir: "asc",
    tableWrapper: true,
    clickableRows: false,
    animateSorting: false,
    paginated: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20, 25],
    pageRangeFormat: "compact",
    pageNavFormat: "compact",
  };

  const columnSettings: ColumnSettings<Lboard>[] = [
    {
      propName: "rank",
      tooltip: "Rank",
      classList: ["text-left"],
    },
    {
      propName: "name",
      headerText: "------------Team------------",
      tooltip: "Team Name",
      classList: ["text-center", "const-width"],
      colValue: teamLink,
    },
    {
      propName: "playerCount",
      headerText: "Players",
      tooltip: "Number of players on team",
    },
    {
      propName: "territoryCount",
      headerText: "Territories",
      tooltip: "Number of territories won by team",
    },
    {
      propName: "mercCount",
      headerText: "Mercs",
      tooltip: "Number of mercenaries on the team",
    },
    {
      propName: "starPower",
      headerText: "Stars",
      tooltip: "Team's total star power",
      colValue: formatPower,
    },
    {
      propName: "efficiency",
      headerText: "Efficiency",
      tooltip: "Team Efficiency",
      colValue: formatEff,
    },
  ];
  let data = getLeaderboard($turn);
</script>

<h1>Leaderboard</h1>
{#await data}
  <Loader />
{:then data_json}
  <SimpleTable data={data_json} {columnSettings} {tableSettings} />
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  :global(.const-width){
    width: 146px;
  }

  :global(.table) {
    color: var(--main-foreground-color);
    background: var(--main-background);
  }

  :global(.sst-resp-table-wrapper) {
    width: 100%;
  }
</style>
