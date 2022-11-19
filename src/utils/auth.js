import { user } from "../state/state";
import { base_url } from "./loads";

// Returns true if player is logged in and saves data to `user`
export async function isLoggedIn(userv) {
  if (userv != null) return true;
  let get = await fetch(`${base_url}/api/me`);

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
  let get = await fetch(`${base_url}/auth/my_move`);
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
