<script>
  import { modal } from "../state/state";
  import { runAction } from "../utils/actions";
  import { getNewCaptcha } from "../utils/loads";
  import Loader from "./Loader.svelte";
  let captcha_service = getNewCaptcha();
  export var target;
  export var error;
  var captchaVal = "";
  var captchaTitle = "";

  function newCaptcha() {
    captcha_service = getNewCaptcha();
  }

  function submitCaptcha() {
    runAction(target, captchaTitle, captchaVal);
  }

  function setCaptchaTitle(title) {
    captchaTitle = title;
    return "";
  }
</script>

{#key captcha_service}
  {#await captcha_service}
    <Loader />
  {:then captcha}
    <center>
      {#if error != undefined}
        <b><i style="color: red;">Error: {error}</i></b><br />
      {/if}
      <i
        >Please enter the case-sensitive text in the below captcha into the
        input box and press submit:</i
      ><br /><br />
      <img src="data:image/png;base64, {captcha.content}" alt="Red dot" /><br
      /><br />
      {setCaptchaTitle(captcha.title)}
      <input type="text" bind:value={captchaVal} />
      <button on:click={newCaptcha}>Different Captcha</button><button
        on:click={submitCaptcha}>Submit</button
      >
    </center>
  {/await}
{/key}

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
