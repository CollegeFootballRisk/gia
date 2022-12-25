<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { onDestroy, onMount } from "svelte/internal";
  import Sidebar from "./Sidebar.svelte";
  export let season;
  export let day;
  export let team;
  export var local_map_type;
  import { getTeamOdds } from "../utils/loads";
  import MapBase from "./MapBase.svelte";
  import {
    normalizeOdds,
    normalizeTerritoryName,
  } from "../utils/normalization";
  import {
    faHistory,
    faSearchMinus,
    faSearchPlus,
    faTable,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import {
    highlighted_territories,
    lock_highlighted,
    modal,
    sidebarOpen,
  } from "../state/state.js";
  import { setupMapPanZoom } from "../utils/map";
  var lockClick = false;
  var zooming = false;
  var t_data;
  var finished_load = false;

  async function doNext(season, day, team) {
    t_data = null;
    finished_load = false;
    return getTeamOdds(season, day, team)
      .then((sent) => normalizeOdds(sent, team))
      .then((val) => {
        t_data = val;
        finished_load = true;
      })
      .catch((error) => {
        finished_load = true;
        return { error: error };
      });
  }
  $: waitKey = doNext(season, day, team);

  $: recolorMap(t_data, local_map_type);

  onMount(() => {
    setupMapPanZoom(handleMouseOver, handleWindowKeyDown);
    window.maphandle.on("panend", function () {
      lockClick = false;
    });
  });
  onDestroy(() => {
    highlighted_territories.set(null);
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
      (e.type == "mousedown" ||
        e.type == "click" ||
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

  function recolorMap(data, local_map_type) {
    document.querySelectorAll("#map #Territories path").forEach((e) => {
      e.info = null;
      e.style.fill = "rgba(128, 128, 128, 0)";
    });
    if (data == null) return;
    data.oddsArray.forEach((odd) => {
      let t_tag = document
        .querySelector("#map")
        .querySelector(`path#${normalizeTerritoryName(odd.territory)}`);
      switch (local_map_type) {
        case "chance":
          t_tag.style.fill = odd.colorHeat;
          break;
        case "wins":
          t_tag.style.fill = odd.colorWin;
          break;
        case "players":
          t_tag.style.fill = odd.colorPlayer;
          break;
        case "ones":
          t_tag.style.fill = odd.colorOnes;
          break;
        case "twos":
          t_tag.style.fill = odd.colorTwos;
          break;
        case "threes":
          t_tag.style.fill = odd.colorThrees;
          break;
        case "fours":
          t_tag.style.fill = odd.colorFours;
          break;
        case "fives":
          t_tag.style.fill = odd.colorFives;
          break;
        case "territoryPower":
          t_tag.style.fill = odd.colorTerritoryPower;
          break;
        case "teamPower":
          t_tag.style.fill = odd.colorTeamPower;
          break;
        default:
          break;
      }
      t_tag.info = odd;
      t_tag.info.primaryColor = t_tag.style.fill;
      t_tag.info.secondaryColor = "rgba(255,255,255,0.5)";
    });
  }
</script>

<Sidebar flavor="odds" {team} passthrough_data={t_data} {finished_load} />
<div class="map-container">
  <div class="map-controls">
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
    <!--<button on:click={showLeaderboard} title="leaderboard">
      <FontAwesomeIcon icon={faTable} />
    </button>-->
  </div>
  <div class="map-wrap"><MapBase /></div>
</div>

<style>
  .map-wrap {
    overflow: hidden;
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

  .map-controls button {
    color: var(--accent-fg);
    background: var(--accent-2);
    height: 2em;
    border: none;
    padding: 0.3em;
    font-size: 1.3em;
    line-height: 1em;
  }

  .map-controls button {
    width: 2em;
    border-radius: 10%;
    cursor: pointer;
  }

  .map-controls button:hover {
    background: var(--accent-1);
  }

  :global(#map #Territories path) {
    cursor: pointer;
  }

  .map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
