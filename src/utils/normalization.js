import { turns } from "../state/state";
import { get } from 'svelte/store'
import { getTurnsandTeams } from "./loads";

export function normalizeTerritoryName(name){
    return name.normalize("NFD").replace(/[\u0300-\u036f ]/g, "");
}

// Get turn information for turnID, otherwise will return latest.
export async function getTurnInfo(turnID){
    if(get(turns).length == 0){
        await getTurnsandTeams();
    }
    let ts = get(turns);
    if(turnID == null) return ts[ts.length - 1];
    let t = ts.find(e => {return e.id == turnID});
    if(t == undefined) return ts[ts.length - 1];
    return t;
}