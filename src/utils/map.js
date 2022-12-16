// Used to get heat values
import panzoom from "panzoom";
export var percentColors = [
  { pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
  { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
  { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } },
];
export var getColorForPercentage = function (pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };
  return "rgba(" + [color.r, color.g, color.b].join(",") + ",0.5)";
  // or output as hex if preferred
};

export function setupMapPanZoom(handleMouseOver, handleWindowKeyDown) {
  let panzoomOptions = {
    maxZoom: 10,
    minZoom: 0.5,
    initialZoom: 1,
    zoomDoubleClickSpeed: 1,
    bounds: true,
    boundsPadding: 0.01,
    autocenter: true,
    onClick: handleMouseOver,
  };
  let map = document.querySelector("#map");
  window.maphandle = panzoom(map, panzoomOptions);
  map.addEventListener("click", handleMouseOver, false);
  map.addEventListener("mouseover", handleMouseOver, false);
  map.addEventListener("mouseout", handleMouseOver, false);
  map.addEventListener("click", handleMouseOver, false);

  document.addEventListener("keydown", handleWindowKeyDown);
}
