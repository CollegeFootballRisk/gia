<script context="module" lang="js">
  export const lastupdate = 4;
</script>

<script>
  import { onDestroy } from "svelte";
  import { settings } from "../state/settings";
  onDestroy(() => {
    $settings.lastupdateview = lastupdate;
    history.replaceState(null, null, " ");
  });
</script>

<h1>Changelog</h1>

<h2><i>Turn 4/32</i></h2>
<h3>Reroll</h3>

<p>
  Unfortunately, a large number of alts ruined the roll and necessitated a
  re-roll. Anyone who submitted a move prior to the re-roll will need to
  re-submit their move.
</p>

<h2><i>Turn 4/29</i></h2>
<h3>Game End</h3>

<p>
  The game has gotten stale, so let's wrap it up on 13 May (which should be turn
  38).
</p>

<h2><i>Turn 4/12</i></h2>
<h3>Sicily</h3>
<p>Sicily can no longer be attacked from the main map</p>
<h3>Teams</h3>
<p>Users will be prompted to confirm which team they want to be on tonight</p>
<h3>Versioning</h3>
<p>
  CFBR's website versions are, and will remain, available through settings -&gt;
  version information (pictured) and through the api at sys/info. If the
  trailing part of the backend version (e.g. g8cebee7 right now, but ignore the
  g) matches what's in GitHub (under the 3.1 branch right now, since the stable
  default branch is for 4.0 stuff), you know you have an authentic copy of CFBR
  running on the server. If it has -modified at the end or does not match the
  latest, it might be outdated (look at commit history) and/or have a
  modification (which could be as simple as a random sql file accidentally
  getting added).
</p>
<p>
  Gia (the frontend) versions follow the same methodology, but are not available
  on the API and match what's listed here. What's in git, otherwords, is what is
  currently running on server.
</p>
<p>
  There was a brief time where a -modified had been running due to an erroneous
  sql file and the Discord # -&gt; $ not having been pushed to GitHub yet.
</p>

<h2><i>Turn 4/9</i></h2>
<h3>Test Game Agreement</h3>
<p>
  Test games are, by their nature, dynamic; therefore, by playing during a test
  game, you consent to mid-game changes to the UI, the API, gameplay/game rules,
  and other similar elements pertinent to the game, with or without advanced
  notice. Furthermore, you agree not to make unfounded and/or overblown
  complaints about test game changes.
</p>
<p>
  Moreover, the primary goal of test games is testing new features, <i>not</i> recruiting.
  If you intend to use test games for recruiting, you are responsible for informing
  your recruit(s) of any game changes.
</p>

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }
</style>
