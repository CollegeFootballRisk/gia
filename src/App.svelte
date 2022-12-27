<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes";
  import { onMount } from "svelte";
  import { modal, user } from "./state/state.js";
  import { getTurnsandTeams } from "./utils/loads.js";
  import Modal, { bind } from "svelte-simple-modal";
  import { isLoggedIn } from "./utils/auth";
  import Login from "./components/Login.svelte";
  import JoinTeam from "./components/JoinTeam.svelte";
  import { settings } from "./state/settings";
  import Leaderboard from "./components/Leaderboard.svelte";
  onMount(async () => {
    // Fetch teams and turns, as these are required for everything:
    await getTurnsandTeams();
    let loggedIn = await isLoggedIn($user);
    if (!loggedIn) modal.set(bind(Login));
    if ($user != null && ($user.team == null || $user.team.name == null)) {
      modal.set(bind(JoinTeam, { reason: "new" }));
    } else if (
      $user != null &&
      $user.active_team.name == null &&
      $user.team.name != null
    ) {
      modal.set(bind(JoinTeam, { reason: "eliminated" }));
    }
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
  });
  var navShownMobile = false;
  const showLeaderboard = () =>
    modal.set(bind(Leaderboard, { turnToUse: null }));
  const showMe = () => modal.set(bind(Me));
  const goDocs = () => {
    location = "/docs";
  };
  const goBugs = () =>
    (location =
      "https://docs.google.com/forms/d/e/1FAIpQLSf6o60hXZOuCXDIB-YphQtceNcs92k6zlGwJe3iigA7qnvIlA/viewform");
  const hideNav = () => {
    navShownMobile = false;
  };
  $: document.documentElement.setAttribute(
    "data-theme",
    $settings.lightmode ? "light" : "dark"
  );
  $: document.documentElement.setAttribute("data-image", $settings.images);
</script>

<main>
  <section class="top-nav">
    <div>
      <a href="/">
        <img
          src="https://collegefootballrisk.com/images/logo-white.png"
          class="logo"
          title="CFBR Logo"
          alt="CFBR Logo"
        />
      </a>
    </div>
    <input id="menu-toggle" type="checkbox" bind:checked={navShownMobile} />
    <label class="menu-button-container" for="menu-toggle">
      <div class="menu-button" />
    </label>
    <ul class="menu">
      {#key $user}
        {#if $user != null}
          <li>
            <a href="/player/{$user.name}" on:click={showMe}>{$user.name}</a>
          </li>
        {/if}
      {/key}
      <li>
        <a href="#leaderboard" on:click={showLeaderboard}>Leaderboard</a>
      </li>
      <li><a href="/" on:click={hideNav}>Map</a></li>
      <li><a href="/odds" on:click={hideNav}>Odds</a></li>
      <li><a href="/about" on:click={hideNav}>About</a></li>
      <li><a href="/docs/" on:click={goDocs}>API</a></li>
      <li>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSf6o60hXZOuCXDIB-YphQtceNcs92k6zlGwJe3iigA7qnvIlA/viewform"
          on:click={goBugs}>Bugs</a
        >
      </li>
      <li><a href="/settings" on:click={hideNav}>Settings</a></li>
    </ul>
  </section>
  <div class="main-container">
    <Router {routes} />
  </div>
  <Modal classWindow="modalWindow rainbowBorder" show={$modal} />
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
    --accent-3: #4eff4e;
    --accent-fg: #ffffff;
    --accent-bg: #ccc;
    --main-foreground-color: #ffffff;
    --main-background: rgba(45, 45, 50, 1);
    --main-background-color: rgba(45, 45, 50, 1);
    --navbar-height: 50px;
    --itemHoverColor: #ffffff;
    --itemColor: #ffffff;
    --listBackground: #4ea8ff;
    --itemHoverBG: #4060a8;
    --inputColor: #ffffff;
    --background: #4ea8ff;
    --sst-table-wrapper-bg-color: var(--main-background-color);
--sst-table-wrapper-border-color: var(--accent-1);
--sst-text-color: var(--main-foreground-color);
--sst-link-text-color: var(--accent-3);
--sst-link-hover-text-color: var(--accent-1);
--sst-table-outer-border-color: var(--accent-1);
--sst-table-header-text-color: var(--main-foreground-color);
--sst-sort-description-text-color: var(--accent-2);
--sst-page-range-description-text-color: var(--accent-2);
--sst-col-header-bg-color: var(--listBackground);
--sst-col-header-text-color: var(--itemColor);
--sst-col-header-vert-border-color: var(--accent-1);
--sst-col-header-horiz-border-color: var(--accent-1);
--sst-col-header-highlight-sort-bg-color: var(--accent-1);
--sst-col-header-highlight-sort-text-color: var(--main-foreground-color);
--sst-col-header-highlight-sort-vert-border-color: var(--accent-1);
--sst-col-header-highlight-sort-horiz-border-color: var(--accent-1);
--sst-body-even-row-bg-color: hsl(0, 0%, 50%);
--sst-body-odd-row-bg-color: hsl(0, 0%, 45%);
--sst-body-inner-vert-border-color: hsl(0, 0%, 30%);
--sst-body-inner-horiz-border-color: hsl(0, 0%, 35%);
--sst-body-highlight-sort-bg-color: var(--accent-2);
--sst-body-highlight-sort-text-color: var(--main-foreground-color);
--sst-body-highlight-sort-border-color: hsl(0, 0%, 35%);
--sst-button-text-color: var(--main-foreground-color);
--sst-button-bg-color: var(--accent-2);
--sst-button-border-color: var(--accent-2);
--sst-button-hover-text-color: var(--main-foreground-color);
--sst-button-hover-bg-color: var(--accent-1);
--sst-button-hover-border-color: transparent;
--sst-button-active-text-color: hsl(0, 0%, 0%);
--sst-button-active-bg-color: var(--accent-2);
--sst-button-active-border-color: transparent;
--sst-button-disabled-text-color: hsl(0, 0%, 30%);
--sst-button-disabled-bg-color: hsl(0, 0%, 50%);
--sst-button-disabled-border-color: transparent;
--sst-button-focus-border-color: transparent;
  }

  :global([data-theme="light"]) {
    --accent-1: #4060a8;
    --accent-2: #4ea8ff;
    --accent-fg: #ffffff;
    --accent-bg: #fcfcfc;
    --main-foreground-color: #000;
    --main-background: #f9f9fb;
    --main-background-color: #f9f9fb;
  }

  :global([data-image="true"]) {
    --main-background: url("https://raw.githubusercontent.com/CollegeFootballRisk/Risk/a06b5b1ce3084f891ab39b3667a6c317510321f5/static/images/background.jpg")
      no-repeat center center fixed;
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
    position: fixed;
    z-index: 22;
  }

  .top-nav .logo {
    width: 40px;
    height: 40px;
    margin: 5px;
    margin-top: 10px;
  }

  :global(.spin) {
    -webkit-animation: spin 4s linear infinite;
    -moz-animation: spin 4s linear infinite;
    animation: spin 4s linear infinite;
  }

  :global(.spin-back) {
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

  .menu > li:hover {
    box-shadow: 0px 0px 16px 10px var(--accent-1),
      inset 0px 0px 5px 10px var(--accent-1);
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
  }

  .main-container {
    /* Fill all available space */
    width: 100vw;
    height: calc(100% - var(--navbar-height));
    max-width: 100vw;
    overflow: hidden;
    color: var(--main-foreground-color);
    margin-top: var(--navbar-height);
  }

  :global(.modalWindow) {
    background: var(--main-background-color) !important;
    color: var(--main-foreground-color) !important;
    position: relative;
    width: 40rem;
    max-width: 100%;
    max-height: 100%;
    margin: 2rem auto;
    border-radius: 0.5rem;
    --borderWidth: 3px;
    border-radius: var(--borderWidth);
  }

  :global(.rainbowBorder:after) {
    content: "";
    position: absolute;
    top: calc(-1 * var(--borderWidth));
    left: calc(-1 * var(--borderWidth));
    height: calc(100% + var(--borderWidth) * 2);
    width: calc(100% + var(--borderWidth) * 2.1);
    background: linear-gradient(
      60deg,
      #f79533,
      #f37055,
      #ef4e7b,
      #a166ab,
      #5073b8,
      #1098ad,
      #07b39b,
      #6fba82
    );
    border-radius: calc(2 * var(--borderWidth));
    z-index: -1;
    animation: animatedgradient 3s ease alternate infinite;
    background-size: 300% 300%;
  }

  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
