import Fill from 'ol/style/fill';
import Style from 'ol/style/style';

export const Colors = {
  19: [255,235,59 ,0.5],
  27: [76,175,80 ,0.5],
  35: [255,87,34 ,0.5],
  43: [63,81,181 ,0.5],
  51: [233,30,99 ,0.5],
  60: [156,39,176 ,0.5],
  78: [69,90,100 ,0.6],
  86: [118,255,3 ,0.5],
  108: [213,0,0 ,0.5],
  94: [121,85,72 ,0.6],
  116: [0,137,123 ,0.5],
  124: [48,63,159 ,0.5],
  132: [10,10,10, 0.6],
  141: [196,160,0, 0.5]
}

export const MapStyles = {};
Object.keys(Colors).forEach(key => {
  MapStyles[key] = new Style({
    fill: new Fill({color: Colors[key]})
  });
});
