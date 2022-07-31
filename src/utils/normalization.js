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

// Get the turnID from a season and day pair
export async function getTurnID(season, day){
    if(get(turns).length == 0){
        await getTurnsandTeams();
    }
    let ts = get(turns);
    if(season == undefined || day == undefined) return null;
    let turn = ts.find(turn => (turn.day == day && turn.season == season));
    if(turn == undefined) return null;
    return turn.id;
}

/**
 * Function to sort alphabetically an array of objects by some specific key.
 * 
 * @param {String} property Key of the object to sort.
 * from https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
 */
 export function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}