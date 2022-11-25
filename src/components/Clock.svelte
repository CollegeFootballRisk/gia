<script>
  import { onMount } from "svelte";
  import { turn, turns } from "../state/state.js";
  import { getTurnInfo } from "../utils/normalization";
  import Loader from "./Loader.svelte";
  var rollTime;
  var getting;

  let time = new Date();

  function set_clock_time(turns, turn) {
    getting = getTurnInfo(null).then((val) => {
      if (val.rollTime == null) return;
      rollTime = new Date(val.rollTime+'Z');
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
  {#key getting}
    {#await getting}
      <Loader />
    {:then discard}
      {#if rollTime == null}
        <!--Nothing
        No active roll-->
      {:else}
        T-{timeString}
      {/if}
    {/await}
  {/key}
  <br /><br />
  <b style="color:red;font-size:1.25em;">THIS IS A TEST GAME</b>
</div>
