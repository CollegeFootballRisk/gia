<script>
  import { onMount } from "svelte";
  import { settings } from "../state/settings";
  var weight = "1";
  var attackDefend = "1";
  var tripleOrNothing = "1";
  var regions = "0";
  $: multipliers = attackDefend * tripleOrNothing * (1 + 0.5 * regions);
  $: power = weight * multipliers;
  var sectionFocus = "introduction";
  var sections = [
    { id: "introduction", title: "Introduction", next: "objective" },
    { id: "objective", title: "Objective", next: "making_moves" },
    { id: "making_moves", title: "Making Moves", next: "stars" },
    { id: "timer", title: "Timer", next: "" },
    { id: "stars", title: "Stars", next: "power" },
    { id: "power", title: "Power", next: "" },
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
    <button on:click={focusPrevious}>Previous</button>
    <select bind:value={sectionFocus}
      >{#each sections as section}
        <option value={section.id}>{section.title}</option>
      {/each}</select
    >
    <button on:click={focusNext}>Next</button><br />
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
        Once you've submitted your move successfully, you'll see the below
        prompt: %prompt%. You're now good to sit back and wait for the roll to
        happen at 10:30 ET. (<b>Note:</b> <i>No rolls occur on Sundays!</i>)
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

    <section style="display: none;" id="timer">
      <p />
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
  </center><br /><br />
  <center>
    <button on:click={focusPrevious}>Previous</button>
    <select bind:value={sectionFocus}
      >{#each sections as section}
        <option value={section.id}>{section.title}</option>
      {/each}</select
    >
    <button on:click={focusNext}>Next</button>
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
</style>
