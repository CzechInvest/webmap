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

function svgContent (symbol) {
  let content = symbol.innerHTML;
  if (!content) {
    const childNodes = Array.from(symbol.childNodes)
    content = childNodes.map(el => new XMLSerializer().serializeToString(el)).join('');
  }
  return content;
}

function colorifyCircle(style, colors) {
  // there is no setFill in ol.style.Circle, so we need to create a new circle
  const base = style.getImage();
  style.setImage(
    new Circle({
      radius: base.getRadius(),
      stroke: base.getStroke(),
      fill: new Fill({ color: olColor(colors[0]) }) // supports only single color
    })
  )
}

function circleStyle(config) {
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

  style.setColors = colors => colorifyCircle(style, colors);

  const groupStyle = style.clone();
  groupStyle.getImage().setRadius(12);
  groupStyle.setText(
    new Text({
      font: 'bold 12px Calibri,sans-serif',
      offsetY: 0.5,
      fill: new Fill({
        color: '#fff'
      })
    })
  );
  groupStyle.setLabel = text => groupStyle.getText().setText(text);
  groupStyle.setColors = colors => colorifyCircle(groupStyle, colors);

  return {
    style: style,
    group: groupStyle
  };
}


function iconStyle(config) {
  const pointsIconsCache = {};
  function coloredIcon(colors, scale=1) {
    const key = JSON.stringify(colors);
    let icon = pointsIconsCache[key];
    if (!icon) {
      const svg = svgColoredIcon(colors, config.icon, 28);

      icon = new Icon({
        src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
        imgSize: [28, 28],
        anchor: config.anchor || [0.5, 1]
        // anchor: [0.5, 0]
      });
      pointsIconsCache[key] = icon;
    }
    icon.setScale(scale);
    return icon;
  }

  const iconSymbolEl = document.querySelector(`svg #${config.icon}`);
  const viewBox = iconSymbolEl.getAttribute('viewBox') || '';
  let attrs = {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: 28,
    height: 28,
    viewBox: viewBox,
    style: `fill: ${cssColor(config.fill)}`
  };
  attrs = Object.keys(attrs).map(key => `${key}="${attrs[key]}"`);
  const svg = `<svg ${attrs.join(' ')}>${svgContent(iconSymbolEl)}</svg>`;
  // const svg = svgColoredIcon(['red', 'blue'], config.icon);

  const style = new Style({
    image: new Icon({
      src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
      imgSize: [28, 28],
      anchor: [0.5, 1]
    })
  })
  style.setColors = colors => style.setImage(coloredIcon(colors, 0.85));

  const groupIcon = style.clone();
  style.getImage().setScale(0.85);

  const badgeStyle = createBadgeStyle(32, 32);
  const groupStyle = [groupIcon, badgeStyle];

  groupStyle.setLabel = text => badgeStyle.getText().setText(`${text}`);
  groupStyle.setColors = colors => groupIcon.setImage(coloredIcon(colors, 1));

  return {
    style,
    group: groupStyle
  }
}

function categorizedColors(config) {
  const filters = config.categories.map(category => {
    let matchFn;
    if (category.range) {
      matchFn = val => val >= category.range[0] && val <= category.range[1];
    } else if (category.value !== undefined) {
      matchFn = val => val === category.value;
    }
    return {
      match: matchFn,
      color: category.fill
    };
  });
  return f => {
    let values;
    if (f.get('features')) {
      values = Array.from(new Set(f.get('features').map(f => f.get(config.attribute))));
    } else {
      values = [f.get(config.attribute)];
    }

    return values
      .map(val => filters.find(filter => filter.match(val)))
      .filter(match => match)
      .map(match => match.color);
  }
}

export function createPointStyle(config, colorify) {
  config.label = 'name';
  let type;
  if (config.type === 'circle') {
    type = circleStyle;
  } else if (config.type === 'icon') {
    type = iconStyle;
  } else if (config.type === 'categorized') {
    return createPointStyle(config.base, categorizedColors(config))
  } else {
    type = circleStyle;
  }
  const { style, group } = type(config);

  // style.setColors(['red', 'blue']);
  // group.setColors(['orange', 'green']);

  if (config.label) {
    const text = new Text({
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
    });
    style.setText(text);
  }
  const styleFn = (feature, res) => {
    const cluster = feature.get('features');
    if (cluster) {
      if (cluster.length > 1) {
        group.setLabel(`${cluster.length}`);
        if (colorify) {
          group.setColors(colorify(feature));
        }
        return Array.isArray(group) ? group : [group];
      }
      feature = cluster[0];
    }

    if (config.label) {
      style.getText().setText(res < 50 ? feature.get(config.label) : '');
    }
    if (colorify) {
      style.setColors(colorify(feature));
    }
    return [style];
  }
  // styleFn.highlight = (color) => {
  //   console.log('highlight')
  //   const { style } = type(config);
  //   style.setColors([color]);
  //   return [style];
  // }
  styleFn.highlight = function (color) {
    return createPointStyle(config, f => [color]);
  }
  return styleFn;
}

export function createLayerStyle(layer) {
  const config = layer.style;

  switch (config.type) {

    case 'categorized':
      // return createCategorizedStyle(config);
      return Object.assign(
        createCategorizedStyle(config),
        {
          highlight: color => {
            const style = createPolygonStyle({...config.base, fill: color});
            return (f) => style;
          }
        }
      );
    default: {
      return Object.assign(
        createPolygonStyle(config),
        {
          highlight: (color) => {
            return createPolygonStyle({...config, fill: color});
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
    const styleCfg = {...config.base, ...category};
    return {
      match: matchFn,
      color: category.fill,
      style: createLayerStyle({style: styleCfg})
    };
  });

  if (config.base.type === 'icon') {
    var baseStyle = coloredPointIcon(config.base);
  }

  return (f, res) => {
    const cluster = f.get('features');
    if (cluster && cluster.length > 1) {
      const values = Array.from(new Set(cluster.map(f => f.get(config.attribute))));

      const colors = values
        .map(val => filters.find(filter => filter.match(val)))
        .filter(match => match)
        .map(match => match.color)
      return baseStyle(colors, true, cluster.length.toString());
    }
    if (cluster) {
      f = cluster[0];
    }
    const val = f.get(config.attribute);
    const match = filters.find(filter => filter.match(val));
    if (!match) {
      console.warn('Out of range:', val);
      return null;
    }
    return typeof match.style === 'function' ? match.style(f, res) : match.style;
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

const badge = `
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
    <circle cx="6" cy="6" r="7" style="fill:rgba(220,0,46, 0.8)" />
  </svg>`;

function createBadgeStyle(baseWidth, baseHeight) {
  const offset = [baseWidth / 2 - 6, baseHeight - 3]
  return new Style({
    image: new Icon({
      anchor: [6 - offset[0], 6 + offset[1]],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      size: [12, 12],
      src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(badge),
      imgSize: [12, 12]
    }),
    text: new Text({
      font: 'bold 9px Calibri,sans-serif',
      offsetX: offset[0],
      offsetY: -offset[1],
      fill: new Fill({
        color: '#fff'
      })
    })
  });
}

function svgColoredIcon(colors, icon, size=32) {
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
  const pxSize = size + 'px';
  return ReactDOMServer.renderToString(
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0" y="0" width={pxSize} height={pxSize} viewBox="0 0 48 48">
      <defs>
        <pattern id="stripes" width="48" height="48" patternUnits="userSpaceOnUse">
          {stripes}
        </pattern>
      </defs>
      <g dangerouslySetInnerHTML={{__html: svgContent(iconEl)}} fill="url(#stripes)"></g>
    </svg>
  );
}

const badgeStyle = createBadgeStyle(32, 32);

export function coloredPointIcon(config) {
  const pointsIconsCache = {};
  return (colors = ['orange', 'green', 'red'], isGroup, text) => {
    const key = JSON.stringify(colors);
    let iconStyle = pointsIconsCache[key];
    if (!iconStyle) {
      const svg = svgColoredIcon(colors, config.icon);
      iconStyle = new Icon({
        src: 'data:image/svg+xml,' + escape(svg),
        anchor: config.anchor || [0.5, 1]
        // anchor: [0.5, 0]
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

/*
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
*/
