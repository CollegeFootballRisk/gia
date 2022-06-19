import { turns } from "../state/state";
import { get } from 'svelte/store'
import { getTurnsandTeams } from "./loads";

export function normalizeTerritoryName(name){
    return name.normalize("NFD").replace(/[\u0300-\u036f ']/g, "");
}

// Get turn information for turnID, otherwise will return latest.
export async function getTurnInfo(turnID){
    if(get(turns).length == 0){
        await getTurnsandTeams();
    }
    let ts = get(turns);
    if(turnID == null) return ts[0];
    let t = ts.find(e => {return e.id == turnID});
    if(t == undefined) return ts[0];
    return t;
}

export function normalizeTeamName(team){
    return team.replace(/\W/g, "");
}