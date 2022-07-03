<!-- Decides whether or not to show action button to user -->
<script>
import { onDestroy } from "svelte";
import { highlighted_territories, turn, user } from "../state/state";
import Loader from "../components/Loader.svelte";

var action = null; // Territory ownership
var highlighted = null; // Highlighted territories [Territory]
var localUser = "Texas A&M"; // Logged in User.
var localDay = null;

const unsub_day = turn.subscribe(value => localDay = value);
const unsub_highlighted = highlighted_territories.subscribe(value => highlighted = value);
//const unsub_user = user.subscribe(value => localUser = value);
onDestroy(unsub_day, unsub_highlighted); //, unsub_user);

// Logic:
// If a territory is owned by user.active_team.name, AND at least one neighboring territory is not
// then that territory is defendable.
// If a territory is not owned by user.active_team.name, AND at least one neighboring territory is,
// then that territory is attackable.

function isActionable(neighbors, owner, team){
    let owners = neighbors.map(item => item["owner"]).filter((value, index, self) => self.indexOf(value) === index);
    if(owner == team && (owners.length > 1 || (owners.length == 1 && owners.indexOf(team) == -1))) {action = "Defend"; return true}
    if(owner != team && owners.indexOf(team) != -1) {action = "Attack"; return true}
}
</script>
{#if (localDay == null && highlighted != null && localUser != null)}
    {#if (isActionable(highlighted.info.attributeInformation.neighbors, highlighted.info.attributeInformation.owner,localUser))}
       <center>
         <input type="button" class={action} value={action} />
       </center>
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