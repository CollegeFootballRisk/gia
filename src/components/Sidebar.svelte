<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  export let flavor = "map";
  export let passthrough_data;
  export let team;
  export let finished_load;
  export var territoryInfo;
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import {
    highlighted_territories,
    lock_highlighted,
    sidebarOpen,
    turn,
  } from "../state/state.js";
  import {
    faChevronLeft,
    faChevronRight,
    faPerson,
  } from "@fortawesome/free-solid-svg-icons";
  import Loader from "./Loader.svelte";
  import { onDestroy, onMount } from "svelte";
  import OwnershipHistory from "./OwnershipHistory.svelte";
  import ActionButton from "./ActionButton.svelte";
  import SocialIcons from "@rodneylab/svelte-social-icons";
  function isNullTerr() {
    return $highlighted_territories == null;
  }
  var turnLocal = $turn;
  var territoryLocal = $highlighted_territories;
  const unsub_turn = turn.subscribe(() => {
    turnLocal = $turn;
  });
  const unsub_territory = highlighted_territories.subscribe(() => {
    territoryLocal = $highlighted_territories;
  });

  onMount(() => {
    // credit to Timothy Huang for this regex test:
    // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      sidebarOpen.set(false);
    }
  });

  onDestroy(() => {
    unsub_territory();
    unsub_turn();
  });
  $: territoryName =
    territoryLocal == undefined ? null : territoryLocal.info.name;
</script>

<div class="sidebar" class:is-closed={!$sidebarOpen}>
  <button
    class="sidebar-toggle"
    title="Sidebar Toggle"
    on:click={() => sidebarOpen.set(!$sidebarOpen)}
  >
    <FontAwesomeIcon
      icon={$sidebarOpen ? faChevronLeft : faChevronRight}
      style="color: var(--accent-fg);"
    />
  </button>
  {#if flavor == "map"}
    <center
      ><h2>
        {isNullTerr() ? "North America" : $highlighted_territories.info.name}
      </h2></center
    >
    <ActionButton {territoryInfo} />
    <hr />
    {#if $highlighted_territories != null && $highlighted_territories.info != null && typeof $highlighted_territories.info.attributeInformation != "undefined" && $highlighted_territories.info.attributeInformation.power != null}
      <center
        ><h4>
          Winner: <a
            href="/team/{encodeURIComponent(
              $highlighted_territories.info.attributeInformation.winner
            )}">{$highlighted_territories.info.attributeInformation.winner}</a
          >
        </h4>
        <h4>
          Power: {$highlighted_territories.info.attributeInformation.power}
        </h4>
        <h4>
          Players: {$highlighted_territories.info.attributeInformation.players}
        </h4></center
      >
    {/if}
    {#if $highlighted_territories != null && $highlighted_territories.info != null && $highlighted_territories.info.attributeInformation.owner != undefined}
      <center
        ><h4>
          Owner: <a
            href="/team/{encodeURIComponent(
              $highlighted_territories.info.attributeInformation.owner
            )}">{$highlighted_territories.info.attributeInformation.owner}</a
          >
          <br />
          Region: {$highlighted_territories.info.attributeInformation
            .region_name}
        </h4></center
      >
      <hr />
      {#if typeof $highlighted_territories.info.attributeInformation != "undefined" && $highlighted_territories.info.attributeInformation.neighbors != null}
        <center><h4>Neighbors</h4></center>
        <div style="width: 100%;max-height:20%;overflow:auto;">
          <ul>
            {#each $highlighted_territories.info.attributeInformation.neighbors.sort( (b, a) => b.name.localeCompare(a.name) ) as neighbor}
              <li>
                {neighbor.name}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}
    {#if $lock_highlighted}
      <hr />
      {#key territoryName}
        <OwnershipHistory turn={turnLocal} territory={territoryName} />
      {/key}
      <hr />
    {/if}
  {:else}
    <center>
      <h2>{decodeURIComponent(team)}</h2>
    </center>
    <hr />
    {#if passthrough_data != null}
      <b>Survival Odds:</b>
      {passthrough_data.oddsSurvival}<br />
      <b>Territories Expected:</b>
      {passthrough_data.territoryExpectedCount.toFixed(2)}<br />
      <b>Territories Won:</b>
      {passthrough_data.territoryCount}<br />
      <hr />
    {:else if finished_load}
      <h2 style="color:red;">
        {decodeURIComponent(team)} was eliminated before this turn
      </h2>
    {:else}
      <Loader />
    {/if}
    <center
      ><h2>
        {isNullTerr()
          ? "North America"
          : $highlighted_territories.info.territory}
      </h2></center
    >
    <hr />
    {#if $highlighted_territories != null && $highlighted_territories.info != null}
      <b>Owner: </b><a
        href="/team/{encodeURIComponent($highlighted_territories.info.owner)}"
        >{$highlighted_territories.info.owner}</a
      ><br />
      <b>Winner: </b><a
        href="/team/{encodeURIComponent($highlighted_territories.info.winner)}"
        >{$highlighted_territories.info.winner}</a
      ><br />
      <b>Players: </b>{$highlighted_territories.info.players}<br />
      <b>MVP: </b><a
        href="/player/{encodeURIComponent($highlighted_territories.info.mvp)}"
        >{$highlighted_territories.info.mvp}</a
      ><br />
      {#if $highlighted_territories.info.starBreakdown != null}
        <b>✯: </b>{$highlighted_territories.info.starBreakdown.ones}<br />
        <b>✯✯: </b>{$highlighted_territories.info.starBreakdown.twos}<br />
        <b>✯✯✯: </b>{$highlighted_territories.info.starBreakdown.threes}<br />
        <b>✯✯✯✯: </b>{$highlighted_territories.info.starBreakdown.fours}<br />
        <b>✯✯✯✯✯: </b>{$highlighted_territories.info.starBreakdown.fives}<br />
        <b>Team Power: </b>{$highlighted_territories.info.teamPower}<br />
        <b>Territory Power: </b>{$highlighted_territories.info
          .territoryPower}<br />
        <b>Chance: </b>{(100 * $highlighted_territories.info.chance).toFixed(
          2
        )}%<br />
        <hr />
      {/if}
    {/if}
  {/if}
  <hr />
  <div class="flex-int">
    <a href="https://twitter.com/CFBRisk/">
      <SocialIcons
        network="twitter"
        style="color: var(--accent-fg); height: 26px;width: 26px;"
        alt="Twitter"
        fgColor="var(--accent-fg)"
        bgColor="var(--accent-1)"
        title="CFBR Twitter"
      /></a
    >
    <a href="https://reddit.com/r/collegefootballrisk/">
      <SocialIcons
        network="reddit"
        style="color: var(--accent-fg); height: 26px;width: 26px;"
        alt="Reddit"
        fgColor="var(--accent-fg)"
        bgColor="var(--accent-1)"
        title="CFBR Subreddit"
      />
    </a>
    <a href="http://discord.gg/KG2sKHg">
      <SocialIcons
        network="discord"
        style="color: var(--accent-fg); height: 26px;width: 26px;"
        alt="Discord"
        fgColor="var(--accent-fg)"
        bgColor="var(--accent-1)"
        title="CFBR Discord"
      /></a
    >
    <a href="http://github.com/collegefootballrisk">
      <SocialIcons
        network="github"
        style="color: var(--accent-fg); height: 26px;width: 26px;"
        alt="GitHub"
        fgColor="var(--accent-fg)"
        bgColor="var(--accent-1)"
        title="CFBR GitHub"
      /></a
    >
  </div>
</div>

<style>
  h2,
  h4 {
    margin: 5px;
  }

  hr {
    color: var(--accent-fg);
  }

  .flex-int {
    display: flex;
    justify-content: center;
    flex-flow: row;
    flex-wrap: wrap;
  }

  /** Sidebar **/
  .sidebar-toggle {
    position: fixed;
    z-index: 10;
    border: 4px solid var(--main-foreground-color);
    outline: none;
    width: 40px;
    height: 60px;
    border-radius: 0% 20% 20% 0%;
    margin-left: 17.8em;
    margin-top: calc(50vh - var(--navbar-height));
    background-color: var(--accent-2);
    cursor: pointer;
    transition: 0.5s;
    font-size: 13.3333px;
  }

  .sidebar {
    z-index: 3;
    position: absolute;
    width: 15em;
    height: calc(100vh - var(--navbar-height));
    background-color: var(--accent-2);
    transition: 0.7s;
    border-right: 4px solid var(--main-foreground-color);
    padding-left: 5px;
    padding-right: 5px;
    max-height: calc(100vh - var(--navbar-height));
  }

  .sidebar.is-closed {
    transform: translateX(-15em);
  }
  ul {
    list-style-type: none;
  }
  a {
    color: var(--accent-fg);
    text-decoration: underline;
  }
</style>
