<script>
  import { Router } from 'svelte-router-spa';
  import { routes } from './routes.js';
  import { onMount } from "svelte";
  import Map from "./components/Map.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import {
    modal,
    turns,
    turn,
    teams,
    highlighted_territories,
    lock_highlighted,
  } from "./state/state.js";
  import { getTurnsandTeams } from "./utils/loads.js";
  import Modal, { bind } from "svelte-simple-modal";
  import About from "./components/About.svelte";
  import Settings from "./components/Settings.svelte";
import Login from "./components/Login.svelte";
  onMount(async () => {
    // Fetch teams and turns, as these are required for everything:
    await getTurnsandTeams();
    modal.set(bind(Login));
    document.addEventListener(
      "touchmove",
      function (event) {
        event = event.originalEvent || event;
        if (event.scale > 1) {
          event.preventDefault();
        }
      },
      false
    );
    document.addEventListener("keydown", handleWindowKeyDown);
  });
  function handleWindowKeyDown(event) {
    if (event.key === "Escape") {
      lock_highlighted.set(false);
      $highlighted_territories.style.fill =
        $highlighted_territories.info.primaryColor;
    }
  }
  const showAbout = () => modal.set(bind(About));
  const showSettings = () => modal.set(bind(Settings));
</script>

<main>
  <section class="top-nav">
    <div>
      <img
        src="https://collegefootballrisk.com/images/logo-white.png"
        class="logo spin"
        title="CFBR Logo"
        alt="CFBR Logo"
      />
    </div>
    <input id="menu-toggle" type="checkbox" />
    <label class="menu-button-container" for="menu-toggle">
      <div class="menu-button" />
    </label>
    <ul class="menu">
      <li><a href="/">Map</a></li>
      <li><a href="/odds">Odds</a></li>
      <li><a href="#about" on:click={showAbout}>About</a></li>
      <li><a href="https://collegefootballrisk.com/docs/">API</a></li>
      <li><a href="mailto:mautam@usa.com">Bugs</a></li>
      <li><a href="#settings">Settings</a></li>
    </ul>
  </section>
  <div class="main-container">
    <Sidebar />
    <div class="map-container">
      <Router {routes} />
    </div>
  </div>
  <Modal show={$modal} />
</main>

<style>
  /*
*   Navbar from https://alvarotrigo.com/blog/hamburger-menu-css/
*   Font from https://github.com/mozilla/Fira, SIL Open Font License: https://github.com/mozilla/Fira/blob/master/LICENSE
*   FontAwesome Icons, license: https://fontawesome.com/v4/license/
*   Switches: https://www.w3schools.com/howto/howto_css_switch.asp
*/
  :root {
    --accent-1: #4060a8;
    --accent-2: #4ea8ff;
    --accent-fg: #ffffff;
    --accent-bg: #ccc;
    --main-foreground-color: #ffffff;
    --main-background: rgba(45, 45, 50, 1);
    --navbar-height: 50px;
  }

  .top-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--accent-1);
    background: linear-gradient(to right, var(--accent-1), var(--accent-2));
    color: var(--accent-fg);
    height: var(--navbar-height);
    padding: 1em;
    width: 100vw;
    flex: 0 1 auto;
  }

  .top-nav .logo {
    width: 40px;
    height: 40px;
    margin: 5px;
    margin-top: 10px;
  }

  .spin {
    -webkit-animation: spin 4s linear infinite;
    -moz-animation: spin 4s linear infinite;
    animation: spin 4s linear infinite;
  }

  .spin-back {
    -webkit-animation: spin-back 4s linear infinite;
    -moz-animation: spin-back 4s linear infinite;
    animation: spin-back 4s linear infinite;
  }

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-moz-keyframes spin-back {
    100% {
      -moz-transform: rotate(-360deg);
    }
  }

  @-webkit-keyframes spin-back {
    100% {
      -webkit-transform: rotate(-360deg);
    }
  }

  @keyframes spin-back {
    100% {
      -webkit-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }

  @supports (-webkit-touch-callout: none) {
    /*.top-nav .logo {
    /*position: fixed !important;
    /*left: 10px;
    top: 15px !important;
  }*/
  }

  .menu {
    display: flex;
    flex-direction: row;
    list-style-type: none;
    margin: 0;
    padding: 0;
    z-index: 10;
  }

  .menu > li {
    margin: 0 1rem;
    overflow: hidden;
  }

  .menu a {
    color: var(--accent-fg);
    text-decoration: none;
  }

  .menu a:hover {
    text-decoration: dashed underline !important;
  }

  .menu-button-container {
    display: none;
    height: 100%;
    width: 30px;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #menu-toggle {
    display: none;
  }

  .menu-button,
  .menu-button::before,
  .menu-button::after {
    display: block;
    background-color: #fff;
    position: absolute;
    height: 4px;
    width: 30px;
    transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
    border-radius: 2px;
  }

  .menu-button::before {
    content: "";
    margin-top: -8px;
  }

  .menu-button::after {
    content: "";
    margin-top: 8px;
  }

  #menu-toggle:checked + .menu-button-container .menu-button::before {
    margin-top: 0px;
    transform: rotate(405deg);
  }

  #menu-toggle:checked + .menu-button-container .menu-button {
    background: rgba(255, 255, 255, 0);
  }

  #menu-toggle:checked + .menu-button-container .menu-button::after {
    margin-top: 0px;
    transform: rotate(-405deg);
  }

  @media (max-width: 700px) {
    .menu-button-container {
      display: flex;
    }

    .menu {
      position: absolute;
      top: 0;
      margin-top: var(--navbar-height);
      left: 0;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
    }

    #menu-toggle ~ .menu li {
      height: 0;
      margin: 0;
      padding: 0;
      border: 0;
      transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    #menu-toggle:checked ~ .menu li {
      border: 1px solid #333;
      height: 2.5em;
      padding: 0.5em;
      transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    .menu > li {
      display: flex;
      justify-content: center;
      margin: 0;
      padding: 0.5em 0;
      width: 100%;
      color: var(--accent-fg);
      background-color: #222;
    }

    .menu > li:not(:last-child) {
      border-bottom: 1px solid #444;
    }
  }

  /** MAP **/
  main {
    flex: 1 1 auto;
    width: 100vw;
    max-width: 100vw;
    overflow-x: auto;
    background: purple;
  }

  .main-container {
    /* Fill all available space */
    width: 100vw;
    height: 100%;
    max-width: 100vw;
    overflow-x: auto;
    color: var(--main-foreground-color);
    background: var(--main-background);
  }

  .map-container {
    width: 100%;
    height: 100%;
  }
</style>
