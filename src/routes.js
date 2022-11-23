import Map from "./components/Map.svelte";
import About from "./components/About.svelte";
import Player from "./routes/player.svelte";
import Odds from "./routes/odds.svelte";
import Settings from "./routes/settings.svelte";
import E404 from "./routes/404.svelte";
import Team from "./routes/team.svelte";

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
    name: "settings",
    component: Settings,
  },
  {
    name: "about",
    component: About,
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
