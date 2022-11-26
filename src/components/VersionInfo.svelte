<script>
  import pkg from "../../package.json";
  console.log(`running version ${pkg.version}`);
</script>

<center>
  <h1>Version Information</h1>
</center>
<p>
  Gia (Frontend) Version: {pkg.version}<br />
  Rust-Risk (Backend) Version: UNKNOWN<br />
  Browser Version: {navigator.userAgent} from {navigator.vendor} <br/>
  Android: {(typeof window.Android === "undefined")?'false':'true'}
</p>
