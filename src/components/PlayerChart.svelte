<script>
  export let extern_data;
  export let season;

  import { Line } from "svelte-chartjs";
  var data = {
    labels: [],
    datasets: [
      {
        label: "Starpower",
        fill: false,
        lineTension: 0.3,
        backgroundColor: "rgba(225, 204, 230, 0)",
        borderColor: "rgb(205, 130, 158)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(205, 130,1 58)",
        pointBackgroundColor: "rgb(255, 255, 255)",
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(0, 0, 0)",
        pointHoverBorderColor: "rgba(220, 220, 220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
    ],
  };

  for (let i = 0; i < extern_data.length; i++) {
    if (extern_data[i]["season"] != season) continue;
    data.labels.push(extern_data[i].day);
    data.datasets[0].data.push(extern_data[i].starPower);
  }

  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from "chart.js";

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );
</script>

<Line {data} options={{ responsive: true }} />
