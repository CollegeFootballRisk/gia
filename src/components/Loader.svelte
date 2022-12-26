<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->
<script>
  import { faRefresh } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
</script>

<div class="sidebar-content">
  <FontAwesomeIcon icon={faRefresh} spin={true} size="3x" />
</div>

<style>
  .sidebar-content {
    width: 100%;
    display: inline-flex; /* make element size relative to content */
    align-items: center; /* vertical alignment of items */
    text-align: middle;
    justify-content: center;
  }
</style>
