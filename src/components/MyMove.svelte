<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import Loader from "../components/Loader.svelte";
  import { user } from "../state/state";
  import { getActionableTerritories } from "../utils/map";
  import { runAction } from "../utils/actions";
  import { settings } from "../state/settings";
  import { getMove } from "../utils/auth";
  import { onDestroy } from "svelte";
  export let territoryInfo;

  onDestroy(() => {
    history.replaceState(null, null, " ");
  });
  var territoryCapture = getActionableTerritories(territoryInfo, $user);

  async function getMoveWrap() {
    var my_move;
    try {
      let int_my_move = await getMove();
      console.log(int_my_move);
      my_move = JSON.parse(int_my_move);
    } catch (e) {
      console.warn(`Failed to get move, error: ${e}`);
      my_move = -1;
    }
    return my_move;
  }
</script>

<div>
  {#await getMoveWrap()}
    <Loader />
  {:then my_move}
    {#if my_move == ""}
      <center><b>Your move has not yet been made</b></center><br />
    {:else if my_move == -1}
      <center><b color="red">Error fetching move</b></center>
    {:else}
      <center>
        Your move is on:
        <h2>{my_move}</h2>
      </center>
    {/if}
  {/await}
  <!--Show moves that can be made-->
  <i
    ><center
      >You can select a territory to make your move on below:<br /></center
    ></i
  >
  {#if territoryCapture["defendable"].length > 0}
    <h3>Defend:</h3>
    {#each territoryCapture["defendable"].sort( (b, a) => b.name.localeCompare(a.name) ) as defendable}
      <input
        type="button"
        on:click={runAction}
        class="Defend"
        terr_id={defendable.id}
        terr_name={defendable.name}
        value={defendable.name}
      />
    {/each}
  {/if}

  {#if territoryCapture["attackable"].length > 0}
    <h3>Attack:</h3>
    {#each territoryCapture["attackable"].sort( (b, a) => b.name.localeCompare(a.name) ) as attackable}
      <input
        type="button"
        on:click={runAction}
        class="Attack"
        terr_id={attackable.id}
        terr_name={attackable.name}
        value={attackable.name}
      />
    {/each}
  {/if}
<br/><br/><center><i>
  This site is protected by reCAPTCHA and the Google
    <a href="https://policies.google.com/privacy">Privacy Policy</a> and
    <a href="https://policies.google.com/terms">Terms of Service</a> apply.
</i></center>
</div>
{#if $settings.extra_space_bottom_prompt}
  <div class="extra-long" />
{/if}

<style>
  input[type="button"] {
    margin: 5px;
  }

  :global(.Defend, .Attack) {
    height: 2em;
    border: none;
    padding: 0.3em;
    font-size: 1.3em;
    line-height: 1em;
    border-radius: 10%;
    cursor: pointer;
  }

  :global(.Defend:hover, .Attack:hover) {
    background: blue;
  }

  :global(.Defend) {
    color: white;
    background: red;
  }

  :global(.Attack) {
    color: white;
    background: green;
  }
  h2 {
    font-size: 2rem;
    text-align: center;
    color: var(--accent-2);
  }

  :global(.extra-long) {
    width: 100%;
    height: 45vh;
  }
</style>
