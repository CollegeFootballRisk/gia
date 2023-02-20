<!-- Decides whether or not to show action button to user -->
<script>
  export var territoryInfo;
  import { onDestroy } from "svelte";
  import { highlighted_territories, turn, user } from "../state/state";
  import { getTurnInfo } from "../utils/loads";
  import Loader from "./Loader.svelte";
  import { runAction } from "../utils/actions";
  import { normalizeTerritoryName } from "../utils/normalization";
  import { getActionableTerritories } from "../utils/map";

  var action = null; // Territory ownership
  var highlighted = null; // Highlighted territories [Territory]
  var localDay = null;

  const unsub_day = turn.subscribe((value) => (localDay = value));
  const unsub_highlighted = highlighted_territories.subscribe(
    (value) => (highlighted = value)
  );
  //const unsub_user = user.subscribe(value => $user.team.name = value);
  onDestroy(unsub_day, unsub_highlighted); //, unsub_user);

  // Logic:
  // If a territory is owned by user.active_team.name, AND at least one neighboring territory is not
  // then that territory is defendable.
  // If a territory is not owned by user.active_team.name, AND at least one neighboring territory is,
  // then that territory is attackable.

  async function isActionable(namex) {
    var name = "";
    try {
      name = namex.info.attributeInformation.name;
    } catch {
      return false;
    }

    if (name == "Bermuda") return;
    let day = await getTurnInfo(null);
    if (day.active == false) return;
    var territoryCapture = getActionableTerritories(territoryInfo, $user);
    if (
      territoryCapture["defendable"].filter(
        (a) => normalizeTerritoryName(a.name) == normalizeTerritoryName(name)
      ).length == 1
    ) {
      action = "Defend";
      return true;
    } else if (
      territoryCapture["attackable"].filter(
        (a) => normalizeTerritoryName(a.name) == normalizeTerritoryName(name)
      ).length == 1
    ) {
      action = "Attack";
      return true;
    } else {
      return false;
    }
    // Special case for 3.0 start where no neighbors are defined
    /*if (neighbors === null && team == owner) {
      action = "Defend";
      return true;
    }
    if (neighbors !== null) {
      let owners = neighbors
        .map((item) => item["owner"])
        .filter((value, index, self) => self.indexOf(value) === index);
      if (
        owner == team &&
        (owners.length > 1 ||
          (owners.length == 1 && owners.indexOf(team) == -1))
      ) {
        action = "Defend";
        return true;
      }
    }
    let acb = Array.from(
      document.querySelectorAll("#map > #Territories > path")
    ).some(
      (x) =>
        x.info.attributeInformation.owner == team &&
        x.info.canAttack.indexOf(name) != -1
    );
    if (owner != team && acb) {
      action = "Attack";
      return true;
    }*/
  }
</script>

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

{#if $user != null && $user.team != null && $user.team.name != null}
  {#if localDay == null && highlighted != null && $user.team.name != null}
    {#await isActionable(highlighted)}
      <Loader />
    {:then is_actionable_unwrapped}
      {#if is_actionable_unwrapped}
        <center>
          <input
            type="button"
            on:click={runAction}
            class={action}
            terr_id={highlighted.info.attributeInformation.id}
            terr_name={highlighted.info.attributeInformation.name}
            value={action}
          />
        </center>
      {/if}
    {/await}
  {/if}
{/if}

<style>
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
</style>
