import { writable } from "svelte/store";

// Used to store current teams
export const teams = writable([]);

// Used to store current turns
export const turns = writable([]);

// Used to store current season/day
export const turn = writable(0);

// Used to identify map type
export const map_type = writable("owners");