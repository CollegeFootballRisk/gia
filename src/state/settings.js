/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// TODO: Implement a getter/setter
export const settings = writable("settings", {
  lightmode: false,
  images: false,
  prompt_move: true,
  // Deprecated
  dont_check_map_lock: false,
  experiments: false,
  pulse_territories: false,
  default_page_size: 10,
  bridges_default: false,
  regions_default: false,
  extra_space_bottom_prompt: false,
  branding_mode: 'normal',
  show_labels: true,
  pin_move: true,
});
import { writable } from "svelte-local-storage-store";

let darkMode = true;

function handleSwitchDarkMode() {
  darkMode = !darkMode;

  localStorage.setItem("theme", darkMode ? "dark" : "light");

  darkMode
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
}

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  darkMode = true;
} else {
  document.documentElement.classList.remove("dark");
  darkMode = false;
}
