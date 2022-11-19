<script>
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faReddit } from "@fortawesome/free-brands-svg-icons";
</script>

<h1>Login</h1>
<p>
  Howdy partner, <br /><br /> In order to enjoy all of the functionality of CollegeFootballRisk
  and make your own moves, you'll need to log in.
</p>
<h3>
  <a href={null} onclick="window.location = '/login/reddit';"
    ><FontAwesomeIcon style="color:#FF4500;" icon={faReddit} /> Reddit</a
  >
  <!--<a href="/login/discord"><FontAwesomeIcon style="color:#7289DA;" icon={faDiscord}/> Discord</a>
    <a href="/login/strava"><FontAwesomeIcon style="color:#FC4C02;" icon={faStrava}/> Strava</a>-->
</h3>

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  h3 {
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
