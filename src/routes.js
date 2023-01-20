/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Map from "./components/Map.svelte";
import Info from "./routes/info.svelte";
import Player from "./routes/player.svelte";
import Odds from "./routes/odds.svelte";
import Settings from "./routes/settings.svelte";
import E404 from "./routes/404.svelte";
import Team from "./routes/team.svelte";
import Visited from "./routes/visited.svelte";
import Help from "./routes/help.svelte";

const routes = [
  {
    name: `/`,
    component: Map,
  },
  {
    name: "login",
    nestedRoutes: [
      {
        name: "reddit",
        redirectTo: "https://google.com/reddit",
      },
    ],
  },
  {
    name: "map",
    component: Map,
  },
  {
    name: "odds/:season/:day/:team",
    component: Odds,
  },
  {
    name: "visited/:team/:season",
    component: Visited,
  },
  {
    name: "settings",
    component: Settings,
  },
  {
    name: "info",
    component: Info,
  },
  {
    name: "about",
    component: Info,
  },
  {
    name: "help",
    component: Help,
  },
  {
    name: "map/:season/:day",
    component: Map,
  },
  {
    name: "player/:player",
    component: Player,
  },
  {
    name: "team/:team",
    component: Team,
  },
  {
    name: "404",
    path: "404.html",
    component: E404,
  },
];

export { routes };
