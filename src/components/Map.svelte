<script>
export let currentRoute;
export let params;
import Sidebar from "./Sidebar.svelte";
import {
highlighted_territories,
    lock_highlighted,
    map_type,
    sidebarOpen,
    turn,
    turns,
    modal,
team_territory_counts
} from '../state/state.js';
import Panzoom from 'panzoom';
import MapBase from './MapBase.svelte';
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
faBullseye
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon,
} from 'fontawesome-svelte';
import {
onDestroy,
    onMount
} from 'svelte';
import { getDay } from '../utils/loads.js';
import { normalizeTerritoryName } from '../utils/normalization.js';
import MyMove from "./MyMove.svelte";
import Clock from "./Clock.svelte";
var lockClick = false;
var zooming = false;
onMount(() => {
    window.maphandle = Panzoom(document.getElementById("map"));
    window.maphandle.on('panstart', function(){lockClick = true;})
    window.maphandle.on('panend', function(){lockClick = false});
    let territoryHooks = document.querySelector('#map').querySelector('#Territories').querySelectorAll('path');
    territoryHooks.forEach( el => {
        el.addEventListener('mouseover', handleMouseOver, false);
        el.addEventListener('mouseout', handleMouseOver, false);        
        el.addEventListener('click', handleMouseOver, false); 
        el.addEventListener('touchstart', handleMouseOverPrevention,false);
        el.addEventListener('touchend', handleMouseOver, false);        
    });
    document.addEventListener("keydown", handleWindowKeyDown);
});

function handleWindowKeyDown(event) {
    if (event.key === "Escape") {
      lock_highlighted.set(false);
      $highlighted_territories.style.fill =
        $highlighted_territories.info.primaryColor;
    }
  }

function handleMouseOverPrevention(e){
    if(e.touches.length > 1){
        zooming = true;
    } else {
        zooming = false;
    }
}

function handleMouseOver(e){
    if(e.target.info == undefined) return;
    if(e.type == 'mouseover'){
        if($lock_highlighted) return;
        e.target.style.fill = e.target.info.secondaryColor;
        highlighted_territories.set(e.target);
    } else if (e.type == 'mouseout') {
        if($lock_highlighted) return;
        e.target.style.fill = e.target.info.primaryColor;
        highlighted_territories.set(null);
    }
    else if (!lockClick && (e.type == 'click' || (e.type == "touchend" && !zooming))) {
        if ($highlighted_territories != null){
            $highlighted_territories.style.fill = $highlighted_territories.info.primaryColor;
        }
        sidebarOpen.set(true);
        lock_highlighted.set(true);
        if(e.type == "touchend"){
            var changedTouch = e.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
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
onDestroy(() => {unsub_turn, unsub_type; map_type.set('owners');});

async function recolorMap(){
    // Clear the map visually
    document.querySelectorAll("#map #Territories path").forEach(e=> {e.info = null; e.style.fill = "rgba(128, 128, 128, 0)"});
    let territoryInfo = await getDay($turn);
    var owners = {};
    territoryInfo.forEach(terr => {
        if($map_type == "owners"){
            if(owners[terr.attributeInformation.owner] == null){
                owners[terr.attributeInformation.owner] = 0;
            }
            owners[terr.attributeInformation.owner]++;
        }
        if(terr.name == 'Bermuda' && $map_type == "owners"){
            // Yeet old lines
            document.querySelectorAll('[chaos=true]').forEach(function( node ) {
                node.parentNode.removeChild( node );
            });
                terr.attributeInformation.neighbors.filter(function(obj){return drawChaosLine(normalizeTerritoryName(obj.name))});
        }
        document.querySelector('#map').querySelector(`path#${terr.normalizedName}`).style.fill = terr.primaryColor;
        document.querySelector('#map').querySelector(`path#${terr.normalizedName}`).info = terr;
    });
    if($highlighted_territories != null){
        $highlighted_territories.style.fill = $highlighted_territories.info.secondaryColor;
    }
    team_territory_counts.set(owners);
}

function toggleRegions(){
  document.getElementById('Regions').style.display = (document.getElementById('Regions').style.display == 'none')? 'flex':'none';
}

function toggleBridges(){
  document.getElementById('Bridges').style.display = (document.getElementById('Bridges').style.display == 'none')? 'flex':'none';
}

function toggleMove(){
    modal.set(bind(MyMove));
}

async function drawChaosLine(territory_name){
  var end = document.getElementById("map").getElementById('Bermuda').getBBox();
  var start = document.getElementById("map").getElementById(territory_name).getBBox();
  var start_y = start.y + 0.5*(start.height);
  var start_x = start.x + 0.5*(start.width);
  var end_y = end.y + 0.5*(end.height);
  var end_x = end.x + 0.5*(end.width);
  var newpath = document.createElementNS('http://www.w3.org/2000/svg',"path");
  newpath.setAttributeNS(null, "d", `M ${start_x},${start_y} ${end_x},${end_y}`);
  newpath.setAttributeNS(null, "style", `fill:none;stroke:var(--main-foreground-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;`);
  newpath.setAttributeNS(null, "chaos", "true");
  document.getElementById("map").getElementById('Bridges').appendChild(newpath);
  }
</script>

<Sidebar />
<div class="map-container">
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
    <button on:click={toggleMove} title="regions">
        <FontAwesomeIcon icon={faBullseye} />
    </button>
    <button on:click={toggleBridges} title="bridges">
        <FontAwesomeIcon icon={faShip} />
    </button>
    <button on:click={showLeaderboard} title="leaderboard">
        <FontAwesomeIcon icon={faRankingStar} />
    </button>
</div>
<div class="map-controls top-control">
    <label title="owners map" style:background={`${($map_type=='owners')?'var(--accent-1)':'var(--accent-2)'}`}>
        <input bind:group={$map_type} type=radio value={'owners'}/>
        <FontAwesomeIcon icon={faEarthAmericas} />
    </label>
    <select bind:value={$turn} title="select day">
        <option value = {null}><FontAwesomeIcon icon={faThermometerHalf}  />Latest</option>
        {#each $turns.slice(1,$turns.length) as day}
            <option value = {day.id}>{day.season}/{day.day}</option>
        {/each}
    </select>
    <label title="heat map" style:background={`${($map_type=='heat')?'var(--accent-1)':'var(--accent-2)'}`}>
        <input bind:group={$map_type} type=radio value={'heat'}/>
        <FontAwesomeIcon icon={faThermometerHalf}  />
    </label>
</div>
<div class="notices"><Clock/></div>
<div class="map-wrap"><MapBase /></div>
</div>

<style>
    .notices{
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
    cursor: pointer;
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

:global(#map #Territories path) {
    cursor: pointer;
}

.map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

</style>
