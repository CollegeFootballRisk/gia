/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { getColorForPercentage } from "./map";
import { get } from "svelte/store";
import { settings } from "../state/settings";

export function normalizeTerritoryName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f ']/g, "");
}

export function normalizeTeamName(team) {
  return team.replace(/\W/g, "");
}

/**
 * Function to sort alphabetically an array of objects by some specific key.
 *
 * @param {String} property Key of the object to sort.
 * from https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
 */
export function dynamicSort(property) {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
}

function getPercentage(min, max, val) {
  let l_min = Math.log(min) < 0 ? 0 : Math.log(min);
  let l_max = Math.log(max) < 0 ? 1 : Math.log(max);
  let l_val = Math.log(val) < 0 ? 0 : Math.log(val);
  return (l_val - l_min) / (l_max - l_min);
}

export async function normalizeOdds(oddsArray, team) {
  var max, min;
  [max, min] = getMaxMin(oddsArray);
  var territoryCount = 0; // count of sum of winner = team
  var territoryExpectedCount = 0; // sum of chance
  var oddsElim = 1; // fx of chance
  for (const odd in oddsArray) {
    territoryCount += oddsArray[odd].winner == decodeURIComponent(team) ? 1 : 0;
    territoryExpectedCount += oddsArray[odd].chance;
    oddsElim *= 1 - oddsArray[odd].chance;
    const newMethod = get(settings).experiments;
    oddsArray[odd].colorPlayer = newMethod
      ? getColorForPercentage(
          getPercentage(min["players"], max["players"], oddsArray[odd].players)
        )
      : getColorForPercentage(
          (oddsArray[odd].players - min["players"]) /
            (max["players"] - min["players"]) || 0
        );
    oddsArray[odd].colorHeat = getColorForPercentage(
      (oddsArray[odd].chance - min["chance"]) /
        (max["chance"] - min["chance"]) || 0
    );
    oddsArray[odd].colorWin = getColorForPercentage(
      1 - (oddsArray[odd].winner == decodeURIComponent(team)) ? 1 : 0
    );
    oddsArray[odd].colorOnes = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["ones"],
            max["ones"],
            oddsArray[odd]["starBreakdown"].ones
          )
        )
      : getColorForPercentage(
          (oddsArray[odd]["starBreakdown"].ones - min["ones"]) /
            (max["ones"] - min["ones"]) || 0
        );
    oddsArray[odd].colorTwos = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["twos"],
            max["twos"],
            oddsArray[odd]["starBreakdown"].twos
          )
        )
      : getColorForPercentage(
          (oddsArray[odd]["starBreakdown"].twos - min["twos"]) /
            (max["twos"] - min["twos"]) || 0
        );
    oddsArray[odd].colorThrees = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["threes"],
            max["threes"],
            oddsArray[odd]["starBreakdown"].threes
          )
        )
      : getColorForPercentage(
          (oddsArray[odd]["starBreakdown"].threes - min["threes"]) /
            (max["threes"] - min["threes"]) || 0
        );
    oddsArray[odd].colorFours = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["fours"],
            max["fours"],
            oddsArray[odd]["starBreakdown"].fours
          )
        )
      : getColorForPercentage(
          (oddsArray[odd]["starBreakdown"].fours - min["fours"]) /
            (max["fours"] - min["fours"]) || 0
        );
    oddsArray[odd].colorFives = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["fives"],
            max["fives"],
            oddsArray[odd]["starBreakdown"].fives
          )
        )
      : getColorForPercentage(
          (oddsArray[odd]["starBreakdown"].fives - min["fives"]) /
            (max["fives"] - min["fives"]) || 0
        );
    oddsArray[odd].colorTeamPower = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["teamPower"],
            max["teamPower"],
            oddsArray[odd].teamPower
          )
        )
      : getColorForPercentage(
          (oddsArray[odd].teamPower - min["teamPower"]) /
            (max["teamPower"] - min["teamPower"]) || 0
        );
    oddsArray[odd].colorTerritoryPower = newMethod
      ? getColorForPercentage(
          getPercentage(
            min["territoryPower"],
            max["territoryPower"],
            oddsArray[odd].territoryPower
          )
        )
      : getColorForPercentage(
          (oddsArray[odd].territoryPower - min["territoryPower"]) /
            (max["territoryPower"] - min["territoryPower"]) || 0
        );
  }
  let oddsSurvival = Math.floor(100 * (1 - oddsElim)) + "%";
  // Need to return:
  // - Mapping structure with heat/odds colors
  // - oddsSurvival
  // - territoryCount
  // - territoryExpectedCount
  return {
    oddsArray: oddsArray,
    oddsSurvival: oddsSurvival,
    oddsElim: oddsElim,
    territoryCount: territoryCount,
    territoryExpectedCount: territoryExpectedCount,
  };
}

export function getMaxMin(arr) {
  var max = {};
  var min = {};
  const keys = Object.keys(arr[0]);
  for (const key in keys) {
    if (
      keys[key] == "mvp" ||
      keys[key] == "owner" ||
      keys[key] == "territory" ||
      keys[key] == "winner"
    )
      continue;
    if (keys[key] == "starBreakdown") {
      const keysInner = Object.keys(arr[0]["starBreakdown"]);
      for (const keyInner in keysInner) {
        max[keysInner[keyInner]] = null;
        min[keysInner[keyInner]] = null;
      }
    } else {
      max[keys[key]] = null;
      min[keys[key]] = null;
    }
  }
  for (var i = 0; i < arr.length; i++) {
    for (const key in keys) {
      if (
        keys[key] == "mvp" ||
        keys[key] == "owner" ||
        keys[key] == "territory" ||
        keys[key] == "winner"
      )
        continue;
      if (keys[key] == "starBreakdown") {
        const keysInner = Object.keys(arr[0]["starBreakdown"]);
        for (const keyInner in keysInner) {
          if (
            max[keysInner[keyInner]] == null ||
            parseInt(arr[i]["starBreakdown"][keysInner[keyInner]]) >
              parseInt(max[keysInner[keyInner]])
          ) {
            max[keysInner[keyInner]] =
              arr[i]["starBreakdown"][keysInner[keyInner]];
          }
          if (
            min[keysInner[keyInner]] == null ||
            parseInt(arr[i]["starBreakdown"][keysInner[keyInner]]) <
              parseInt(min[keysInner[keyInner]])
          ) {
            min[keysInner[keyInner]] =
              arr[i]["starBreakdown"][keysInner[keyInner]];
          }
        }
      } else {
        if (
          max[keys[key]] == null ||
          parseFloat(arr[i][keys[key]]) > parseFloat(max[keys[key]])
        ) {
          max[keys[key]] = arr[i][keys[key]];
        }
        if (
          min[keys[key]] == null ||
          parseFloat(arr[i][keys[key]]) < parseFloat(min[keys[key]])
        ) {
          min[keys[key]] = arr[i][keys[key]];
        }
      }
    }
  }
  return [max, min];
}
