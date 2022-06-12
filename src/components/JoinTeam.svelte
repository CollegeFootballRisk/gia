<script>
  export var reason;
  import { teams, turns } from "../state/state";
  import { getDay } from "../utils/loads";
  import Loader from "./Loader.svelte";
  let territories = getDay(null, null).then((val) => getJoinableTeams(val));

  async function getJoinableTeams(territories) {
    var joinableTeams = [];
    // Let's get a listing of all Joinable teams, that is, all teams with > 1 territory:
    for (const team of $teams) {
      // Don't let people join unjoinable teams
      if (team.name == "Unjoinable Placeholder") continue;

      // Don't let people select teams not in current season
      if (team.seasons.indexOf($turns[$turns.length - 1].season) == -1) continue;

      // Don't let people join teams with <1 territory:
      if (
        territories.find((t) => {
          return t.attributeInformation.owner == team.name;
        }) == undefined
      ) {
        continue;
      } else {
        joinableTeams.push(team);
      }
    }
    console.log(joinableTeams);
    return joinableTeams;
  }
</script>

<h1>Join Team</h1>
{#if reason == "eliminated"}
  <center>
    <p>
      Oh no! Your team has been <b>eliminated.</b> Select a new one to play as:
    </p>
  </center>
{:else}
  <center>
    <p>
      Welcome! <br /> To get started, you will need to select a team. Still-active
      teams:
    </p>
  </center>
{/if}
{#await territories}
  <Loader />
{:then joinables}
  <center>
    <form action="/auth/join" method="GET" id="team-submit-form">
      <select name="team" id="team" title="join team" placeholder="Join Team">
        {#each joinables as team}
          <option value={team.name}>{team.name}</option>
        {/each}
      </select> <br />
      <input type="submit" value="Join" />
    </form>
  </center>
{/await}

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }
</style>
