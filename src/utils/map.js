function fill_map(type = "map", date){
    // If date is null, then we know to get the latest.
    // https://collegefootballrisk.com/api/heat
    // https://collegefootballrisk.com/api/territories
}

function get_heat(){

}

function get_territories(){

}

/// This is an expensive function to overwrite the map colors.
/// This expects two arguments, data [{
///         territory: String,
///         color: String,
///         color_hover: String,
///         owner: String,
///         region: Option<String>,
///         power: Option<float>,
///         players: Option<integer>,
///        }], and focus <String> (name of territory)
function draw_map(data, focus){
    clear_map();
    for(var terr = 0; terr < data.length; terr++){
        try {
            let target = document.getElementById(data[terr]['territory']);
            target.style.fill = data[terr]['color'];
            target.setAttribute('hover-fill', data[terr]['color_hover']);
            target.setAttribute('owner', data[terr]['owner']);
        } catch {

        }
    }
}

function clear_map(){
    for(territory of document.getElementById('Territories').getElementsByTagName('path')){
        territory.style.fill = "#808080";
        territory.setAttribute("hover-fill", "#808080");
        territory.removeAttribute("owner");
    }
}

// Used to get heat values
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