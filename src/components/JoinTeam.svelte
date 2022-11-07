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
      if (team.id <= 0) continue;

      // Don't let people select teams not in current season
      if (team.seasons.indexOf($turns[$turns.length - 1].season) == -1) continue;

      // Don't let people join teams with <1 territory if they have a home team:
      if (
        territories.find((t) => {
          return t.attributeInformation.owner == team.name;
        }) == undefined && reason == "eliminated"
      ) {
        continue;
      } else {
        joinableTeams.push(team);
      }
    }
    joinableTeams.sort((p, a) => p.name > a.name);
    return joinableTeams;
  }

  async function handleSubmit(e){
    let formVal = document.querySelector('#team_h').value;
    territories = await fetch(`/auth/join?team=${formVal}`);
    location.reload();
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
      Welcome! <br /><br /> To get started, you will need to select a team. Select your favorite FBS team below:
    </p>
  </center>
{/if}
{#key territories}

{#await territories}
  <Loader />
{:then joinables}
  <center>
    <form action="/auth/join" method="GET" id="team-submit-form" on:submit|preventDefault={handleSubmit}>
      <select name="team_h" id="team_h" title="join team" placeholder="Join Team">
        {#each joinables as team}
          <option value={team.id}>{team.name}</option>
        {/each}
      </select> <br />
      <input type="submit" value="Join" />
    </form>
  </center>
{/await}
{/key}

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }
</style>
