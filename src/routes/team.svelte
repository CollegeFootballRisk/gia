<script>
  import Select from "svelte-select";
  import SvelteTable from "svelte-table";
  import { Line } from "svelte-chartjs";
  import Loader from "../components/Loader.svelte";
  import { getTeam } from "../utils/loads";
  import { getTurnInfo, normalizeTeamName } from "../utils/normalization";
  import PlayerTime from "../components/PlayerTime.svelte";
  import PlayerChart from "../components/PlayerChart.svelte";
  import { teams } from "../state/state";

  export var currentRoute;
  export var params;
  var teamLoad = getTeam(currentRoute.namedParams.team);
  let sortBy = "player";
  let sortOrder = 1;
  let selectedCols = ["player", "turnsPlayed", "mvps"];
  const COLUMNS = {
    player: {
      key: "player",
      title: "Name",
      value: (v) =>
        `<a onclick="window.closeModal()" href="/player/${v.player}">${v.player}</a>`,
      sortable: true,
    },
    turnsPlayed: {
      key: "turnsPlayed",
      title: "Turns",
      value: (v) => v.turnsPlayed,
      sortable: true,
    },
    mvps: { key: "mvps", title: "MVPS", value: (v) => v.mvps, sortable: true },
  };

  $: cols = selectedCols.map((key) => COLUMNS[key]);

  let sortBy2 = "player";
  let sortOrder2 = 1;
  let selectedCols2 = ["team", "player", "turnsPlayed", "mvps"];
  const COLUMNS2 = {
    team: {
      key: "team",
      title: "Team",
      value: (v) =>
        `<a onclick="window.closeModal()" href="/team/${v.team}">${v.team}</a>`,
      sortable: true,
    },
    player: {
      key: "player",
      title: "Name",
      value: (v) =>
        `<a onclick="window.closeModal()" href="/player/${v.player}">${v.player}</a>`,
      sortable: true,
    },
    turnsPlayed: {
      key: "turnsPlayed",
      title: "Turns",
      value: (v) => v.turnsPlayed,
      sortable: true,
    },
    mvps: { key: "mvps", title: "MVPS", value: (v) => v.mvps, sortable: true },
  };

  const getSelectionLabel = (option) => option.name;
  const getOptionLabel = (option) => option.name;

  function handleSelect(event) {
    window.location = `/team/${encodeURIComponent(event.detail.name)}`;
  }

  $: cols2 = selectedCols2.map((key) => COLUMNS2[key]);

  let get_latest = getTurnInfo(null);
</script>

{#await teamLoad}
  <Loader />
{:then team}
  {#if console.log(team)}
    onkeydown
  {/if}
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
          <div class="lcol2">
            <h3>Player Stars:</h3>
            <br />
            <PlayerTime season={latest.season} extern_data={team.teamData} />
          </div>
          <div class="lcol2">
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
          <SvelteTable
            columns={cols}
            rows={team.players}
            bind:sortBy
            bind:sortOrder
            classNameTable={["table table-striped"]}
            classNameThead={["table-primary"]}
            classNameSelect={["custom-select"]}
          />
        </div>
        <div class="lcol2">
          <h3>Mercs:</h3>
          <br />
          <SvelteTable
            columns={cols2}
            rows={team.mercs}
            bind:sortBy2
            bind:sortOrder2
            classNameTable={["table table-striped"]}
            classNameThead={["table-primary"]}
            classNameSelect={["custom-select"]}
          />
        </div>
      </div>
      <!--<SvelteTable
  columns={cols}
  rows={player.turns}
  bind:sortBy
  bind:sortOrder
  classNameTable={["table table-striped"]}
  classNameThead={["table-primary"]}
  classNameSelect={["custom-select"]}
/>-->
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
  }

  .lcol2 {
    flex: 2;
    flex-basis: 50%;
  }

  .lcol {
    flex: 1;
    flex-basis: 33%;
  }
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
