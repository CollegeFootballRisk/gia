<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
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
      bind:checked={$settings.pulse_territories}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label"
      >Pulse the territory that you have selected once your move has been made
      (causes a territory to fade in and out if you have selected it as your
      move).</span
    >
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.bridges_default}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Show bridges when the map first loads</span>
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.regions_default}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label">Show regions when the map first loads</span>
  </label>
  <hr />
  <label class="toggle">
    <input
      bind:checked={$settings.experiments}
      class="toggle-checkbox"
      type="checkbox"
    />
    <div class="toggle-switch" />
    <span class="toggle-label"
      >Opt-in to temporary experiments (e.g. bug fixes)</span
    >
  </label>
  <hr />
  <label class="toggle">
    <select bind:value={$settings.default_page_size} class="select">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="20">20</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
    <span class="toggle-label">How many rows to show on tables by default.</span
    >
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

  .select {
    display: inline-block;
    background: #ccc;
    border-radius: 16px;
    width: 58px;
    height: 32px;
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
