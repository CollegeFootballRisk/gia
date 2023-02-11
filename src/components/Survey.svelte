<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  var e = document.querySelectorAll(".close");
  for (let i = 0; i < e.length; i++) {
    e[i].style.display = "none !important";
  }

  function hidePrompt() {
    window.localStorage.seen = true;
    window.closeModal();
  }
</script>

<center>
  <h1>Risk Midpoint Survey</h1>
  <p>
    You are invited to take the Season 3.0 Midpoint through 10:30 ET on 2/17/23.
  </p>
  <p>
    This survey will assist the game mods in determining how we can serve you
    and how we can improve the game for season 4.0. None of the changes
    described in the survey are guaranteed to be in 4.0, nor are they
    representative of all changes that might be made. An additional survey will
    take place at the end of 3.0 to further hone the changes the community would
    like for 4.0.
  </p>
  <p>
    You may access the survey <a
      class="Out"
      href="https://forms.gle/YEMm7xXsSYXURbhJA"
      title="To Google Survey"
      alt="To Google Survey"
      target="_blank">Here</a
    >
  </p>

  <input
    type="button"
    on:click={hidePrompt}
    class="Out Ack"
    value="Acknowledged"
  /><br />
  <b
    ><i
      >This prompt will appear on fresh page load until you click "Acknowledged"</i
    ></b
  >
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
