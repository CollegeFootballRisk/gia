<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import Loader from "../components/Loader.svelte";
  import {
    faCheckCircle,
    faXmarkCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  export let title = "Title";
  export let message = "Interesting...";
  export let loading = false;
  export let error = false;
  export let good = false;
  var color = "var(--main-foreground-color)";
  if (error) {
    color = "red";
  }
</script>

<div style="color:{color};">
  <h2>
    {#if good}<FontAwesomeIcon
        icon={faCheckCircle}
        style="color:#66FF00;"
      />&nbsp;&nbsp;{:else if error}<FontAwesomeIcon
        icon={faXmarkCircle}
        style="color:#FF0066;"
      />&nbsp;&nbsp;{/if}{title}
  </h2>
  <center>{message}</center>
  <br /><br />
  {#if loading}
    <Loader />
  {/if}
</div>

<style>
  h2 {
    font-size: 2rem;
    text-align: center;
  }
</style>
