<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  var e = document.querySelectorAll(".close");
  for (let i = 0; i < e.length; i++) {
    e[i].style.display = "none !important";
  }

  window.localStorage.seen_end = true;

  function hidePrompt() {
    window.closeModal();
  }
</script>

<center>
  <h1>Risk End Survey & Final Turn</h1>
  <blockquote>
    We've arrived at the final turn of Season 3.0, turn 44 (taking place Monday,
    13 March). On behalf of the Game Mods and Game Devs, I would like to
    sincerely thank you for participating in season 3. Without you, this season
    never could have happened. We have a more detailed thank you <a
      href="/thanks">here.</a
    >
  </blockquote>
  <p>
    You are invited to take the Season 3.0 End-of-Season Survey through 10:30 ET
    on 3/20/23.
  </p>
  <p>
    This survey will assist the game mods in determining how we can serve you
    and how we can improve the game for season 4.0. None of the changes
    described in the survey are guaranteed to be in 4.0, nor are they
    representative of all changes that might be made.
  </p>
  <p>
    You may access the survey <a
      class="Out"
      href="https://docs.google.com/forms/d/e/1FAIpQLSeYVf5JlzW11hFLnaFC40ODTN4qfsngglKAGxlAMF8mPnFRkA/formResponse"
      title="To Google Survey"
      alt="To Google Survey"
      target="_blank">Here</a
    >
  </p>

  <p>
    You may access the thank you and credits <a
      class="Out"
      href="/thanks"
      on:click={hidePrompt}
      title="To thank-you"
      alt="To thank-you">Here</a
    >
  </p>

  <input
    type="button"
    on:click={hidePrompt}
    class="Out Ack"
    value="Acknowledged"
  /><br />
</center>

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  .Out {
    height: 2em;
    border: none;
    padding: 0.5em;
    font-size: 1.3em;
    line-height: 1em;
    border-radius: 0.3em;
    cursor: pointer;
    color: white;
    background: black;
  }

  .Ack {
    background: green;
  }

  .Out:hover {
    background: blue;
  }
</style>
