import { turns } from "../state/state";
import { get } from 'svelte/store'
import { getTurnsandTeams } from "./loads";
import { getColorForPercentage } from "./map";

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


export async function normalizeOdds(oddsArray, team){
    var maxPlayers, minPlayers, maxOdds, minOdds;
    [maxPlayers, minPlayers] = getMaxMin(oddsArray, "players");
    [maxOdds, minOdds] = getMaxMin(oddsArray, "chance"); //FIXME: remove extra iterations
    var territoryCount = 0; // count of sum of winner = team
    var territoryExpectedCount = 0; // sum of chance
    var oddsElim = 1; // fx of chance
    for (const odd in oddsArray) {
        territoryCount += (oddsArray[odd].winner == team)? 1:0;
        territoryExpectedCount += oddsArray[odd].chance;
        oddsElim *= (1 - oddsArray[odd].chance);
        oddsArray[odd].colorPlayer = getColorForPercentage((oddsArray[odd].players - minPlayers.players) /
        (maxPlayers.players - minPlayers.players) || 0);
        oddsArray[odd].colorHeat = getColorForPercentage((oddsArray[odd].chance - minPlayers.chance) /
        (maxPlayers.chance - minPlayers.chance) || 0);
    }
    let oddsSurvival = Math.floor(100 * (1 - oddsElim)) + "%";
    // Need to return:
    // - Mapping structure with heat/odds colors
    // - oddsSurvival
    // - territoryCount
    // - territoryExpectedCount
    return {
        "oddsArray": oddsArray,
        "oddsSurvival": oddsSurvival,
        "oddsElim": oddsElim,
        "territoryCount": territoryCount,
        "territoryExpectedCount": territoryExpectedCount
    };
}

export function getMaxMin(arr, prop) {
    var max;
    var min;
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
      if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop]))
        min = arr[i];
    }
    return [max, min];
  }