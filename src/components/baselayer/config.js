import { TileJSON } from 'ol/source';
import { Tile } from 'ol/layer';
import { OSM, TileWMS } from 'ol/source';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import Collection from 'ol/Collection';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import Geobuf from '../map/formats';
import {Stroke, Style, Fill, Text} from 'ol/style.js';
import "isomorphic-fetch";

const dataUrl = (path) => {
  return process.env.DATA_URL + path
}

export const baseLayerType = {
  ORTO: 'orto',
  POSITRON: 'positron'
}

export const setLayers = (type, layer, datasets, map) => {
  switch (type) {
    case baseLayerType.ORTO:
      setOrtofoto(layer, datasets, map);
      break;
    default:
      setPositron(layer);
  }
  console.log(map.getLayers().getArray());
}

const getWMSborders = () => {
  const layers = [
    // 'AU.3rdOrder.Okres.AdministrativeBoundary',
    // 'AU.3rdOrder.Okres.AdministrativeUnitLabel',
    //'UX.ORP.UnitLabel',
    'UX.ORP.Boundary',
    'AU.2ndOrder.Kraj.AdministrativeBoundary',
    //'AU.2ndOrder.Kraj.AdministrativeUnitLabel'
  ];
  return new Tile({
    source: new TileWMS({
        url: 'https://services.cuzk.cz/wms/local-UX-wms.asp?service=WMS',
        attributions: '<a href="http://www.cuzk.cz" target="blank"> Czech Office for Surveying, Mapping and Cadastre</a>',
        params: {
          'LAYERS': layers.join(','),
          'TILED': true,
          'TRANSPARENT': true,
        },
    })
  });
}

const styleFunction = color => (feature, resolution) => {
 return new Style({
   stroke: new Stroke({ width: 2, color }),
   text: new Text({
     //textAlign: 'center',
     //textBaseline: 'baseline',
     font: 'bold 14px sans-serif',
     text: feature.get('Nazev'),
     fill: new Fill({color: 'whitesmoke'}),
     stroke: new Stroke({color: '#444444', width: 4}),
     //offsetX: offsetX,
     //offsetY: offsetY,
     //placement: placement,
     //maxAngle: maxAngle,
     //overflow: overflow,
     //rotation: rotation
    })
  })
};

const createVectorLayer = (map, dataset, minZ, maxZ, color) => {

  const source = new VectorSource({
    url: dataUrl(dataset.src.geometry),
    format: dataset.src.geometry.indexOf('.pbf') !== -1 ? Geobuf() : new GeoJSON(),
  });
  return new VectorLayer({
    source,
    style: styleFunction(color),
    minResolution: map.getView().getResolutionForZoom(maxZ),
    maxResolution: map.getView().getResolutionForZoom(minZ)
  });
}

export const setOrtofoto = (layerGroup, datasets, map) => {

  const parser = new WMTSCapabilities();
  const wmtsLayer = new Tile({});

  layerGroup.setLayers(new Collection([
    wmtsLayer,
    createVectorLayer(map, datasets.get('kraje'), 7, 8, 'indianred'),
    createVectorLayer(map, datasets.get('okresy'), 8, 10, 'skyblue'),
    createVectorLayer(map, datasets.get('orp'), 10, 21, 'whitesmoke'),
  ]));

  fetch('https://geoportal.cuzk.cz/WMTS_ORTOFOTO/WMTService.aspx?service=WMTS&request=GetCapabilities')
  .then( res => res.text())
  .then(text => {
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
      layer: 'orto',
      matrixSet: 'wgs84:pseudomercator:epsg:3857'
    });
    options.urls = options.urls.map(url => url.replace('http://', 'https://'));
    options.crossOrigin = "Anonymous";
    wmtsLayer.setSource(new WMTS(options));
  });
}

export const setPositron = layerGroup => {
  const source = new TileJSON({
    url: 'https://maps.tilehosting.com/styles/positron.json?key=mCnC0rArFsfnBvLPiB6J',
    attributions: OSM.ATTRIBUTION,
    crossOrigin: 'anonymous'
  });

  layerGroup.setLayers(new Collection([new Tile({ source })]));
}
