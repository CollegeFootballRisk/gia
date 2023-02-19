<script>
  import { modal } from "../state/state";
  import { runAction } from "../utils/actions";
  import Loader from "./Loader.svelte";
import { onMount } from "svelte/internal";
  export var target;
  export var error;
  var widgetId1;


  function submitCaptcha() {
    let e = grecaptcha.getResponse(widgetId1);
    runAction(target, e);
  }

  onMount(() => {
  widgetId1 = grecaptcha.render('g-widget-1', {
          'sitekey' : RECAPTCHA_V2_SITE,
          'theme' : 'light'
        });
  });
</script>
    <center>
      {#if error != undefined}
        <b><i style="color: red;">Error: {error}</i></b><br />
      {/if}
      <div id="g-widget-1" class="g-recaptcha" data-sitekey={RECAPTCHA_V2_SITE}></div>
	<button
        on:click={submitCaptcha}>Submit</button
      >
    </center>

<style>
  button {
    color: var(--accent-fg);
    background: var(--accent-2);
    height: 2em;
    border: none;
    padding: 0.3em;
    font-size: 1.3em;
    line-height: 1em;
    border-radius: 5px;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
  }

  button:hover {
    background: var(--accent-1);
  }
</style>
