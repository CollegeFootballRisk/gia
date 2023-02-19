<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { onMount } from "svelte";
  import { turn, turns } from "../state/state";
  import { getTurnInfo } from "../utils/loads";
  import Loader from "./Loader.svelte";
  var rollTime;
  var getting;
  var rollDay;
  var rollSeason;

  let time = new Date();

  function set_clock_time(turns, turn) {
    getting = getTurnInfo(null).then((val) => {
      if (val.rollTime == null) return;
      rollDay = val.day;
      rollSeason = val.season;
      rollTime = new Date(val.rollTime + "Z");
    }); // Get the latest turn
  }

  function returnTime(rollTime, time) {
    var hourDiff = rollTime - time; //in ms
    var secDiff = hourDiff / 1000; //in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var timeTable = {};
    timeTable.hours = Math.floor(hDiff);
    timeTable.minutes = Math.floor(minDiff - 60 * timeTable.hours);
    timeTable.seconds = Math.floor(
      secDiff - 60 * 60 * timeTable.hours - 60 * timeTable.minutes
    );
    var col = Math.floor(secDiff) % 2 == 0 ? ":" : " ";
    return `${String(timeTable.hours).padStart(2, "0")}${col}${String(
      timeTable.minutes
    ).padStart(2, "0")}${col}${String(timeTable.seconds).padStart(2, "0")}`;
  }

  function reLoad() {
    window.reload;
  }

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  $: set_clock_time(turns, turn);
  $: timeString = returnTime(rollTime, time);
</script>

<div style="text-align:right;">
  <div title="Timer" alt="Countdown until next roll">
    {#key getting}
      {#await getting}
        <Loader />
      {:then discard}
        {#if rollTime == null}
          <!--Nothing
        No active roll-->
        {:else if rollTime[0] != "-"}
          T-{timeString}<br />
          to turn {rollSeason}/{rollDay}
        {:else}
          <a href="." on:click={reLoad}>Past Roll &#128472;</a>
        {/if}
      {/await}
    {/key}
  </div>
  <br />
  <!--<b style="color:red;font-size:1.25em;"
    ><a href="https://www.twitch.tv/helv28" target="_blank"
      >Live Stream</a
    ></b
  >-->
</div>
