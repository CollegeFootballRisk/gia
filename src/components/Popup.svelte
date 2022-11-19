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
