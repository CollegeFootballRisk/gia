/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { writable } from "svelte/store";

// Used to store current teams
export const teams = writable([]);

// Used to store current turns
export const turns = writable([]);

// Used to store current season/day
export const turn = writable(null);

// Used to identify map type
export const map_type = writable("owners");

// Highlighted Territory
export const highlighted_territories = writable(null);

// Lock Highlighted
export const lock_highlighted = writable(false);

// Sidebar Toggled?
export const sidebarOpen = writable(true);

// Modal Displayed
export const modal = writable(null);

// User
export const user = writable(null);

// Team
export const team = writable(null);

// Current fetches
export const fetches = writable({});

// Current AON
export const team_territory_counts = writable([]);

export const prompt_move = writable(false);

export const my_move = writable(null);
