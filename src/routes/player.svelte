<script>
  import Select from "svelte-select";
  import SvelteTable from "svelte-table";
  import { getPlayer } from "../utils/loads";
  import Loader from "../components/Loader.svelte";
  import { normalizeTeamName } from "../utils/normalization";
  import {
    fa1,
    fa2,
    fa3,
    faAward,
    faJedi,
    faShield,
    faStroopwafel,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";

  export var currentRoute;
  export var params;
  console.log(currentRoute);
  var playerLoad = getPlayer(currentRoute.namedParams.player);
  let sortBy = "season";
  let sortOrder = 1;
  let selectedCols = ["season", "day", "stars", "territory", "team", "mvp"];
  const COLUMNS = {
    season: {
      key: "season",
      title: "Season",
      value: (v) => v.season,
      sortable: true,
    },
    day: { key: "day", title: "Day", value: (v) => v.day, sortable: true },
    stars: {
      key: "stars",
      title: "Stars",
      value: (v) => v.stars,
      sortable: true,
    },
    territory: {
      key: "territory",
      title: "Territory",
      value: (v) => v.territory,
      sortable: true,
    },
    team: { key: "team", title: "Team", value: (v) => v.team, sortable: true },
    mvp: {
      key: "mvp",
      title: "MVP",
      value: (v) => (v.mvp ? String.fromCharCode(0x272f) : ""),
      sortable: true,
    },
  };

  $: cols = selectedCols.map((key) => COLUMNS[key]);
  async function loadOptions(sString) {
    var players = await (
      await fetch(`/api/players/search?s=%${sString}%`)
    ).json();
    return players;
  }
  const getSelectionLabel = (option) => option.value;
  const getOptionLabel = (option) => option.value;

  function handleSelect(event) {
    window.location = `/player/${event.detail.value}`;
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
    <h1>{player.name}</h1>
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
        <a
          href="/team/{player.team.name == player.active_team.name
            ? encodeURIComponent(player.team.name)
            : `${player.team.name}, playing for ${
                player.active_team.name == null
                  ? 'Undecided'
                  : encodeURIComponent(player.active_team.name)
              }`}"
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
        <SvelteTable
          columns={cols}
          rows={player.turns}
          bind:sortBy
          bind:sortOrder
          classNameTable={["table table-striped"]}
          classNameThead={["table-primary"]}
          classNameSelect={["custom-select"]}
        />
      </div>
    </center>
  </div>
{/await}

<style>
  :global(.table){
    color: var(--main-foreground-color) !important;
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
  .lrowthin {
    width: 50%;
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
