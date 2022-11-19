<main>
  <h2>Settings</h2>
  <ul>
    <li>
      Enable catfood:&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch">
        <input type="checkbox" />
        <span class="slider" />
      </label>
    </li>
    <li>
      Enable dogfood:&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch">
        <input type="checkbox" />
        <span class="slider" />
      </label>
    </li>
    <li>
      Enable foxfood:&nbsp;&nbsp;&nbsp;&nbsp;<label class="switch">
        <input type="checkbox" />
        <span class="slider" />
      </label>
    </li>
  </ul>
</main>

<style>
  h2 {
    vertical-align: center;
    text-align: center;
  }
  /** Buttons **/
  .switch {
    position: relative;
    display: inline-block;
    width: 2em;
    height: 1.2em;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--accent-bg);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 1em;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1em;
    width: 1em;
    left: 0.1em;
    bottom: 0.1em;
    background-color: var(--accent-fg);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--accent-2);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--accent-2);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(0.75em);
    -ms-transform: translateX(0.75em);
    transform: translateX(0.75em);
  }
</style>
