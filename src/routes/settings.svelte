<script>
  export var currentRoute;
  export var params;
  import { modal } from "../state/state.js";
  import { bind } from "svelte-simple-modal";
  import VersionInfo from "../components/VersionInfo.svelte";
  import { settings } from "../state/settings";

  const showVersionInfo = () => modal.set(bind(VersionInfo));
</script>

<h1>Settings</h1>
<div class="overflow">
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.images}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Background Images</span>
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.lightmode}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Light Mode</span>
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.prompt_move}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Prompt me to make a move if I haven't</span>
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.dont_check_map_lock}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Make the map more sensitive (helpful on Android devices).</span>
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.experiments}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Opt-in to temporary experiments (e.g. bug fixes)</span>
  </label>
  <hr />
  <a href="/settings#info" on:click={showVersionInfo}>Version Information</a>
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
