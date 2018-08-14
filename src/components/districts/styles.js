import { Fill } from 'ol/style';
import { Style } from 'ol/style';
import { asArray } from 'ol/color';

const colors = [
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

export function getColor(index, opacity = 1) {
  if (index === undefined || index < 0 || index >= colors.length -1 ) {
    return [0, 0, 0, 0.6];
  }
    const color = asArray(colors[index]);
  return color.slice(0, 3).concat(opacity);
}

export const MapStyles = colors.map((color, index) => (
  new Style({
    fill: new Fill({color: getColor(index, 0.6)})
  })
));
