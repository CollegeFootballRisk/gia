<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script lang="ts">
  import Select from "svelte-select";
  import SimpleTable from "@a-luna/svelte-simple-tables";
  import type { ColumnSettings } from "@a-luna/svelte-simple-tables/types";
  import type { TableSettings } from "@a-luna/svelte-simple-tables/types";
  import Loader from "../components/Loader.svelte";
  import { getTeam, getTurnInfo } from "../utils/loads";
  import PlayerTime from "../components/PlayerTime.svelte";
  import PlayerChart from "../components/PlayerChart.svelte";
  import { teams } from "../state/state";
  import { settings } from "../state/settings";

  export var currentRoute;
  const win: Window = window;
  var teamLoad = getTeam(currentRoute.namedParams.team);

  interface Player {
    player: string;
    turnsPlayed: number;
    mvps: number;
  }

  const tableSettingsPlayers: TableSettings<Player> = {
    tableId: "players",
    themeName: $settings.lightmode ? "light" : "dark",
    showHeader: true,
    header: "Players",
    showSortDescription: true,
    sortBy: "player",
    sortType: "string",
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

  function formatPlayers(x: any): Player[] {
    return x;
  }

  const playerLink = (v: Player): string =>
    `<a onclick="window.closeModal()" href="/player/${encodeURIComponent(
      v.player
    )}">${v.player}</a>`;

  const columnSettingsPlayers: ColumnSettings<Player>[] = [
    {
      propName: "player",
      headerText: "------------Name------------",
      tooltip: "Team played for",
      classList: ["text-center", "const-width"],
      colValue: playerLink,
    },
    {
      propName: "turnsPlayed",
      tooltip: "Turns",
      headerText: "Turns",
      classList: ["text-left"],
    },
    {
      propName: "mvps",
      headerText: "MVPs",
      tooltip: "Number of MVPs received",
      classList: ["text-left"],
    },
  ];

  interface Merc {
    player: string;
    turnsPlayed: number;
    mvps: number;
    team: string;
  }

  const tableSettingsMercs: TableSettings<Merc> = {
    tableId: "mercs",
    themeName: $settings.lightmode ? "light" : "dark",
    showHeader: true,
    header: "Mercs",
    showSortDescription: true,
    sortBy: "player",
    sortType: "string",
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

  function formatMercs(x: any): Merc[] {
    return x;
  }

  const teamLink = (v: Merc): string =>
    `<a onclick="window.closeModal()" href="/team/${encodeURIComponent(
      v.team
    )}">${v.team}</a>`;

  const mercLink = (v: Merc): string =>
    `<a onclick="window.closeModal()" href="/player/${encodeURIComponent(
      v.player
    )}">${v.player}</a>`;

  const columnSettingsMercs: ColumnSettings<Merc>[] = [
    {
      propName: "team",
      headerText: "------------Team------------",
      tooltip: "Team played for",
      classList: ["text-center", "const-width"],
      colValue: teamLink,
    },
    {
      propName: "player",
      headerText: "------------Name------------",
      tooltip: "Team played for",
      classList: ["text-center", "const-width"],
      colValue: mercLink,
    },
    {
      propName: "turnsPlayed",
      tooltip: "Turns",
      headerText: "Turns",
      classList: ["text-left"],
    },
    {
      propName: "mvps",
      headerText: "MVPs",
      tooltip: "Number of MVPs received",
      classList: ["text-left"],
    },
  ];

  const getSelectionLabel = (option) => option.name;
  const getOptionLabel = (option) => option.name;

  function handleSelect(event) {
    win.location = `/team/${encodeURIComponent(event.detail.name)}`;
  }

  let get_latest = getTurnInfo(null);
</script>

{#await teamLoad}
  <Loader />
{:then team}
  <div class="team-overflow">
    <div class="selectContainer">
      <Select
        items={$teams.sort((b, a) => b.name.localeCompare(a.name))}
        on:select={handleSelect}
        {getSelectionLabel}
        {getOptionLabel}
        containerClasses="searchInner"
        placeholder="Search ..."
      />
    </div>
    <center>
      <img
        src="/images/logos/{team.teamStats.team}.png"
        alt="{team.teamStats.team} Logo"
        title="{team.teamStats.team} Logo"
        height="150vh"
      />
      <div class="lrow">
        <div class="lcol2">
          <i>Mercs:</i><br />
          {team.teamStats.mercs}
        </div>
        <div class="lcol2">
          <i>Players:</i><br />
          {team.teamStats.players}
        </div>
      </div>
      <br />
      <div class="lrow">
        <div class="lcol2">
          <i>Stars: </i><br />
          {team.teamStats.stars}
        </div>
        <div class="lcol2">
          <i>Territories:</i><br />
          {team.teamStats.territories}
        </div>
      </div>
      <br />
      {#await get_latest}
        <Loader />
      {:then latest}
        <div class="lrow">
          <div class="lcol2" style="max-width:90vw;">
            <h3>Player Stars:</h3>
            <br />
            <PlayerTime season={latest.season} extern_data={team.teamData} />
          </div>
          <div class="lcol2" style="max-width:90vw;">
            <h3>Star Power:</h3>
            <br />
            <PlayerChart season={latest.season} extern_data={team.teamData} />
          </div>
        </div>
      {/await}
      <br /><br />
      <div class="lrow">
        <div class="lcol2">
          <h3>Players:</h3>
          <br />
          <SimpleTable
            data={formatPlayers(team.players)}
            columnSettings={columnSettingsPlayers}
            tableSettings={tableSettingsPlayers}
          />
          <hr />
        </div>
        <div class="lcol2">
          <h3>Mercenaries:</h3>
          <br />
          <SimpleTable
            data={formatMercs(team.mercs)}
            columnSettings={columnSettingsMercs}
            tableSettings={tableSettingsMercs}
          />
          <hr />
        </div>
      </div>
    </center>
  </div>
{/await}

<style>
  .team-overflow {
    height: 100%;
    overflow: auto;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .lrow {
    display: flex;
    justify-content: center;
    flex-flow: row;
    flex-wrap: wrap;
    gap: 75px;
  }

  .lcol2 {
    flex: 2;
  }

  h3 {
    text-align: center;
    font-size: 2.5em;
    line-height: 0.5em;
    padding-top: 0px;
    margin-bottom: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
  }

  .selectContainer {
    width: 300px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    background: var(--accent-1);
  }

  .selectContainer :global(::placeholder) {
    color: var(--main-foreground-color) !important;
  }
</style>
