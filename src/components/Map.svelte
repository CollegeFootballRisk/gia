<script>
import {
highlighted_territories,
    lock_highlighted,
    map_type,
    sidebarOpen,
    turn,
    turns
} from '../state/state.js';
import Panzoom from 'panzoom';
import MapBase from './MapBase.svelte';
import {
    faHistory,
    faShip,
    faSearchMinus,
    faSearchPlus,
    faFlag,
faEarthAmericas,
faThermometerHalf
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon,
} from 'fontawesome-svelte';
import {
onDestroy,
    onMount
} from 'svelte';
import { getDay } from '../utils/loads.js';
var lockClick = false;
onMount(() => {
    window.maphandle = Panzoom(document.getElementById("map"));
    window.maphandle.on('panstart', function(){lockClick = true;})
    window.maphandle.on('panend', function(){lockClick = false});
    let territoryHooks = document.querySelector('#map').querySelector('#Territories').querySelectorAll('path');
    territoryHooks.forEach( el => {
        el.addEventListener('mouseover', handleMouseOver, false);
        el.addEventListener('mouseout', handleMouseOver, false);        
        el.addEventListener('click', handleMouseOver, false); 
        el.addEventListener('touchend', handleMouseOver, false);        
    });
});

function handleMouseOver(e){
    if(e.type == 'mouseover'){
        if($lock_highlighted) return;
        e.target.style.fill = e.target.info.secondaryColor;
        highlighted_territories.set(e.target);
    } else if (e.type == 'mouseout') {
        if($lock_highlighted) return;
        e.target.style.fill = e.target.info.primaryColor;
        highlighted_territories.set(null);
    }
    else if (!lockClick && (e.type == 'click' || e.type == "touchend")) {
        sidebarOpen.set(true);
        lock_highlighted.set(true);
        if(e.type == "touchend"){
            var changedTouch = e.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        } else {
            var elem = e.target;
        }
        $highlighted_territories.style.fill = elem.info.primaryColor;
        elem.style.fill = elem.info.secondaryColor;
        highlighted_territories.set(elem);
    }
}

const unsub_turn = turn.subscribe(recolorMap);
const unsub_type = map_type.subscribe(recolorMap);

onDestroy(() => {unsub_turn, unsub_type});

async function recolorMap(){
    let territoryInfo = await getDay($turn);
    territoryInfo.forEach(terr => {
        document.querySelector('#map').querySelector(`path#${terr.normalizedName}`).style.fill = terr.primaryColor;
        document.querySelector('#map').querySelector(`path#${terr.normalizedName}`).info = terr;
    });
    if($highlighted_territories != null){
        $highlighted_territories.style.fill = $highlighted_territories.info.secondaryColor;
    }
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
        onclick="window.maphandle.zoomTo(500, 500, 1.5);"
        title="zoom in"
        >
        <FontAwesomeIcon icon={faSearchPlus} />
    </button>
    <button
        onclick="window.maphandle.zoomTo(500, 500, 0.75);"
        title="zoom out"
        >
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
    <button on:click={toggleBridges} title="bridges">
        <FontAwesomeIcon icon={faShip} />
    </button>
</div>
<div class="map-controls top-control">
    <label title="owners map" style:background={`${($map_type=='owners')?'var(--accent-1)':'var(--accent-2)'}`}>
        <input bind:group={$map_type} type=radio value={'owners'}/>
        <FontAwesomeIcon icon={faEarthAmericas} />
    </label>
    <select bind:value={$turn} title="select day">
        <option value = {null}><FontAwesomeIcon icon={faThermometerHalf}  />Latest</option>
        {#each $turns.reverse().slice(1,$turns.length) as day}
            <option value = {day.id}>{day.season}/{day.day}</option>
        {/each}
    </select>
    <label title="heat map" style:background={`${($map_type=='heat')?'var(--accent-1)':'var(--accent-2)'}`}>
        <input bind:group={$map_type} type=radio value={'heat'}/>
        <FontAwesomeIcon icon={faThermometerHalf}  />
    </label>
</div>
<div class="map-wrap"><MapBase /></div>

<style>
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
    bottom: calc(0.1*var(--navbar-height));
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 2;
    white-space: nowrap;
}

.map-controls button, .map-controls label, .map-controls select {
    color: var(--accent-fg);
    background: var(--accent-2);
    height: 2em;
    border: none;
    padding: 0.3em;
    font-size: 1.3em;
    line-height: 1em;
}

.map-controls button, .map-controls label{
    width: 2em;
    border-radius: 10%;
}

.map-controls button:hover, .map-controls label:hover {
    background: var(--accent-1);
}

.map-controls input[type=radio]{
    display: none;
}

.map-controls select {
    float: left;
}

.map-controls label{
    cursor: pointer;
    float: left;
    padding: 0.3em;
    justify-content: center;
    display: flex;
    align-items: center;
}

.map-controls label:first-of-type{
    border-top-right-radius: 0%;
    border-bottom-right-radius: 0%;
}

.map-controls label:last-of-type{
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
}
</style>
