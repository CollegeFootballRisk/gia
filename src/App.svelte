<script>
	import Panzoom from 'panzoom';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faChevronRight, faRefresh, faHistory, faShip, faSearchMinus, faSearchPlus, faFlag} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from 'fontawesome-svelte';
	      import { onMount } from "svelte";
  onMount(() => {
 var toggleBtn = document.querySelector(".sidebar-toggle");
    var sidebar = document.querySelector(".sidebar");

    toggleBtn.addEventListener("click", function () {
      toggleBtn.classList.toggle("is-closed");
      sidebar.classList.toggle("is-closed");
    });

    fetch("/images/map8.svg")
      .then((r) => r.text())
      .then((text) => {
        document.getElementsByClassName("map-wrap")[0].innerHTML = text;
        window.maphandle = Panzoom(document.getElementById("map"));
      })
      .catch(console.error.bind(console));

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
</script>

<main>
	 <section class="top-nav">
      <div>
        <img
          src="https://collegefootballrisk.com/images/logo-white.png"
          class="logo spin"
          title="CFBR Logo"
		  alt = "CFBR Logo"
        />
      </div>
      <input id="menu-toggle" type="checkbox" />
      <label class="menu-button-container" for="menu-toggle">
        <div class="menu-button"></div>
      </label>
      <ul class="menu">
        <li><a href="google.com">Leaderboard</a></li>
        <li><a href="google.com">Odds</a></li>
        <li><a href="google.com">About</a></li>
        <li><a href="google.com">API</a></li>
        <li><a href="google.com">Bugs</a></li>
        <li><a href="google.com">Settings</a></li>
      </ul>
    </section>
      <div class="main-container">
        <div class="sidebar is-closed" title="Sidebar Toggle">
          <button class="sidebar-toggle is-closed">
		  <FontAwesomeIcon icon={faChevronRight} style="color:white;" />
          </button>
          <div class="sidebar-content">
		  <FontAwesomeIcon icon={faRefresh} spin={true} size="3x"/>
          </div>
        </div>
        <div class="map-container">
          <div class="map-controls">
            <button
              class="map-control"
              onclick="window.maphandle.zoomTo(500, 500, 1.5);"
              title="zoom in"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>
            <button
              class="map-control"
              onclick="window.maphandle.zoomTo(500, 500, 0.75);"
              title="zoom out"
            >
              <FontAwesomeIcon icon={faSearchMinus} />
            </button>
            <button
              class="map-control"
              onclick="window.location = '/map';"
              title="history"
            >
              <FontAwesomeIcon icon={faHistory} />
            </button>
            <button id="regions-button" class="map-control" title="regions">
              <FontAwesomeIcon icon={faFlag} />
            </button>
            <button id="bridges-button" class="map-control" title="bridges">
              <FontAwesomeIcon icon={faShip} />
            </button>
          </div>
          <div class="map-wrap"></div>
        </div>
      </div>
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

.menu  a {
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

.map-controls {
  position: absolute;
  bottom: calc(0.1*var(--navbar-height));
  margin-left: auto;
  margin-right: auto;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 2;
  white-space: nowrap;
}

.map-controls button{
  color: var(--accent-fg);
  background: var(--accent-2);
  font-size: 1.3em;
  line-height: 1em;
  width: 2em;
  height: 2em;
  border: none;
  padding: 0.3em;
  border-radius: 10%;
}

.map-controls button:hover{
  background: var(--accent-1);
}

/** Sidebar **/
.sidebar-toggle {
  position: fixed;
  z-index: 10;
  border: 4px solid var(--main-foreground-color);
  outline: none;
  width: 40px;
  height: 60px;
  border-radius: 0% 20% 20% 0%;
  margin-left: 17.8em;
  margin-top: calc(50vh - var(--navbar-height));
  background-color: var(--accent-2);
  cursor: pointer;
  transition: 0.5s;
  font-size: 13.3333px;
}
.sidebar-toggle.is-closed {
  transform: translateX(0.3em) rotate(0deg);
}
.sidebar-toggle .icon {
  font-size: 1.5em;
  margin-top: 0.2em;
  color: var(--accent-fg);
}

.sidebar-toggle.is-closed .icon {
  transform: rotate(-180deg);
}

.sidebar {
  z-index: 3;
  position: absolute;
  width: 15em;
  height: calc(100vh - var(--navbar-height));
  background-color: var(--accent-2);
  transition: 0.7s;
  border-right: 4px solid var(--main-foreground-color);
}
.sidebar.is-closed {
  transform: translateX(-15em);
}

.sidebar-content {
  width: 100%;
  height: 100%;
  display: inline-flex; /* make element size relative to content */
  align-items: center; /* vertical alignment of items */
  text-align: middle;
  justify-content: center;
}

.sidebar-content i{
  font-size: 3em;
}
</style>