<!-- Decides whether or not to show action button to user -->
<script>
import { onDestroy, onMount } from "svelte";
import { highlighted_territories, turn, modal, user, team_territory_counts } from "../state/state";
import { bind } from "svelte-simple-modal";
import {getTurnInfo, normalizeTerritoryName} from "../utils/normalization";
import Popup from "../components/Popup.svelte";
import Loader from "./Loader.svelte";


var action = null; // Territory ownership
var highlighted = null; // Highlighted territories [Territory]
var localDay = null;

const unsub_day = turn.subscribe(value => localDay = value);
const unsub_highlighted = highlighted_territories.subscribe(value => highlighted = value);
//const unsub_user = user.subscribe(value => $user.team.name = value);
onDestroy(unsub_day, unsub_highlighted); //, unsub_user);

// Logic:
// If a territory is owned by user.active_team.name, AND at least one neighboring territory is not
// then that territory is defendable.
// If a territory is not owned by user.active_team.name, AND at least one neighboring territory is,
// then that territory is attackable.

async function isActionable(neighbors, owner, team, name){
    if (name == 'Bermuda') return;
    let day = await getTurnInfo(null);
    if(day.active == false) return;
    // Special case for 3.0 start where no neighbors are defined
    if(neighbors === null && team == owner) {action = "Defend"; return true};
    if(neighbors !== null) {
        let owners = neighbors.map(item => item["owner"]).filter((value, index, self) => self.indexOf(value) === index);
        if(owner == team && (owners.length > 1 || (owners.length == 1 && owners.indexOf(team) == -1))) {action = "Defend"; return true}
    }
    console.log(team, name);
    let acb = Array.from(document.querySelectorAll('#map > #Territories > path')).some(x => x.info.attributeInformation.owner == team && x.info.canAttack.indexOf(name) != -1);
    if(owner != team && acb) {action = "Attack"; return true}
}

async function runAction(){
		modal.set(bind(
			Popup,
			{
                title: `Submitting Move`,
				message: `Registering your move on ${highlighted.info.attributeInformation.name}...`,
                loading: true
            }
		));
        // TODO: Need to determine if we need to prompt for AON
        let curr_turn = await getTurnInfo(null);
        console.log($team_territory_counts[$user.active_team.name], curr_turn.allOrNothingEnabled);
        var aon_choice = false;
        if($team_territory_counts[$user.active_team.name] == 1 && curr_turn.allOrNothingEnabled){
            aon_choice = confirm("Press Ok to wager All or Nothing, or Cancel to submit a regular move.")
        }
        let promised = await fetch(`/auth/move?target=${highlighted.info.attributeInformation.id}&aon=${aon_choice}&timestamp=${new Date().valueOf()}`);
        if(promised.ok){
            modal.set(bind(
			Popup,
			{
                title: `Move Submitted`,
				message: `Your move on ${highlighted.info.attributeInformation.name} has been successfully made.`,
                loading: false
            }
		));
        } else{
            modal.set(bind(
			Popup,
			{
                title: `Move Failed to Submit`,
				message: `Your move on ${highlighted.info.attributeInformation.name} has failed. Please try again.`,
                loading: false,
                error: true,
            }
		));
        }
}
</script>
{#if $user != null && $user.team != null && $user.team.name != null}
{#if (localDay == null && highlighted != null && $user.team.name != null)}
{#await isActionable(highlighted.info.attributeInformation.neighbors, highlighted.info.attributeInformation.owner,$user.active_team.name, highlighted.info.attributeInformation.name)}
    <Loader/>
{:then is_actionable_unwrapped} 
{#if is_actionable_unwrapped}
<center>
    <input type="button" on:click={runAction} class={action} value={action} />
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

:global(.Defend){
    color: white;
    background: red;
}

:global(.Attack){
    color: white;
    background: green;
}
</style>