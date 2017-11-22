import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';
import Icon from 'ol/style/icon';


export function cssColor(color) {
  if (Array.isArray(color)) {
    return `rgba(${color.join(',')})`;
  }
  return color;
}


export function createLayerStyle(layer) {
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
          width: 1
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


function generateSvg(colors) {
  const r = 10;
  const diameter = 2 * 3.14 * r;
  const segment = diameter / colors.length;
  const dashArray = `${segment} ${diameter - segment}`;
  const parts = colors.map((color, index) => {
    const offset = segment * index;
    return (
      <circle
        key={index}
        cx="16" cy="16" r={r}
        fill="transparent"
        strokeWidth="5"
        stroke={cssColor(color)}
        strokeDasharray={dashArray}
        strokeDashoffset={offset} />
    )
  });
  return ReactDOMServer.renderToString(
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0" y="0" width="32px" height="32px" viewBox="0 0 32 32">
      <circle fill="#ffffff" cx="15" cy="15" r="8"/>
      {parts}
    </svg>
  );
}

const groupDonutText = new Text({
  font: 'bold 10px Calibri,sans-serif',
  textBaseline: 'middle',
  fill: new Fill({
    color: '#333'
  })
});

const normalDonutText = new Text({
  font: 'bold 13px Calibri,sans-serif',
  textBaseline: 'top',
  offsetY: 6,
  fill: new Fill({
    color: '#333'
  }),
  stroke: new Stroke({
    color: '#fff',
    width: 1
  })
});

const cache = {};
export function generateColoredDonutStyle(colors, isGroup, text) {
  const key = JSON.stringify(colors);
  let svg = cache[key];
  if (!svg) {
    svg = generateSvg(colors);
    cache[key] = svg;
  }
  const style = new Style({
    image: new Icon({
      src: 'data:image/svg+xml,' + escape(svg),
      scale: isGroup ? 1 : 0.75
    })
  });
  if (text) {
    const textStyle = isGroup ? groupDonutText : normalDonutText;
    textStyle.setText(text);
    style.setText(textStyle);
  }
  return style;
}

export default {cssColor, createLayerStyle, generateColoredDonutStyle};
