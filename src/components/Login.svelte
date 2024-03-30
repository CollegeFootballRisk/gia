<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faReddit, faDiscord } from "@fortawesome/free-brands-svg-icons";
</script>

<h1>Login</h1>
<p>
  Howdy partner, <br /><br /> In order to enjoy all of the functionality of CollegeFootballRisk
  and make your own moves, you'll need to log in.
</p>
<h2>
  <a
    href={null}
    onclick="window.location = '/login/reddit';"
    alt="Login with Reddit"
    title="Login with Reddit"
    ><FontAwesomeIcon style="color:#FF4500;" icon={faReddit} /> Reddit</a
  >
  <a
    href={null}
    onclick="window.location = '/login/discord';"
    alt="Login with Discord"
    title="Login with Discord"
    ><FontAwesomeIcon style="color:#7289DA;" icon={faDiscord} /> Discord</a
  ><!--
    <a href="/login/strava"><FontAwesomeIcon style="color:#FC4C02;" icon={faStrava}/> Strava</a>-->
</h2>

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  p {
    text-align: center;
  }

  a {
    padding: 10px;
    border-color: var(--accent-2);
    color: var(--accent-2);
    border: 2px;
    border-style: solid;
    border-radius: 5%;
  }

  a:hover {
    border-color: var(--accent-1);
    color: var(--accent-1);
  }
</style>
