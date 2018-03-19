import Fill from 'ol/style/fill';
import Style from 'ol/style/style';
import OlColor from 'ol/color';

const Colors = [
  '#002E5F',
  '#DB002E',
  '#F3914E',
  '#F088A4',
  '#FCE94F',
  '#73D216',
  '#75507B',
  '#DCA28F',
  '#CFAAB4'
];

export function getColor(index, opacity=1) {
  const color = OlColor.asArray(Colors[index]);
  return color.slice(0, 3).concat(opacity);
}

export const MapStyles = Colors.map((color, index) => (
  new Style({
    fill: new Fill({color: getColor(index, 0.6)})
  })
));
