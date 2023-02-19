<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  export let currentRoute;
  import { bind } from "svelte-simple-modal";
  import { modal } from "../state/state";

  console.log(currentRoute);
  modal.set(bind(null));
  function nameFromHash(hash) {
    switch (hash) {
      case "EmailError":
        return "Unverified Email";
        break;

      default:
        return "Unknown Error";
        break;
    }
  }
</script>

<h1>Small issue, boss :(</h1>
<h3>{nameFromHash(currentRoute.namedParams.error)}</h3>
<center>
  <b
    >Your Reddit account does not yet have a verified email. A verified email is
    necessary to log in. Visit <a href="https://www.reddit.com/settings/"
      >your Reddit Settings</a
    > to get verfied today!</b
  > <br /> <br />
  <i
    >Error? <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSf6o60hXZOuCXDIB-YphQtceNcs92k6zlGwJe3iigA7qnvIlA/viewform"
      target="_blank">Submit a bug.</a
    ></i
  >
</center>

<style>
  h1 {
    padding-top: 10px;
    font-size: 2em;
    text-align: center;
    color: var(--main-foreground-color);
    margin: 0px;
    padding-bottom: 0px;
    line-height: 2em;
  }
  h3 {
    text-align: center;
    font-size: 1em;
    margin-top: 0px;
    color: var(--main-foreground-color);
  }
</style>
