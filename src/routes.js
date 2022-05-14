import Home from "./routes/home.svelte";
import Leaderboard from "./routes/leaderboard.svelte";
import Odds from "./routes/odds.svelte";
import Settings from "./routes/settings.svelte";
import Bugs from "./routes/bugs.svelte";
import Map from "./routes/map.svelte";

const routes = [
  {
    name: `/`,
    layout: DashboardLayout,
    nestedRoutes: [
      { 
        name: "index", 
        redirectTo: "home" 
      },
      {
        name: "home",
        component: Home
      },
      {
        name: "leaderboard",
        component: Leaderboard
      },
      {
        name: "odds",
        component: Odds
      },
      {
        name: "settings",
        component: Settings
      },
      {
        name: "bugs",
        component: Bugs
      },
      {
        name: "map/:season/:day",
        component: Map
      }
    ],
  },
];

export { routes };