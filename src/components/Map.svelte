<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import Sidebar from "./Sidebar.svelte";
  import {
    highlighted_territories,
    lock_highlighted,
    map_type,
    sidebarOpen,
    turn,
    turns,
    modal,
    team_territory_counts,
    user,
    prompt_move,
  } from "../state/state.js";

  import { settings } from "../state/settings";

  import MapBase from "./MapBase.svelte";
  import Modal, { bind } from "svelte-simple-modal";
  import Leaderboard from "./Leaderboard.svelte";
  import {
    faHistory,
    faShip,
    faSearchMinus,
    faSearchPlus,
    faFlag,
    faEarthAmericas,
    faThermometerHalf,
    faRankingStar,
    faBullseye,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { onDestroy, onMount } from "svelte";
  import { getDay } from "../utils/loads.js";
  import { normalizeTerritoryName } from "../utils/normalization.js";
  import MyMove from "./MyMove.svelte";
  import Clock from "./Clock.svelte";
  import { setupMapPanZoom } from "../utils/map";
  var lockClick = false;
  var zooming = false;

  onMount(() => {
    setupMapPanZoom(handleMouseOver, handleWindowKeyDown);
    window.maphandle.on("panend", function () {
      lockClick = false;
    });
  });

  function handleWindowKeyDown(event) {
    if (event.key === "Escape") {
      lock_highlighted.set(false);
      $highlighted_territories.style.fill =
        $highlighted_territories.info.primaryColor;
    }
  }

  function handleMouseOver(e) {
    if (
      !lockClick &&
      (e.type == "click" ||
        e.type == "mousedown" ||
        (e.type == "touchend" && !zooming)) &&
      $lock_highlighted &&
      e.target == document.getElementById("map")
    ) {
      lock_highlighted.set(false);
      $highlighted_territories.style.fill =
        $highlighted_territories.info.primaryColor;
      highlighted_territories.set(null);
      return;
    }
    if (e.target.info == undefined) return;
    if (e.type == "mouseover") {
      if ($lock_highlighted) return;
      e.target.style.fill = e.target.info.secondaryColor;
      highlighted_territories.set(e.target);
    } else if (e.type == "mouseout") {
      if ($lock_highlighted) return;
      e.target.style.fill = e.target.info.primaryColor;
      highlighted_territories.set(null);
    } else if (
      !lockClick &&
      (e.type == "click" ||
        e.type == "mousedown" ||
        (e.type == "touchend" && !zooming))
    ) {
      if ($highlighted_territories != null) {
        $highlighted_territories.style.fill =
          $highlighted_territories.info.primaryColor;
      }
      sidebarOpen.set(true);
      lock_highlighted.set(true);
      if (e.type == "touchend") {
        var changedTouch = e.changedTouches[0];
        var elem = document.elementFromPoint(
          changedTouch.clientX,
          changedTouch.clientY
        );
      } else {
        var elem = e.target;
      }
      elem.style.fill = elem.info.secondaryColor;
      highlighted_territories.set(elem);
    }
  }

  const showLeaderboard = () => modal.set(bind(Leaderboard));
  const unsub_turn = turn.subscribe(recolorMap);
  const unsub_type = map_type.subscribe(recolorMap);
  onDestroy(() => {
    unsub_turn(), unsub_type();
    map_type.set("owners");
    highlighted_territories.set(null);
  });
  var territoryInfo;
  async function recolorMap() {
    // Clear the map visually
    document.querySelectorAll("#map #Territories path").forEach((e) => {
      e.info = null;
      e.style.fill = "rgba(128, 128, 128, 0)";
    });
    territoryInfo = await getDay($turn);
    var owners = {};
    territoryInfo.forEach((terr) => {
      if ($map_type == "owners") {
        if (owners[terr.attributeInformation.owner] == null) {
          owners[terr.attributeInformation.owner] = 0;
        }
        owners[terr.attributeInformation.owner]++;
      }
      if (terr.name == "Bermuda" && $map_type == "owners") {
        // Yeet old lines
        document.querySelectorAll("[chaos=true]").forEach(function (node) {
          node.parentNode.removeChild(node);
        });
        terr.attributeInformation.neighbors.filter(function (obj) {
          return drawChaosLine(normalizeTerritoryName(obj.name));
        });
      }
      try {
        document
          .querySelector("#map")
          .querySelector(`path#${terr.normalizedName}`).style.fill =
          terr.primaryColor;
        document
          .querySelector("#map")
          .querySelector(`path#${terr.normalizedName}`).info = terr;
      } catch {
        console.log(`Couldn't find territory ${terr.normalizedName}`);
      }
    });
    if ($highlighted_territories != null) {
      $highlighted_territories.style.fill =
        $highlighted_territories.info.secondaryColor;
    }
    team_territory_counts.set(owners);
  }

  function toggleRegions() {
    document.getElementById("Regions").style.display =
      document.getElementById("Regions").style.display == "none"
        ? "flex"
        : "none";
  }

  function toggleBridges() {
    document.getElementById("Bridges").style.display =
      document.getElementById("Bridges").style.display == "none"
        ? "flex"
        : "none";
  }

  function toggleMove() {
    modal.set(bind(MyMove, { territoryInfo: territoryInfo }));
  }

  async function drawChaosLine(territory_name) {
    var end = document
      .getElementById("map")
      .getElementById("Bermuda")
      .getBBox();
    var start = document
      .getElementById("map")
      .getElementById(territory_name)
      .getBBox();
    var start_y = start.y + 0.5 * start.height;
    var start_x = start.x + 0.5 * start.width;
    var end_y = end.y + 0.5 * end.height;
    var end_x = end.x + 0.5 * end.width;
    var newpath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    newpath.setAttributeNS(
      null,
      "d",
      `M ${start_x},${start_y} ${end_x},${end_y}`
    );
    newpath.setAttributeNS(
      null,
      "style",
      `fill:none;stroke:var(--main-foreground-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;`
    );
    newpath.setAttributeNS(null, "chaos", "true");
    document
      .getElementById("map")
      .getElementById("Bridges")
      .appendChild(newpath);
  }

  async function promptMoveCheck(user) {
    if ($settings.prompt_move == false) {
      $prompt_move = false;
      return;
    }
    let move = await fetch("/auth/my_move", {
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
    if (JSON.parse(move) == "") {
      $prompt_move = true;
    } else {
      $prompt_move = false;
    }
  }

  $: promptMoveCheck($user);
</script>

<Sidebar />
<div class="map-container">
  <div class="map-controls">
    {#if $prompt_move}
      <center class="note"
        >Click <b style="font-size:0.5em">&#127919;</b> to submit your move
        <b style="font-size:0.5em">&#10549;</b></center
      >
    {/if}
    <button onclick="window.maphandle.zoomTo(500, 500, 1.5);" title="zoom in">
      <FontAwesomeIcon icon={faSearchPlus} />
    </button>
    <button onclick="window.maphandle.zoomTo(500, 500, 0.75);" title="zoom out">
      <FontAwesomeIcon icon={faSearchMinus} />
    </button>
    <button
      onclick="window.maphandle.moveTo(0,0); window.maphandle.zoomTo(0, 0, 1/window.maphandle.getTransform()['scale']);"
      title="reset map"
    >
      <FontAwesomeIcon icon={faHistory} />
    </button>
    <button on:click={toggleRegions} title="regions">
      <FontAwesomeIcon icon={faFlag} />
    </button>
    {#key $user}
      {#if $user != null}
        <button
          on:click={toggleMove}
          title="your move"
          style:animation={$prompt_move
            ? "5000ms ease-in-out infinite color-change"
            : ""}
        >
          <FontAwesomeIcon icon={faBullseye} />
        </button>
      {/if}
    {/key}
    <button on:click={toggleBridges} title="bridges">
      <FontAwesomeIcon icon={faShip} />
    </button>
    <button on:click={showLeaderboard} title="leaderboard">
      <FontAwesomeIcon icon={faRankingStar} />
    </button>
  </div>
  <div class="map-controls top-control">
    <label
      title="owners map"
      style:background={`${
        $map_type == "owners" ? "var(--accent-1)" : "var(--accent-2)"
      }`}
    >
      <input bind:group={$map_type} type="radio" value={"owners"} />
      <FontAwesomeIcon icon={faEarthAmericas} />
    </label>
    <select bind:value={$turn} title="select day">
      <option value={null}
        ><FontAwesomeIcon icon={faThermometerHalf} />Latest</option
      >
      {#each $turns.slice(1, $turns.length) as day}
        <option value={day.id}>{day.season}/{day.day}</option>
      {/each}
    </select>
    <label
      title="heat map"
      style:background={`${
        $map_type == "heat" ? "var(--accent-1)" : "var(--accent-2)"
      }`}
    >
      <input bind:group={$map_type} type="radio" value={"heat"} />
      <FontAwesomeIcon icon={faThermometerHalf} />
    </label>
  </div>
  <div class="notices"><Clock /></div>
  <div class="map-wrap"><MapBase /></div>
</div>

<style>
  .notices {
    color: var(--main-foreground-color);
    position: absolute;
    top: calc(var(--navbar-height));
    right: 0%;
    margin: 5px;
    z-index: 2;
    white-space: nowrap;
  }
  .map-wrap {
    overflow: hidden;
  }
  .top-control {
    position: absolute;
    top: calc(var(--navbar-height));
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 2;
    white-space: nowrap;
    bottom: unset !important;
  }

  .map-controls {
    position: absolute;
    bottom: calc(0.1 * var(--navbar-height));
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 2;
    white-space: nowrap;
  }

  .map-controls button,
  .map-controls label,
  .map-controls select {
    color: var(--accent-fg);
    background: var(--accent-2);
    height: 2em;
    border: none;
    padding: 0.3em;
    font-size: 1.3em;
    line-height: 1em;
  }

  .map-controls button,
  .map-controls label {
    width: 2em;
    border-radius: 10%;
    cursor: pointer;
  }

  .map-controls button:hover,
  .map-controls label:hover {
    background: var(--accent-1);
  }

  .map-controls input[type="radio"] {
    display: none;
  }

  .map-controls select {
    float: left;
  }

  .map-controls label {
    cursor: pointer;
    float: left;
    padding: 0.3em;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .map-controls label:first-of-type {
    border-top-right-radius: 0%;
    border-bottom-right-radius: 0%;
  }

  .map-controls label:last-of-type {
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
  }

  :global(#map #Territories path) {
    cursor: pointer;
  }

  .map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  @keyframes -global-color-change {
    0% {
      background-color: teal;
    }
    20% {
      background-color: gold;
    }
    40% {
      background-color: indianred;
    }
    60% {
      background-color: violet;
    }
    80% {
      background-color: green;
    }
    100% {
      background-color: teal;
    }
  }
</style>
