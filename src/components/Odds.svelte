<script>
  import { dataset_dev, onDestroy, onMount } from "svelte/internal";
  import Sidebar from "./Sidebar.svelte";
  import Panzoom from "panzoom";
  export let season;
  export let day;
  export let team;
  import { settings } from "../state/settings";
  export var local_map_type;
  import SvelteTable from "svelte-table";
  import { getTeamOdds } from "../utils/loads";
  import MapBase from "./MapBaseold.svelte";
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
  const showLeaderboard = () => modal.set(bind(Leaderboard));
  onMount(() => {
    window.maphandle = Panzoom(document.getElementById("map"));
    if(!("WebkitTouchCallout" in document.body.style) && $settings.experiments){
      window.maphandle.on("panstart", function () {
      lockClick = true;
      });
    }
    window.maphandle.on("panend", function () {
      lockClick = false;
    });
    let territoryHooks = document
      .querySelector("#map")
      .querySelector("#Territories")
      .querySelectorAll("path");
    territoryHooks.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver, false);
      el.addEventListener("mouseout", handleMouseOver, false);
      el.addEventListener("click", handleMouseOver, false);
      el.addEventListener("touchstart", handleMouseOverPrevention, false);
      el.addEventListener("touchend", handleMouseOver, false);
    });
    document.addEventListener("keydown", handleWindowKeyDown);
  });
  onDestroy(() => {
    highlighted_territories.set(null);
  });
  function handleMouseOverPrevention(e) {
    if (e.touches.length > 1) {
      zooming = true;
    } else {
      zooming = false;
    }
  }

  function handleWindowKeyDown(event) {
    if (event.key === "Escape") {
      lock_highlighted.set(false);
      $highlighted_territories.style.fill =
        $highlighted_territories.info.primaryColor;
    }
  }

  function handleMouseOver(e) {
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
      (e.type == "click" || (e.type == "touchend" && !zooming))
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
  <div class="map-controls {$settings.experiments && lockClick?'red':''}">
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
  .notices {
    color: white;
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

  .red, .red button, .red label, .red select{
    background: red !important;
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
</style>
