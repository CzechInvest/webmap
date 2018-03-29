import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';
import Icon from 'ol/style/icon';
import OlColor from 'ol/color';


export function cssColor(color) {
  if (Array.isArray(color)) {
    switch (color.length) {
      // case 2: return OlColor.asArray(color[0]).slice(0, 3).concat(color[1]);
      case 2: {
        const rgb = OlColor.asArray(color[0]).slice(0, 3);
        return `rgba(${rgb.join(',')}, ${color[1]})`;
      }
      case 3: return `rgb(${color.join(',')})`;
      default: return `rgba(${color.join(',')})`;
    }
  }
  return color;
}

export function olColor(color) {
  if (Array.isArray(color) && color.length === 2) {
    return OlColor.asArray(color[0]).slice(0, 3).concat(color[1]);
  }
  return color;
}

export function createLayerStyle(layer) {
  const config = layer.style;

  switch (config.type) {
    case 'circle':
      return createCircleStyle(config);

    case 'icon':
      // return createIconStyle(config);
      return Object.assign(
        createIconStyle(config),
        {
          highlight: color => createIconStyle(Object.assign({}, config, {fill: color}))
        }
      );

    case 'categorized':
      // return createCategorizedStyle(config);
      return Object.assign(
        createCategorizedStyle(config),
        {
          highlight: color => {
            const style = createPolygonStyle(Object.assign({}, config.base, {fill: color}));
            return (f) => style;
          }
        }
      );
    default: {
      return Object.assign(
        createPolygonStyle(config),
        {
          highlight: (color) => {
            return createPolygonStyle(Object.assign({}, config, {fill: color}));
          }
        }
      );
    }
  }
}

function createCategorizedStyle(config) {
  const filters = config.categories.map(category => {
    let matchFn;
    if (category.range) {
      matchFn = val => val >= category.range[0] && val <= category.range[1];
    } else if (category.value !== undefined) {
      matchFn = val => val === category.value;
    }
    const styleCfg = Object.assign({}, config.base, category);
    return {
      match: matchFn,
      style: createLayerStyle({style: styleCfg})
    };
  });
  /*
  return f => {
    const val = f.get(config.attribute);

    const index = filters.findIndex(filter => filter.match(val));
    if (index === -1) return null;
    const sColor = olColor(config.categories[index].fill);
    const eColor = index + 1 < config.categories.length ? olColor(config.categories[index+1].fill) : [0,0,0,0.75];
    const range = config.categories[index].range;
    const k = (val - range[0]) / (range[1] - range[0]);

    // const sColor = olColor(config.categories[0].fill);
    // const eColor = olColor(config.categories[config.categories.length-1].fill);
    // const k = val / config.categories[config.categories.length-1].range[1];
    const color = sColor.map((v, i) => (v + (eColor[i] - v) * k));
    const styleCfg = Object.assign({}, config.base, {fill: color});
    return createLayerStyle({style: styleCfg});
  }
  */
  return f => {
    const val = f.get(config.attribute);
    const match = filters.find(filter => filter.match(val));
    if (!match) {
      console.log('Out of range:', val);
    }
    return match ? match.style : null;//createPolygonStyle({fill: 'red'});
  }
}

function createPolygonStyle(config = {}) {
  const opts = {};
  if (config.fill) {
    opts.fill = new Fill({
      color: olColor(config.fill)
    });
  }
  if (config.stroke) {
    opts.stroke = new Stroke({
      color: olColor(config.stroke),
      width: config.strokeWidth || 1
    });
  }
  return new Style(opts);
}

const badge = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">'+
  '<circle cx="6" cy="6" r="7" style="fill:rgba(220,0,46, 0.8)" /></svg>';

function createIconStyle(config = {}) {
  const iconSymbolEl = document.querySelector(`svg #${config.icon}`);
  const viewBox = iconSymbolEl.getAttribute('viewBox') || '';
  let attrs = {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: 28,
    height: 28,
    viewBox: viewBox,
    // style: `fill: ${config.fill};background-color: rgba(255,255,255,0.5);border-radius: 12px;`
    style: `fill: ${cssColor(config.fill)}`
  };
  attrs = Object.keys(attrs).map(key => `${key}="${attrs[key]}"`);
  const svg = `<svg ${attrs.join(' ')}>${iconSymbolEl.innerHTML}</svg>`;
  const style = new Style({
    image: new Icon({
      src: 'data:image/svg+xml,' + escape(svg),
      anchor: [0.5, 0.75]
    }),
    geometry: f => {
      const geom = f.getGeometry();
      switch (geom.getType()) {
        case 'Polygon':
          return geom.getInteriorPoint();
        case 'MultiPolygon':
          return geom.getPolygon(0).getInteriorPoint();
        default:
          return geom;
      }
    }
  });
  if (config.label) {
    style.setText(new Text({
      font: '13px Calibri,sans-serif',
      textBaseline: 'top',
      offsetY: 9,
      fill: new Fill({
        color: '#444'
      }),
      stroke: new Stroke({
        color: olColor(config.fill),
        width: 1
      })
    }));
  }

  const groupStyle = new Style({
    image: new Icon({
      anchor: [-0.25,1.15],
      src: 'data:image/svg+xml,' + escape(badge),
    }),
    text: new Text({
      font: 'bold 9px Calibri,sans-serif',
      // textBaseline: 'top',
      offsetX: 9,
      offsetY: -8,
      fill: new Fill({
        color: '#fff'
      })
    })
  });

  return function(feature, res) {
    const groupedFeatures = feature.get('features');
    if (groupedFeatures) {
      if (groupedFeatures.length > 1) {
        groupStyle.getText().setText(`${groupedFeatures.length}`);
        return [style, groupStyle];
      }
      feature = groupedFeatures[0];
    }
    if (config.label) {
      style.getText().setText(res < 50 ? feature.get(config.label) : '');
    }
    return [style];
  }
}

function createCircleStyle(config = {}) {
  const style = new Style({
    image: new Circle({
      radius: config.radius || 7,
      stroke: new Stroke({
        color: config.stroke || 'white',
        width: config.strokeWidth || 2
      }),
      fill: new Fill({
        color: olColor(config.fill)
      })
    })
  });
  if (config.label) {
    style.setText(
      new Text({
        font: '13px Calibri,sans-serif',
        textBaseline: 'top',
        offsetY: 9,
        fill: new Fill({
          color: '#444'
        }),
        stroke: new Stroke({
          color: olColor(config.fill),
          width: 1
        })
      })
    );
  }
  const groupStyle = style.clone();
  groupStyle.getImage().setRadius(12);
  groupStyle.setText(
    new Text({
      font: 'bold 12px Calibri,sans-serif',
      // textBaseline: 'top',
      offsetY: 0.5,
      fill: new Fill({
        color: '#fff'
      })
    })
  );

  return (feature, res) => {
    const groupedFeatures = feature.get('features');
    if (groupedFeatures) {
      if (groupedFeatures.length > 1) {
        groupStyle.getText().setText(`${groupedFeatures.length}`);
        return [groupStyle];
      }
      feature = groupedFeatures[0];
    }
    if (config.label) {
      style.getText().setText(res < 50 ? feature.get(config.label) : '');
    }
    return [style];
  }
}


function svgDonut(colors) {
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
  fill: new Fill({
    color: '#333'
  })
});

const normalDonutText = new Text({
  font: 'bold 13px Calibri,sans-serif',
  textBaseline: 'top',
  offsetY: 10,
  fill: new Fill({
    color: '#333'
  }),
  stroke: new Stroke({
    color: '#fff',
    width: 1
  })
});

const iconCache = {};
export function generateColoredDonutStyle(colors, isGroup, text) {
  const key = JSON.stringify(colors);
  let icon = iconCache[key];
  if (!icon) {
    const svg = svgDonut(colors);
    icon = new Icon({
      src: 'data:image/svg+xml,' + escape(svg)
    });
    iconCache[key] = icon;
  }
  icon.setScale(isGroup ? 1 : 0.75);
  const style = new Style({image: icon});
  if (text) {
    const textStyle = isGroup ? groupDonutText : normalDonutText;
    textStyle.setText(text);
    style.setText(textStyle);
  }
  return [style];
}

function svgColoredIcon(colors, icon) {
  const iconEl = document.querySelector(`svg #${icon}`);

  const segment = 48 / colors.length;
  const stripes = colors.map((color, index) => {
    return (
      <rect
        key={index}
        width="48"
        height={segment}
        x="0"
        y={segment * index}
        fill={cssColor(color)} />
    )
  });
  return ReactDOMServer.renderToString(
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0" y="0" width="32px" height="32px" viewBox="0 0 48 48">
      <defs>
        <pattern id="stripes" width="48" height="48" patternUnits="userSpaceOnUse">
          {stripes}
        </pattern>
      </defs>
      <g dangerouslySetInnerHTML={{__html: iconEl.innerHTML}} fill="url(#stripes)"></g>
    </svg>
  );
}


const badgeStyle = new Style({
  image: new Icon({
    anchor: [-0.25,1.15],
    src: 'data:image/svg+xml,' + escape(badge),
  }),
  text: new Text({
    font: 'bold 9px Calibri,sans-serif',
    // textBaseline: 'top',
    offsetX: 9,
    offsetY: -8,
    fill: new Fill({
      color: '#fff'
    })
  })
});

export function coloredPointIcon(config) {
  const pointsIconsCache = {};
  return (colors = ['orange', 'green', 'red'], isGroup, text) => {
    const key = JSON.stringify(colors);
    let iconStyle = pointsIconsCache[key];
    if (!iconStyle) {
      const svg = svgColoredIcon(colors, config.icon);
      iconStyle = new Icon({
        src: 'data:image/svg+xml,' + escape(svg),
        anchor: config.anchor || [0.5, 0.75]
      });
      pointsIconsCache[key] = iconStyle;
    }
    iconStyle.setScale(isGroup ? 1 : 0.85);
    const style = new Style({image: iconStyle});

    if (isGroup) {
      badgeStyle.getText().setText(text);
      return [style, badgeStyle];
    }
    return [style];
  }
}

function createColorsPattern(colors) {
  const segment = 10;
  const size = segment * colors.length;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // ctx.rotate(45);
  colors.forEach((color, i) => {
    ctx.fillStyle = cssColor(color);
    ctx.fillRect(i * segment, 0, segment, size);
  });

  return ctx.createPattern(canvas, 'repeat');
}

export function coloredPolygonStyle(baseStyle) {
  const style = new Style({
    fill: new Fill({})
  });
  if (baseStyle.stroke) {
    style.setStroke(new Stroke({
      color: olColor(baseStyle.stroke),
      width: baseStyle.strokeWidth || 1
    }));
  }
  const cache = {};
  return (colors) => {
    if (colors.length > 1) {
      const key = JSON.stringify(colors);
      let color = cache[key];
      if (!color) {
        color = createColorsPattern(colors);
        cache[key] = color;
      }
      style.getFill().setColor(color);
    } else {
      style.getFill().setColor(olColor(colors[0]));
    }
    return style;
  }
}
