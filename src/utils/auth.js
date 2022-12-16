/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { user } from "../state/state";
import { base_url } from "./loads";

// Returns true if player is logged in and saves data to `user`
export async function isLoggedIn(userv) {
  if (userv != null) return true;
  let get = await fetch(`${base_url}/auth/me`);

  try {
    let json = await get.json();
    if (get.ok) {
      if (typeof json.name != undefined) {
        user.set(json);
        return true;
      }
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

// Returns user's move
export async function getMove() {
  let get = await fetch(`${base_url}/auth/my_move`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: null,
  });
  let text = await get.text();
  if (get.ok) {
    if (text == "") {
      return null;
    } else {
      return text;
    }
  } else {
    throw new Error("Could not get user's move.");
  }
}
