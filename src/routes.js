import Map from "./components/Map.svelte";
import Odds from "./routes/odds.svelte";
import Settings from "./routes/settings.svelte";
import Bugs from "./routes/bugs.svelte";

const routes = [
  {
    name: `/`,
    component: Map,
    nestedRoutes: [
      { 
        name: "/", 
        redirectTo: "map" 
      },
      {
        name: "map",
        component: Map
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