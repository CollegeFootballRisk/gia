<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
</script>

<div class="overflow">
  <h1>Information</h1>
  <center>
    <h2>Playing College Football Risk</h2>
    <br />
  </center>
  <h3>What is College Football Risk?</h3>
  <p id="what">
    College Football Risk is a multiplayer game where teams can work together to
    control a map of North America. The objective is for a team to have the
    largest number of territories of any team at the end of the season. College
    Football Risk is a continuation of a popular CFB Risk game run by <a
      href="https://www.reddit.com/r/CFB">r/CFB</a
    >
    in the Spring and Summer of 2018 and by
    <a href="https://www.reddit.com/user/BlueSCar">BlueSCar</a> in the Spring of
    2020. It is an MMO-style game where college football fanbases compete for control
    of a fictionalized map of the United States. The goal is to control as much territory
    as possible for ultimate domination of the map.
  </p>
  <h3>How do I play?</h3>
  <p>
    Once a day, visit the site and choose a territory to defend or attack. Most
    of the fun comes from coordinating with others on your team. A lot of teams
    have communities set up to coordinate strategy, usually in the form of a
    subreddit or discord channel. So, find yours and participate!

    <br /> By making a move, you agree to play by the
    <a href="/policies">code of conduct</a>
    and, if this is a test game, you acknowledge and agree to the
    <a href="/policies">test game policy.</a>
  </p>
  <h3>How does the game work?</h3>
  <p id="gameplay">
    Every day at 21:30 U.S. Central Standard Time, the map is redrawn. For each
    territory on the map, the total <a href="#starpower">starpower</a> is
    calculated for each team that made moves in that territory. A random number
    is drawn and the team who's player that number corresponds to is labeled
    <a href="#mvp">MVP</a> and wins the territory for that team.
  </p>
  <h3>What multipliers are there?</h3>
  <p id="mults">The multipliers are as follows:</p>
  <ul>
    <li>
      <b>Region Multiplier:</b> A team can receive a multiplier of 1.0 + 0.5* the
      number of regions owned. For example, if a team holds all of the territories
      in two regions, they get a 2.0 multiplier.
    </li>
    <li>
      <b>Defense:</b> A player can receive a multiplier of 1.5 for defending a territory
      their team already owns.
    </li>
    <li>
      <b>Triple-or-Nothing:</b> A player on a team with just one territory gets to
      gamble between having a multiplier of 1, 3, or 0 (the later two determined
      by RNG, the former guaranteed). If the player chooses not to participate, the
      multiplier does not come into effect for that user.
    </li>
  </ul>
  <p>
    Multipliers are multiplicative, so a defender with a single regional
    multiplier would have (1.5)&#x2715;(1.0 + 0.5) = 2.25 multiplier. This is
    then multiplied by their star number to determine their overall power.
  </p>
  <h3>
    How can I participate in the community and/or find my team's central
    command?
  </h3>
  <p>
    We have compiled a list of team leaders and forums on r/CollegeFootballRisk.
    You can find that list <a
      href="https://www.reddit.com/r/CollegeFootballRisk/wiki/team_specific"
      target="_blank">here</a
    >. If you don't see your team listed, then check out the official subreddit
    for the game,
    <a href="https://old.reddit.com/r/collegefootballrisk"
      >r/CollegeFootballRisk</a
    >, or the <a href="http://discord.gg/KG2sKHg">official Discord server</a>.
  </p>
  <h3>How is this different from older versions of College Football Risk?</h3>
  <p>
    This game is quite similar to older versions of CFBR. However, it differs in
    the following ways:
  </p>
  <ul>
    <li>
      <b>Significantly larger map</b> &#8211; Canada, Mexico, and the Caribbean were
      added, 51 territories in all.
    </li>

    <li><b>Colonizable Territory</b> &#8211; Grab free land while its hot!</li>

    <li>
      <b>3-Turn Head Start for most teams</b> &#8211; Some teams start in a harder
      spot than others. Use this head start to gobble up a region quickly, or just
      to get the heck out of there! (Note: this means that surviving teams from the
      last game can only defend for the first 3 turns, and Stanford for the 1st Turn,
      in an effort to give smaller teams a chance to survive the first few turns).
    </li>

    <li>
      <b>Region Bonuses</b> &#8211; Like Continent bonuses in real Risk, in this
      case your whole team gets a power multiplier for holding a region of territories
    </li>

    <li>
      <b>Permanent mercenaries (Transfer portal)</b> &#8211; You can now choose to
      permanently join another team if yours is eliminated. So be nice to teams with
      their back against the wall, maybe their players will join you! And be careful
      what team you kill…they may make your enemies stronger.
    </li>

    <li>
      <b>New Chaos mechanics (for extra chaos)</b> &#8211; Chaos, based in Bermuda,
      can now attack a completely random set of territories every turn. Nowhere is
      safe!
    </li>

    <li><b>Sunday Breaks</b> - Can still place your move for 48 hours</li>

    <li>
      <b>3x Or Nothing Bonus if facing elimination</b> &#8211; Do you only have one
      territory left? Gamble it all with a 50% chance to either multiply your star
      power by 3, or by zero!
    </li>

    <li>
      <b>Roll reveal/recap Twitch stream</b> &#8211; Roll reveal stream and discussion
      most nights starting around 10pm on DodgerofZion's twitch channel
    </li>

    <li>
      <b>More map bridges/ferries</b> &#8211; move around the map quicker than ever
      and limit “safe corners”
    </li>

    <li>
      <b> Star power tweaks</b> &#8211; The 'power' gap between 5-star players and
      1-star players has been reduced
    </li>

    <li>
      <b>New User Interface</b> &#8211; Even has customizable backgrounds!
    </li>
    <li>
      <b>Open Source</b> &#8211; This version of the game is entirely
      open-source. Anyone can go look at its
      <a rel="noreferrer" href="https://github.com/mautamu/Risk">code</a>, and
      submit pull requests to change the game.
      <br /> The backend version of the game is written in the programming
      language
      <a rel="noreferrer" target="blank" href="https://www.rust-lang.org/"
        >Rust</a
      >
      while the frontend is written in
      <a rel="noreferrer" target="blank" href="https://svelte.dev/">Svelte</a>.
    </li>
  </ul>
  <h3 id="gameplay">Gameplay</h3>
  <p>
    For each turn, if a team controls only one territory each player is granted
    the ability to triple or nothing their power. This means that teams which
    are on the verge of being eliminated may be able to recuperate some of their
    ability to strike back and to allow for time to strategize or recruit.
  </p>
  <p>
    Finally, all players on a dead team are prompted to join a new team. They
    may choose to join chaos as well.
  </p>
  <h3>How do I get stars / move up in rank?</h3>
  <p id="points">
    Your total/overall starcount is the <i>median</i> of your stars for each of the
    following categories:
  </p>
  <ul>
    <li>
      MVPS (when you are the MVP of a territory):<br />
      <ul style="text-indent:25px;list-style:circle;">
        <li>0 MVPS: 1 Star</li>
        <li>1-4 MVPS: 2 Stars</li>
        <li>5-9 MVPS: 3 Stars</li>
        <li>10-24 MVPS: 4 Stars</li>
        <li>25+ MVPS: 5 Stars</li>
      </ul>
    </li>
    <br /><br />
    <li>
      Turns (how many turns you've had in all College Football Risk games):<br
      />
      <ul style="text-indent:25px;list-style:circle;">
        <li>0-9 Turns: 1 Star</li>
        <li>10-24 Turns: 2 Stars</li>
        <li>25-49 Turns: 3 Stars</li>
        <li>50-99 Turns: 4 Stars</li>
        <li>100+ Turns: 5 Stars</li>
      </ul>
    </li>
    <br /><br />
    <li>
      Game Turns (all the turns you've made in this game):<br />
      <ul style="text-indent:25px;list-style:circle;">
        <li>0-4 Turns: 1 Star</li>
        <li>5-9 Turns: 2 Stars</li>
        <li>10-24 Turns: 3 Stars</li>
        <li>25-39 Turns: 4 Stars</li>
        <li>40+ Turns: 5 Stars</li>
      </ul>
    </li>
    <br /><br />
    <li>
      Streak (how many consecutive turns you've made):<br />
      <ul style="text-indent:25px;list-style:circle;">
        <li>0-2 Turns: 1 Star</li>
        <li>3-4 Turns: 2 Stars</li>
        <li>5-9 Turns: 3 Stars</li>
        <li>10-24 Turns: 4 Stars</li>
        <li>25+ Turns: 5 Stars</li>
      </ul>
    </li>
  </ul>
  <h3 id="the-guide">Survival Guide</h3>
  <p>
    <a href="/player/The_Ghost_of_TxAg70">TxAg70</a> has put together a
    wonderful guide for how teams can dominate in CFBR. CFBR is grateful to him
    for putting it together. You can view it below or
    <a target="_blank" href="/images/CFBRisk_Guide_1_6.pdf">here.</a>
  </p>
  <center>
    <iframe
      src="/images/CFBRisk_Guide_1_6.pdf"
      title="Survival Guide"
      width="80%"
      height="900px"
    />
  </center>
</div>

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  :global(.table) {
    color: var(--main-foreground-color);
    background: var(--main-background);
  }

  .overflow {
    height: 100%;
    overflow: auto;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
