import Map from "./components/Map.svelte";
import Odds from "./routes/odds.svelte";
import Settings from "./routes/settings.svelte";
import Bugs from "./routes/bugs.svelte";
import E404 from "./routes/404.svelte";

const routes = [
  {
    name: `/`,
    component: Map,
  },
      {
        name: "login",
        nestedRoutes:[
          {
            name:"reddit",
            redirectTo:"https://google.com/reddit",
          }
        ]
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
      },
      {
        name: '404',
        path: '404.html',
        component: E404,
      }
];

export { routes };