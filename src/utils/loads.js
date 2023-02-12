/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { fetches, turns, teams, map_type } from "../state/state.js";
import { get } from "svelte/store";
import {
  normalizeTerritoryName,
  normalizeTeamName,
} from "../utils/normalization.js";
import { getColorForPercentage } from "./map.js";

export const base_url = "http://localhost:8000/";

export async function getTurnsandTeams(override) {
  if (get(fetches).TurnsandTeams == undefined || override == true) {
    // Since we call this multiple times in multiple places, only run once unless
    // forcefully refreshing :'(
    if (override != true && get(turns).length != 0) return;
    let arr = Promise.all([
      (await fetch(`${base_url}/api/turns`)).json(),
      (await fetch(`${base_url}/api/teams`)).json(),
    ])
      .then((resp) => {
        turns.set(resp[0]);
        teams.set(resp[1]);
        setTeamColors();
      })
      .catch(console.error.bind(console));
    var sum = get(fetches);
    sum.TurnsandTeams = arr;
    fetches.set(sum);
  }
  return get(fetches).TurnsandTeams;
}

export async function setTeamColors() {
  for (let team of get(teams)) {
    document.documentElement.style.setProperty(
      `--${normalizeTeamName(team.name)}-primary`,
      team.colors.primary
    );
    document.documentElement.style.setProperty(
      `--${normalizeTeamName(team.name)}-secondary`,
      team.colors.secondary
    );
  }
}

export async function getDay(turn, team) {
  // Three types of map draws (all, team):
  // Owners (/api/territories, /api/territories)
  // Power Deployed (/api/heat, /team/odds)
  // Forces Deployed (/api/heat, /team/odds)
  //
  // Model:
  // {
  //    name, primaryColor, secondaryColor, attributeInformation
  //}
  let turnData = await getTurnInfo(turn);
  let payload = await (
    await fetch(
      `${base_url}/api/${get(map_type) == "owners" ? "territories" : "heat"}${
        turn == null ? "" : `?season=${turnData.season}&day=${turnData.day}`
      }`
    )
  )
    .json()
    .catch(console.error.bind(console));

  var toReturn = [];
  switch (get(map_type)) {
    case "owners":
      payload.forEach((terr) => {
        toReturn.push({
          name: terr.name,
          normalizedName: normalizeTerritoryName(terr.name),
          primaryColor: `var(--${terr.owner.replace(/\W/g, "")}-primary)`,
          secondaryColor: `var(--${terr.owner.replace(/\W/g, "")}-secondary)`,
          attributeInformation: terr,
          canAttack:
            terr.neighbors == null ? [] : terr.neighbors.map((x) => x.name),
        });
      });
      break;
    case "heat":
      var maxPower = Math.max(...payload.map((t) => t.power));
      payload.forEach((terr) => {
        toReturn.push({
          name: terr.territory,
          normalizedName: normalizeTerritoryName(terr.territory),
          primaryColor: getColorForPercentage(terr.power / maxPower),
          secondaryColor: `var(--${terr.winner.replace(/\W/g, "")}-primary)`,
          attributeInformation: terr,
        });
      });
      break;
  }
  return toReturn;
}

// Returns Leaderboard data for turn
export async function getLeaderboard(turn) {
  let turnData = await getTurnInfo(turn);
  let get = await fetch(
    `${base_url}/api/stats/leaderboard${
      turn == null ? "" : `?season=${turnData.season}&day=${turnData.day + 1}`
    }`
  );
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}

// Gets the ownership history for `territory` for the season of `turn`
export async function getTerritoryHistory(territory, turn) {
  let turnData = await getTurnInfo(turn);
  let get = await fetch(
    `${base_url}/api/territory/history?territory=${territory}&season=${turnData.season}`
  );
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}

// Gets the turn data for a territory
export async function getTerritoryTurn(territory, season, day) {
  if (season == null || day == null || territory == null)
    throw new Error("No turn/territory specified.");
  let get = await fetch(
    `${base_url}/api/territory/turn?season=${season}&day=${day}&territory=${territory}`
  );
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}

// Get player http://localhost:8000/api/player?player={}
export async function getPlayer(player) {
  let get = await fetch(`${base_url}/api/player?player=${player}`);
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}

// Get Team http://localhost:8000/api/teams?team={}
export async function getTeam(team) {
  let players = await fetch(`${base_url}/api/players?team=${team}`).then((v) =>
    v.json()
  );
  let mercs = await fetch(`${base_url}/api/mercs?team=${team}`).then((v) =>
    v.json()
  );
  let stats = await fetch(`${base_url}/api/stats/team?team=${team}`).then((v) =>
    v.json()
  );
  let history = await fetch(
    `${base_url}/api/stats/team/history?team=${team}`
  ).then((v) => v.json());

  let returnable = await Promise.all([players, mercs, stats, history]).then(
    (values) => {
      return {
        teamData: history,
        players: players,
        mercs: mercs,
        teamStats: stats,
      };
    }
  );
  return returnable;
}

// Get player http://localhost:8000/api/team/odds?team,season,day
export async function getTeamOdds(season, day, team) {
  let get = await fetch(
    `${base_url}/api/team/odds?team=${team}&day=${day}&season=${season}`
  );
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}

// Get visited
export async function getVisited(season, team) {
  let get = await fetch(
    `${base_url}/api/team/territories_visited?team=${team}&season=${season}`
  );
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}

// Get turn information for turnID, otherwise will return latest.
export async function getTurnInfo(turnID) {
  if (get(turns).length == 0) {
    throw "Turns not yet loaded";
  }
  let ts = get(turns);
  if (turnID == null) return ts[0];
  let t = ts.find((e) => {
    return e.id == turnID;
  });
  if (t == undefined) return ts[0];
  return t;
}

// Get the turnID from a season and day pair
export async function getTurnID(season, day) {
  if (get(turns).length == 0) {
    await getTurnsandTeams();
  }
  let ts = get(turns);
  if (season == undefined || day == undefined) return null;
  let turn = ts.find((turn) => turn.day == day && turn.season == season);
  if (turn == undefined) return null;
  return turn.id;
}

// Fetches captcha
export async function getNewCaptcha() {
  let get = await fetch(
    `${base_url}/auth/captcha`
  );
  let json = await get.json();

  if (get.ok) {
    return json;
  } else {
    throw new Error(json);
  }
}