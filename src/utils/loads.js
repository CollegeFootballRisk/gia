import {
    turns,
    turn,
    teams,
    map_type
} from "../state/state.js";
import { get } from 'svelte/store';
import { normalizeTerritoryName } from '../utils/normalization.js';
import { getColorForPercentage } from "./map.js";

export const base_url = "https://collegefootballrisk.com/";

export async function getTurnsandTeams() {
    return await Promise.all([(await fetch(`${base_url}/api/turns`)).json(), (await fetch(`${base_url}/api/teams`)).json()]).then((resp) => {
            turns.set(resp[0])
            teams.set(resp[1])
            setTeamColors();
        })
        .catch(console.error.bind(console));
}

export async function setTeamColors(){
    for (let team of get(teams)){
        document.documentElement.style.setProperty(`--${team.name.replace(/\W/g, "")}-primary`, team.colors.primary); 
        document.documentElement.style.setProperty(`--${team.name.replace(/\W/g, "")}-secondary`, team.colors.secondary); 
    }
}

export async function getDay(turn, team){
    // Three types of map draws (all, team):
    // Owners (/api/territories, /api/territories)
    // Power Deployed (/api/heat, /team/odds)
    // Forces Deployed (/api/heat, /team/odds)
    // 
    // Model:
    // {
    //    name, primaryColor, secondaryColor, attributeInformation
    //}
    let payload = await (await fetch(`${base_url}/api/${(get(map_type) == 'owners')?'territories':'heat'}${(turn == null)?'':`?season=${turn[0]}&day=${turn[1]}`}`)).json()
    .catch(console.error.bind(console));

    var toReturn = [];
    switch (get(map_type)){
        case 'owners':
            payload.forEach(terr => {
                toReturn.push({
                    name: terr.name,
                    normalizedName: normalizeTerritoryName(terr.name),
                    primaryColor: `var(--${terr.owner.replace(/\W/g, "")}-primary)`,
                    secondaryColor: `var(--${terr.owner.replace(/\W/g, "")}-secondary)`,
                    attributeInformation: terr
                });
            });
            break;
        case 'heat':
            var maxPower = Math.max(...payload.map(t => t.power));
            payload.forEach(terr => {
                toReturn.push({
                    name: terr.territory,
                    normalizedName: normalizeTerritoryName(terr.territory),
                    primaryColor: getColorForPercentage(terr.power / maxPower),
                    secondaryColor: `var(--${terr.winner.replace(/\W/g, "")}-primary)`,
                    attributeInformation: terr
                });
            });
            break;
    }
    return toReturn;
}

export async function fetch_leaderboard(turn){
    let get = await fetch(`${base_url}/api/stats/leaderboard${(turn == null)?'':`?season=${turn[0]}&day=${turn[1]}`}`);
    let json = await get.json();

    if(get.ok){
        return json;
    } else{
        throw new Error(json);
    }
}