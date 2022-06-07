<script>
// Type variable: options: 'map', 'leaderboard'
export let type;

import {
    turn
} from '../state/state.js';
import Panzoom from 'panzoom';
import MapBase from './MapBase.svelte';
import {
    library
} from '@fortawesome/fontawesome-svg-core';
import {
    faChevronRight,
    faHistory,
    faShip,
    faSearchMinus,
    faSearchPlus,
    faFlag
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText
} from 'fontawesome-svelte';
import Loader from "./Loader.svelte";
import {
onDestroy,
    onMount
} from 'svelte';
import { subscribe } from 'svelte/internal';
import { getDay } from '../utils/loads.js';
import { normalizeTerritoryName } from '../utils/normalization.js';
onMount(() => {
    window.maphandle = Panzoom(document.getElementById("map"))
});

const unsub_turn = turn.subscribe(recolorMap);

onDestroy(unsub_turn);

async function recolorMap(){
    let territoryOwners = await getDay($turn);
    territoryOwners.forEach(terr => {
        document.querySelector('#map').querySelector(`path#${normalizeTerritoryName(terr.name)}`).style.fill = `var(--${terr.owner.replace(/\W/g, "")}-primary)`;
        document.querySelector('#map').querySelector(`path#${normalizeTerritoryName(terr.name)}`).info = terr;
    });
}

function toggleRegions(){
  document.getElementById('Regions').style.display = (document.getElementById('Regions').style.display == 'none')? 'flex':'none';
}

function toggleBridges(){
  document.getElementById('Bridges').style.display = (document.getElementById('Bridges').style.display == 'none')? 'flex':'none';
}
</script>

<div class="map-controls">
    <button
        class="map-control"
        onclick="window.maphandle.zoomTo(500, 500, 1.5);"
        title="zoom in"
        >
        <FontAwesomeIcon icon={faSearchPlus} />
    </button>
    <button
        class="map-control"
        onclick="window.maphandle.zoomTo(500, 500, 0.75);"
        title="zoom out"
        >
        <FontAwesomeIcon icon={faSearchMinus} />
    </button>
    <button
        class="map-control"
        onclick="window.location = '/map';"
        title="history"
        >
        <FontAwesomeIcon icon={faHistory} />
    </button>
    <button on:click={toggleRegions} class="map-control" title="regions">
        <FontAwesomeIcon icon={faFlag} />
    </button>
    <button on:click={toggleBridges} class="map-control" title="bridges">
        <FontAwesomeIcon icon={faShip} />
    </button>
</div>
<div class="map-wrap"><MapBase /></div>

<style>
.map-controls {
    position: absolute;
    bottom: calc(0.1*var(--navbar-height));
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
    font-size: 1.3em;
    line-height: 1em;
    width: 2em;
    height: 2em;
    border: none;
    padding: 0.3em;
    border-radius: 10%;
}

.map-controls button:hover {
    background: var(--accent-1);
}
</style>
