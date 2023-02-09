<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import Loader from "../components/Loader.svelte";
  import { user } from "../state/state";
  import { getActionableTerritories } from "../utils/map";
  import { runAction } from "../utils/actions";
  import { settings } from "../state/settings";
  export let territoryInfo;
  async function getMove() {
    return await fetch("/auth/my_move", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: null,
    }).then((response) => {
      if (response.ok) return response.text();
      return "";
    });
  }

  var territoryCapture = getActionableTerritories(territoryInfo, $user);
  console.log(territoryCapture);
</script>

<div>
  {#await getMove()}
    <Loader />
  {:then my_move}
    {#if JSON.parse(my_move) == ""}
      <center><b>Your move has not yet been made</b></center><br />
    {:else}
      <center>
        Your move is on:
        <h2>{JSON.parse(my_move)}</h2>
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
