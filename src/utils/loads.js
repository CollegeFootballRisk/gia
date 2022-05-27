import {
    turns,
    turn,
    teams,
    map_type
} from "../state/state.js";
import { get } from 'svelte/store';

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

export async function getDay(season, day, team){
    console.log(map_type);
    // Three types of map draws (all, team):
    // Owners (/api/territories, /api/territories)
    // Power Deployed (/api/heat, /team/odds)
    // Forces Deployed (/api/heat, /team/odds)
    return (await fetch(`${base_url}/api/territories?season=${season}&day=${day}`)).json(), (await fetch(`${base_url}/api/teams`)).json().then((resp) => {
        resp
    })
    .catch(console.error.bind(console));
}