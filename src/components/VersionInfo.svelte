<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import pkg from "../../package.json";
  console.log(`running version ${pkg.version}`);
  let rrv = fetch("/api/sys/info").then((response) => response.json());
</script>

<center>
  <h1>Version Information</h1>
</center>
<p>
  Gia (Frontend) Version: {pkg.version}<br />
  {#await rrv}
    Rust-Risk (Backend) Version: Loading...<br />
  {:then rrv_val}
    Rust-Risk (Backend) Version: {rrv_val.version}<br />
  {/await}
  Browser Version: {navigator.userAgent} from {navigator.vendor} <br />
</p>
