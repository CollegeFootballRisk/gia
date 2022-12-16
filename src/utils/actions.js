/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { bind } from "svelte-simple-modal";
import Popup from "../components/Popup.svelte";
import { getTurnInfo } from "../utils/loads";
import {
  modal,
  team_territory_counts,
  user,
  prompt_move,
} from "../state/state";
import { get } from "svelte/store";

export async function runAction(move_to) {
  move_to.preventDefault();
  var terr_name = move_to.target.getAttribute("terr_name");
  var terr_id = move_to.target.getAttribute("terr_id");
  modal.set(
    bind(Popup, {
      title: `Submitting Move`,
      message: `Registering your move on ${terr_name}...`,
      loading: true,
    })
  );
  // TODO: Need to determine if we need to prompt for AON
  let curr_turn = await getTurnInfo(null);
  console.log(
    get(team_territory_counts)[get(user).active_team.name],
    curr_turn.allOrNothingEnabled
  );
  var aon_choice = false;
  if (
    get(team_territory_counts)[get(user).active_team.name] == 1 &&
    curr_turn.allOrNothingEnabled
  ) {
    aon_choice = confirm(
      "Press Ok to wager All or Nothing, or Cancel to submit a regular move."
    );
  }
  let promised = await fetch(`/auth/move`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target: parseInt(terr_id),
      aon: aon_choice,
      timestamp: new Date().valueOf(),
    }),
  });
  if (promised.ok) {
    var summativeHistory = localStorage.getItem("moveHistory");
    let num = await promised.text();
    if (summativeHistory === null) {
      summativeHistory = "//";
    }
    localStorage.setItem(
      "moveHistory",
      summativeHistory + "\n@" + Date.now() + "-" + terr_name + ":" + num
    );
    prompt_move.set(false);
    modal.set(
      bind(Popup, {
        title: `Move Submitted`,
        message: `Your move on ${terr_name} has been successfully made.`,
        loading: false,
      })
    );
  } else {
    var summativeHistory = localStorage.getItem("moveHistory");
    let num = await promised.status;
    if (summativeHistory === null) {
      summativeHistory = "//";
    }
    localStorage.setItem(
      "moveHistory",
      summativeHistory +
        "\n@" +
        Date.now() +
        "ERR" +
        terr_name +
        " CODE :" +
        num
    );
    modal.set(
      bind(Popup, {
        title: `Move Failed to Submit`,
        message: `Your move on ${terr_name} has failed. Please try again.`,
        loading: false,
        error: true,
      })
    );
  }
}
