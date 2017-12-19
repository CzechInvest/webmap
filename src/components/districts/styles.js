import Fill from 'ol/style/fill';
import Style from 'ol/style/style';
import OlColor from 'ol/color';

const Colors = {
  19: '#002E5F',
  27: '#DB002E',
  35: '#475A8F',
  43: '#7C88C3',
  51: '#DD4A53',
  60: '#EB7274',
  78: '#D8A881',
  86: '#F3914E',
  108: '#DCA28F',
  94: '#CFAAB4',
  116: '#F088A4',
  124: '#FCE94F',
  132: '#73D216',
  141: '#75507B'
}

export function getColor(id, opacity=1) {
  const color = OlColor.asArray(Colors[id]);
  return color.slice(0, 3).concat(opacity);
}

export const MapStyles = {};
Object.keys(Colors).forEach(key => {
  MapStyles[key] = new Style({
    fill: new Fill({color: getColor(key, 0.5)})
  });
});
