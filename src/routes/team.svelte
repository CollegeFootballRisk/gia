<script>
    import SvelteTable from "svelte-table";
import { getTeam } from "../utils/loads";
import Loader from "../components/Loader.svelte";
import { normalizeTeamName } from "../utils/normalization";

    export var currentRoute;
    export var params;
    console.log(currentRoute);
    var teamLoad = getTeam(currentRoute.namedParams.team);
    let sortBy = "season";
  let sortOrder = 1;
  let selectedCols = [
    "season",
    "day",
    "stars",
    "territory",
    "team",
    "mvp"
  ];
  const COLUMNS = {
    season: { key: "season", title: "Season", value: (v) => v.season, sortable: true },
    day: { key: "day", title: "Day", value: (v) => v.day, sortable: true },
    stars: { key: "stars", title: "Stars", value: (v) => v.stars, sortable: true },
    territory: { key: "territory", title: "Territory", value: (v) => v.territory, sortable: true },
    team: { key: "team", title: "Team", value: (v) => v.team, sortable: true },
    mvp: { key: "mvp", title: "MVP", value: (v) => (v.mvp)?String.fromCharCode(0x272F):'', sortable: true },
  };

  $: cols = selectedCols.map(key => COLUMNS[key]);
  </script>
  {#await teamLoad}
  <Loader/>
  {:then team} 
  {#if console.log(team)}
  onkeydown
  {/if}
  <h1>{team.teamStats.team}</h1>
  <center>
  <div class="lrow">
    <div class="lcol2">
        <i>Mercs:</i><br> {team.teamStats.mercs}
    </div>
    <div class="lcol2">
        <i>Players:</i><br> {team.teamStats.players}
    </div>
</div>
<br>
<div class="lrow">
    <div class="lcol2">
        <i>Stars: </i><br> {team.teamStats.stars}
    </div>
    <div class="lcol2">
        <i>Territories:</i><br> {team.teamStats.territories}
    </div>
</div>
    <br>
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
  
  {/await}

  <style>
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
</style>