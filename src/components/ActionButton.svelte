<!-- Decides whether or not to show action button to user -->
<script>
import { onDestroy } from "svelte";
import { highlighted_territories, turn, modal, user, team } from "../state/state";
import { bind } from "svelte-simple-modal";
import Popup from "../components/Popup.svelte";


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

function isActionable(neighbors, owner, team){
    if(neighbors === undefined) return;
    let owners = neighbors.map(item => item["owner"]).filter((value, index, self) => self.indexOf(value) === index);
    if(owner == team && (owners.length > 1 || (owners.length == 1 && owners.indexOf(team) == -1))) {action = "Defend"; return true}
    if(owner != team && owners.indexOf(team) != -1) {action = "Attack"; return true}
}


function runAction(){
    let terr = highlighted.info.attributeInformation.name;
		modal.set(bind(
			Popup,
			{
                title: `Submitting Move`,
				message: `Registering your move on ${highlighted.info.attributeInformation.name}...`,
                loading: true
            }
		));
}
</script>
{#if $user.team != null && $user.team.name != null}
{#if (localDay == null && highlighted != null && $user.team.name != null)}
    {#if (isActionable(highlighted.info.attributeInformation.neighbors, highlighted.info.attributeInformation.owner,$user.team.name))}
       <center>
         <input type="button" on:click={runAction} class={action} value={action} />
       </center>
    {/if}
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