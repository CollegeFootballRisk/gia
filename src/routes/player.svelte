<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script lang="ts">
  import Select from "svelte-select";
  import SimpleTable from "@a-luna/svelte-simple-tables";
  import type { ColumnSettings } from "@a-luna/svelte-simple-tables/types";
  import type { TableSettings } from "@a-luna/svelte-simple-tables/types";
  import { getPlayer } from "../utils/loads";
  import Loader from "../components/Loader.svelte";
  import { normalizeTeamName } from "../utils/normalization";
  import {
    fa1,
    fa2,
    faAward,
    faJedi,
    faShield,
    faStroopwafel,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { settings } from "../state/settings";

  export var currentRoute;
  const win: Window = window;
  var playerLoad = getPlayer(currentRoute.namedParams.player);

  const teamLink = (v: PlayerTurn): string =>
    `<a onclick="window.closeModal()" href="/team/${encodeURIComponent(
      v.team
    )}">${v.team}</a>`;

  const territoryLink = (v: PlayerTurn): string =>
    `<a onclick="window.closeModal()" href="/territory/${encodeURIComponent(
      v.territory
    )}">${v.territory}</a>`;

  const formatMVP = (v: PlayerTurn): string =>
    v.mvp ? String.fromCharCode(0x272f) : "N";

  interface PlayerTurn {
    season: number;
    day: number;
    seasonDay: string;
    seasonDaySort: number;
    stars: number;
    territory: string;
    team: string;
    mvp: boolean;
  }

  const tableSettings: TableSettings<PlayerTurn> = {
    tableId: "player_turns",
    themeName: $settings.lightmode ? "light" : "dark",
    showHeader: true,
    header: "Turns",
    showSortDescription: true,
    sortBy: "seasonDaySort",
    sortType: "number",
    sortDir: "desc",
    tableWrapper: true,
    clickableRows: false,
    animateSorting: false,
    paginated: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20, 25],
    pageRangeFormat: "compact",
    pageNavFormat: "compact",
  };

  function formatData(x: any): PlayerTurn[] {
    for (var i = 0; i < x.length; i++) {
      x[i]["seasonDay"] = `${x[i]["season"]}/${x[i]["day"]}`;
      x[i]["seasonDaySort"] = x[i]["season"] + x[i]["day"] / 100;
    }
    return x;
  }

  const columnSettings: ColumnSettings<PlayerTurn>[] = [
    {
      propName: "seasonDaySort",
      tooltip: "Turn",
      headerText: "Turn",
      classList: ["text-left"],
      colValue: (x) => x.seasonDay,
    },
    {
      propName: "team",
      headerText: "------------Team------------",
      tooltip: "Team played for",
      classList: ["text-center", "const-width"],
      colValue: teamLink,
    },
    {
      propName: "territory",
      headerText: "----------Territory----------",
      tooltip: "Territory name",
      classList: ["text-center", "const-width"],
      colValue: territoryLink,
    },
    {
      propName: "stars",
      headerText: "Stars",
      tooltip: "Number of stars at time",
    },
    {
      propName: "mvp",
      headerText: "MVP",
      tooltip: "Was MVP?",
      colValue: formatMVP,
    },
  ];

  async function loadOptions(sString) {
    var players = await (
      await fetch(`/api/players/search?s=%${sString}%`)
    ).json();
    return players;
  }
  const getSelectionLabel = (option) => option.value;
  const getOptionLabel = (option) => option.value;

  function handleSelect(event) {
    win.location = `/player/${event.detail.value}`;
  }
</script>

{#await playerLoad}
  <Loader />
{:then player}
  <div class="player-overflow">
    <div class="selectContainer">
      <Select
        {loadOptions}
        on:select={handleSelect}
        {getSelectionLabel}
        {getOptionLabel}
        placeholder="Search ..."
      />
    </div>
    <h1>
      <a target="_blank" href="https://reddit.com/user/{player.name}"
        >{player.platform == "reddit" ? "u/" : ""}{player.name}</a
      >
    </h1>
    <h2
      style:text-shadow={`0px 0px 5px var(--${
        player.team.name == null
          ? "main-foreground-color"
          : normalizeTeamName(player.team.name)
      }-secondary)`}
      style:color={`var(--${
        player.team.name == null
          ? "main-foreground-color"
          : normalizeTeamName(player.team.name)
      }-primary)`}
    >
      {String.fromCharCode(0x272f).repeat(player.ratings.overall)}
    </h2>
    <h4>
      {#if player.team.name != null}
        <a href="/team/{encodeURIComponent(player.team.name)}"
          >{player.team.name == player.active_team.name
            ? player.team.name
            : `${player.team.name}, playing for ${
                player.active_team.name == null
                  ? "Undecided"
                  : player.active_team.name
              }`}</a
        >
      {:else}
        Undecided
      {/if}
    </h4>
    {#if player.awards.length != 0}
      <center>
        <hr />
        <div class="lrow lrowthin">
          {#each player.awards as award}
            <div class="lcol">
              {#if award.name == "Dev"}
                <b title={award.info}
                  ><FontAwesomeIcon icon={faJedi} />&nbsp; {award.name}</b
                >
              {:else if award.name == "Mod"}
                <b title={award.info}
                  ><FontAwesomeIcon icon={faShield} />&nbsp; {award.name}</b
                >
              {:else if award.name == "1"}
                <b title={award.info}><FontAwesomeIcon icon={fa1} /></b>
              {:else if award.name == "2"}
                <b title={award.info}><FontAwesomeIcon icon={fa2} /></b>
              {:else if award.name == "2.1"}
                <b title={award.info}
                  ><FontAwesomeIcon icon={faStroopwafel} />&nbsp; {award.name}</b
                >
              {:else}
                <b title={award.info}
                  ><FontAwesomeIcon icon={faAward} />&nbsp; {award.name}</b
                >
              {/if}
            </div>
          {/each}
        </div>
        <hr />
      </center>
    {/if}
    <center>
      <div class="lrow">
        <div class="lcol2">
          <h3>
            {String.fromCharCode(0x272f).repeat(player.ratings.totalTurns)}
          </h3>
          <i>Total turns:</i><br />
          {player.stats.totalTurns}
        </div>
        <div class="lcol2">
          <h3>
            {String.fromCharCode(0x272f).repeat(player.ratings.gameTurns)}
          </h3>
          <i>Round turns:</i><br />
          {player.stats.gameTurns}
        </div>
      </div>
      <br />
      <div class="lrow">
        <div class="lcol2">
          <h3>{String.fromCharCode(0x272f).repeat(player.ratings.streak)}</h3>
          <i>Streak: </i><br />
          {player.stats.streak}
        </div>
        <div class="lcol2">
          <h3>{String.fromCharCode(0x272f).repeat(player.ratings.mvps)}</h3>
          <i>Total MVPS:</i><br />
          {player.stats.mvps}
        </div>
      </div>
      <br />
      <div class="player">
        {#if player.turns.length > 0}
          <SimpleTable
            data={formatData(player.turns)}
            {columnSettings}
            {tableSettings}
          />
        {:else}
          No turns yet
        {/if}
        <hr />
      </div>
    </center>
  </div>
{/await}

<style>
  :global(.table) {
    color: var(--main-foreground-color) !important;
  }
  .lrow {
    display: flex;
    justify-content: center;
    flex-flow: row;
    flex-wrap: wrap;
  }

  .lcol2 {
    flex: 2;
    flex-basis: 50%;
  }

  .lcol {
    flex: 1;
  }
  /*.lrowthin {
    width: 50%;
  }*/
  h1 {
    padding-top: 10px;
    font-size: 2em;
    text-align: center;
    color: var(--main-foreground-color);
    margin: 0px;
    padding-bottom: 0px;
    line-height: 2em;
    margin-bottom: 0px;
  }

  h2 {
    text-align: center;
    font-size: 3em;
    line-height: 0.5em;
    padding-top: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
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

  h4 {
    text-align: center;
  }

  .player-overflow {
    height: 100%;
    overflow: auto;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
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
