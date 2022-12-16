<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import Loader from "../components/Loader.svelte";
  export let title = "Title";
  export let message = "Interesting...";
  export let loading = false;
  export let error = false;
  var color = "blue";
  if (error) {
    color = "red";
  }
</script>

<div style="color:{color};">
  <h2>{title}</h2>
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
