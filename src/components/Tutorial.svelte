<script>
  import { onMount } from "svelte";
  import { settings } from "../state/settings";
  import { turns, user } from "../state/state";
  import Popup from "./Popup.svelte";
  var weight = "1";
  var attackDefend = "1";
  var tripleOrNothing = "1";
  var regions = "0";
  var mvps_tutorial = 0;
  var turns_tutorial = 0;
  var game_turns_tutorial = 0;
  var streak_tutorial = 0;
  var submitSuccess = true;
  function median(values) {
    if (values.length === 0) throw new Error("No inputs");

    values.sort(function (a, b) {
      return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2.0;
  }

  try {
    mvps_tutorial = $user.stats.mvps;
    turns_tutorial = $user.stats.totalTurns;
    game_turns_tutorial = $user.stats.gameTurns;
    streak_tutorial = $user.stats.streak;
  } catch (e) {}

  function mvps(i) {
    let tiers = [0, 1, 5, 10, 25];
    var index = tiers.findIndex(function (num) {
      return num > i;
    });
    return index > 5 || index < 1 ? 5 : index;
  }
  function turnsc(i) {
    let tiers = [0, 10, 25, 50, 100];
    var index = tiers.findIndex(function (num) {
      return num > i;
    });
    return index > 5 || index < 1 ? 5 : index;
  }
  function game_turns(i) {
    let tiers = [0, 5, 10, 25, 40];
    var index = tiers.findIndex(function (num) {
      return num > i;
    });
    return index > 5 || index < 1 ? 5 : index;
  }
  function streak(i) {
    let tiers = [0, 3, 5, 10, 25];
    var index = tiers.findIndex(function (num) {
      return num > i;
    });
    return index > 5 || index < 1 ? 5 : index;
  }
  $: turnStars = turnsc(turns_tutorial);
  $: mvpStars = mvps(mvps_tutorial);
  $: gameTurnStars = game_turns(game_turns_tutorial);
  $: streakStars = streak(streak_tutorial);
  $: overall_stars_tutorial = Math.ceil(
    median([turnStars, mvpStars, gameTurnStars, streakStars])
  );

  $: multipliers = attackDefend * tripleOrNothing * (1 + 0.5 * regions);
  $: power = weight * multipliers;
  var sectionFocus = "introduction";
  var sections = [
    { id: "introduction", title: "Introduction", next: "objective" },
    { id: "objective", title: "Objective", next: "making_moves" },
    { id: "making_moves", title: "Making Moves", next: "stars" },
    { id: "stars", title: "Stars", next: "power" },
    { id: "power", title: "Power", next: "respawn" },
    { id: "respawn", title: "Respawn" },
  ];
  function focusNext() {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].id == sectionFocus) {
        sectionFocus = sections[i].next;
        break;
      }
    }
  }

  function focusPrevious() {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].next == sectionFocus) {
        sectionFocus = sections[i].id;
        break;
      }
    }
  }

  onMount(() => {
    changeSection();
  });
  function changeSection() {
    try {
      document
        .querySelector("#tutorial")
        .querySelectorAll(`section`)
        .forEach((e) => (e.style.display = "none"));
      document.querySelector(`#${sectionFocus}`).style.display = "block";
    } catch {}
  }
  $: changeSection(sectionFocus);
</script>

<div id="tutorial">
  <center>
    <button on:click={focusPrevious} disabled={sections[0].id == sectionFocus}
      >Previous</button
    >
    <select bind:value={sectionFocus}
      >{#each sections as section}
        <option value={section.id}>{section.title}</option>
      {/each}</select
    >
    <button
      on:click={focusNext}
      disabled={sections[sections.length - 1].id == sectionFocus}>Next</button
    ><br />
    <h1>Tutorial</h1>
    <section id="introduction">
      <p>
        Welcome to College Football Risk!<br /> <br />Whether this is your first
        game or your third, we appreciate that you've chosen to play this game.
        This tutorial will cover some of the basic topics of gameplay. Ready to
        get started?
      </p>
    </section>
    <section style="display: none;" id="objective">
      <p>
        The objective of College Football Risk is for your team to <i
          >own the most territories on the map</i
        >. There are 131 teams, corresponding to the 130 teams in the FBS + a
        special team called Chaos.
      </p>
    </section>
    <section style="display: none;" id="making_moves">
      <p>
        Each turn, you can make a move on a single territory. There are two
        different ways to do so:
      </p>
      <ol>
        <li>
          By clicking on a territory your team owns or that neighbors a
          territory your team owns and then clicking Attack or Defend in the
          sidebar
        </li>
        <li>
          By clicking the target icon, labeled "Your Move" and selecting one of
          the territories you can Attack or Defend
        </li>
      </ol>
      <p>
        Once you've submitted your move <select bind:value={submitSuccess}>
          <option value={true} selected>successfully</option>
          <option value={false}>unsuccessfully</option>
        </select>, you'll see the below prompt:
      </p>
      <div
        style="border: white; border-radius: 5px; border-width: 2px; border-style: solid;"
      >
        {#if submitSuccess}
          <Popup
            title="Move Submitted"
            message="Your move on %TERRITORY% has been successfully made."
            loading={false}
            good={true}
          />
        {:else}
          <Popup
            title="Move Failed to Submit"
            message="Your move on %TERRITORY% has failed. Please try again."
            loading={false}
            error={true}
          />
        {/if}
      </div>
      <p>
        If your move submitted successfully, you're now good to sit back and
        wait for the roll to happen at 10:30 ET. (<b>Note:</b>
        <i>No rolls occur on Sundays!</i>)
      </p>

      <p>
        Additionally, the territory on which you have moved can pulse if you
        enable the setting. While you could go to settings to enable it, you can
        also enable it here:<br />
      </p>
      <hr />
      <label class="toggle">
        <input
          bind:checked={$settings.pulse_territories}
          class="toggle-checkbox"
          type="checkbox"
        />
        <div class="toggle-switch" />
        <span class="toggle-label"
          >Pulse the territory that you have selected once your move has been
          made
        </span>
      </label>
      <hr />
    </section>

    <section style="display: none;" id="stars">
      <p>
        As you submit more moves and gain experience, you may occasionally be
        the one who wins a territory for your team, in other words, you're the
        MVP! <br /><br /> To commemorate the moment, your profile will reflect
        this by showing a star next to that move: %image%.

        <br /><br /> But that's not all! The MVP will also level you up! As you gain
        more MVPs, you go from one star to up to five stars.
      </p>

      <p>
        Even if you don't win MVP, your participation also helps you to level
        up! Maintaining a streak and playing more turns both this game and in
        all games is rewarded by increasing each of those category's rankings
        from one to five stars: %image%.
        <br /><br />
        As you level up in each star category, your overall ranking also improves,
        as it's the rounded-up median of your stars. For example, if you had 2 stars
        in the MVP category, 2 in round turns, 4 in total turns, and 4 in streak,
        you'd be a 3-star overall.
      </p>

      <p>You can see how your overall star count works with the model below:</p>

      Overall:
      <h3>
        {String.fromCharCode(0x272f).repeat(overall_stars_tutorial)}
      </h3>
      <br />
      <center>
        <div class="lrow">
          <div class="lcol2">
            <h3>
              {String.fromCharCode(0x272f).repeat(turnStars)}
            </h3>
            <i>Total turns:</i><br />
            <input
              type="number"
              bind:value={turns_tutorial}
              name="quantity"
              min="0"
              max="140"
            />
          </div>
          <div class="lcol2">
            <h3>
              {String.fromCharCode(0x272f).repeat(gameTurnStars)}
            </h3>
            <i>Round turns:</i><br />
            <input
              type="number"
              bind:value={game_turns_tutorial}
              name="quantity"
              min="0"
              max="140"
            />
          </div>
        </div>
        <br />
        <div class="lrow">
          <div class="lcol2">
            <h3>{String.fromCharCode(0x272f).repeat(streakStars)}</h3>
            <i>Streak: </i><br />
            <input
              type="number"
              bind:value={streak_tutorial}
              name="quantity"
              min="0"
              max="140"
            />
          </div>
          <div class="lcol2">
            <h3>{String.fromCharCode(0x272f).repeat(mvpStars)}</h3>
            <i>Total MVPS:</i><br />
            <input
              type="number"
              bind:value={mvps_tutorial}
              name="quantity"
              min="0"
              max="140"
            />
          </div>
        </div>
        <br />
      </center>
      <p id="points">
        Your total/overall starcount is the <i>median</i> of your stars for each
        of the following categories:
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
    </section>
    <section style="display: none;" id="power">
      <p>
        You may now be asking, why does my star ranking matter? The answer is
        that it determines your likelihood of winning a territory for your team,
        in other words, your <i>power</i>.
      </p>
      <code><b>Power = Weight &#x2715; Multipliers</b></code>
      <p>
        Your <i>weight</i> is currently equal to your star rank, so if you are
        overall a three-star player, then your weight is 3.
        <br /><br /> But now we arrive at the <i>multiplier</i>. Multipliers are
        a factor of the following:
      </p>
      <ul style="text-align:left;">
        <li>
          Whether you're defending a territory your team owns or attacking a
          territory that neighbors a territory your team owns <ul>
            <li>Attacking gives a multiplier of 1</li>
            <li>Defending gives a multiplier of 1.5</li>
          </ul>
        </li>
        <li>
          The number of regions your team holds
          <ul>
            <li>
              Each region (a grouping of territories) your team owns in its
              entirety gives a 0.5 multiplier boost, e.g. no regions gives a
              multiplier of 1, while 2 regions gives a multiplier of 2
            </li>
          </ul>
        </li>
        <li>
          Whether you win triple-or-nothing
          <ul>
            <li>
              If your team is down to a single territory (and it's not the first
              three or last three turns), each player on that team can decide
              whether to triple their power or lose all of it. If you take the
              wager, you might have a multiplier of 3, or 0; both are weighted
              equally.
            </li>
          </ul>
        </li>
      </ul>
      <p>You can use the below calculator to see what power would come out:</p>
      Stars for the player:&nbsp;
      <select bind:value={weight}>
        <option value="1" selected>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select><br />
      Regions held by player's team:&nbsp;
      <select bind:value={regions}>
        <option value="0" selected>0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select><br />
      Attacking or defending?&nbsp;
      <select bind:value={attackDefend}>
        <option value="1" selected>Attacking</option>
        <option value="1.5">Defending</option>
      </select><br />
      Triple or Nothing?&nbsp;
      <select bind:value={tripleOrNothing}>
        <option value="1" selected>No</option>
        <option value="3">Yes - Win</option>
        <option value="0">Yes - Lose</option>
      </select><br />
      <code>
        Power = {power}<br />
        Multipler = {multipliers}<br />
        Weight = {weight}<br />
      </code>
    </section>
    <section style="display: none;" id="respawn">
      Should a team be eliminated, that team may respawn on a respawn map up to
      one time. The respawn map will have a collection of territories,
      originally owned by the NCAA, which follow the same rules as the main map
      with one exception: teams that win more than one territory may be required
      to forfeit all but one territory on the map in a given turn if team(s) are
      eliminated on the main map. A random pool of territories is created of
      NCAA's territories and all but one of the territories owned by each team
      that owns more than one territory. Those territories are then assigned to
      newly-eliminated teams until each newly-eliminated team has a territory on
      the respawn map. If there are insufficient territories, then any remaining
      eliminated teams are permanently eliminated. Random bridges will be
      occasionally drawn from the respawn map to the main map. A team which
      succeeds in crossing such a bridge forfeits all territories on the respawn
      map but re-enters the main map until eliminated or the game ends. For
      respawn, the order of execution is as follows:
      <ol style="text-align: left;">
        <li>We process submap 0 (the main map) as normal</li>
        <li>
          We determine which team(s) were eliminated on the main map and which
          have not yet used any respawns (teams.respawn_count &lt; 1)
        </li>
        <li>
          If any teams have previously been on submap id 1 but are now present
          on submap 0, then we discard any turns made on submap id 1 by players
          on those teams
        </li>
        <li>
          We process submap 1 (the secondary map), assigning the protected
          territories of any team which has succesfully returned to submap 0 to
          the NCAA (team id 0)
        </li>
        <li>We randomly shuffle the eligible eliminated teams</li>
        <li>
          We take all submap 1 territories owned by NCAA and add them to a pool
          of re-assignable territories
        </li>
        <li>
          We take all teams that own more than one territory on submap 1 and
          select all but one of their territories to add to the pool of
          re-assignable territories randomly (but all such territories will be
          placed after any NCAA territories to ensure NCAA territories are
          exhausted first)
        </li>
        <li>
          We reassign the territories from the re-assignable pool until either
          it is exhausted or all respawn-eligible teams have recevied a single
          territory
        </li>
        <li>
          We merge all results from all submaps and write it to the database
        </li>
      </ol>
    </section>
  </center><br /><br />
  <center>
    <button on:click={focusPrevious} disabled={sections[0].id == sectionFocus}
      >Previous</button
    >
    <select bind:value={sectionFocus}
      >{#each sections as section}
        <option value={section.id}>{section.title}</option>
      {/each}</select
    >
    <button
      on:click={focusNext}
      disabled={sections[sections.length - 1].id == sectionFocus}>Next</button
    >
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

  .toggle {
    cursor: pointer;
    display: inline-block;
  }

  .select {
    display: inline-block;
    background: #ccc;
    border-radius: 16px;
    height: 32px;
  }

  .toggle-switch {
    display: inline-block;
    background: #ccc;
    border-radius: 16px;
    width: 58px;
    height: 32px;
    position: relative;
    vertical-align: middle;
    transition: background 0.25s;
  }
  .toggle-switch:before,
  .toggle-switch:after {
    content: "";
  }
  .toggle-switch:before {
    display: block;
    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    width: 24px;
    height: 24px;
    position: absolute;
    top: 4px;
    left: 4px;
    transition: left 0.25s;
  }
  .toggle:hover .toggle-switch:before {
    background: linear-gradient(to bottom, #fff 0%, #fff 100%);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  }
  .toggle-checkbox:checked + .toggle-switch {
    background: #56c080;
  }
  .toggle-checkbox:checked + .toggle-switch:before {
    left: 30px;
  }

  .toggle-checkbox {
    position: absolute;
    visibility: hidden;
  }

  .toggle-label {
    margin-left: 5px;
    position: relative;
    top: 2px;
  }

  .overflow {
    height: 100%;
    overflow: auto;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  .lrow {
    display: flex;
    justify-content: center;
    flex-flow: row;
    flex-wrap: wrap;
  }

  .lcol2 {
    flex: 2;
    flex-basis: 50%;
  }

  h3 {
    text-align: center;
    font-size: 2.5em;
    line-height: 0.5em;
    padding-top: 0px;
    margin-bottom: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
  }
</style>
