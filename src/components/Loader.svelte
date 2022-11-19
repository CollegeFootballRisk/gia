<script>
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { faRefresh } from "@fortawesome/free-solid-svg-icons";
  import {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText,
  } from "fontawesome-svelte";
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
