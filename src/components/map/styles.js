import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';


export default function createLayerStyle(layer) {
  if (layer.style) {
    if (layer.type === 'polygon') {
      return createPolygonStyle(layer.style);
    }
    return createPointStyle(layer.style);
  }
}

function createPolygonStyle(config = {}) {
  return new Style({
    fill: new Fill({
      color: config.fill
    }),
    stroke: new Stroke({
      color: config.stroke
    })
  });
}

function createPointStyle(config = {}) {
  const style = new Style({
    image: new Circle({
      radius: config.radius || 7,
      stroke: new Stroke({
        color: 'white',
        width: 2
      }),
      fill: new Fill({
        color: config.fill
      })
    })
  });

  if (config.label) {
    const groupStyle = style.clone();
    groupStyle.getImage().setRadius(11);
    groupStyle.setText(
      new Text({
        font: 'bold 12px Calibri,sans-serif',
        textBaseline: 'middle',
        fill: new Fill({
          color: '#fff'
        })
      })
    );

    style.setText(
      new Text({
        font: '13px Calibri,sans-serif',
        textBaseline: 'top',
        offsetY: 6,
        fill: new Fill({
          color: '#444'
        }),
        stroke: new Stroke({
          color: config.fill,
          width: 2
        })
      })
    );

    return (feature, res) => {
      const groupedFeatures = feature.get('features');
      if (groupedFeatures) {
        if (groupedFeatures.length > 1) {
          groupStyle.getText().setText(`${groupedFeatures.length}`);
          return groupStyle;
        }
        feature = groupedFeatures[0];
      }
      style.getText().setText(res < 200 ? feature.get(config.label) : '');
      return style;
    }
  }
  return [style];
}