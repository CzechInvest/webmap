import { TileJSON } from 'ol/source';
import { Tile } from 'ol/layer';
import { OSM, TileWMS } from 'ol/source';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import Collection from 'ol/Collection';

export const baseLayerType = {
  ORTO: 'orto',
  POSITRON: 'positron'
}

export const setLayers = (type, layer) => {
  switch (type) {
    case baseLayerType.ORTO:
      setOrtofoto(layer);
      break;
    default:
      setPositron(layer);
  }
}

export const setOrtofoto = layerGroup => {
  const parser = new WMTSCapabilities();

  const layers = [
    // 'AU.3rdOrder.Okres.AdministrativeBoundary',
    // 'AU.3rdOrder.Okres.AdministrativeUnitLabel',
    //'UX.ORP.UnitLabel',
    'UX.ORP.Boundary',
    'AU.2ndOrder.Kraj.AdministrativeBoundary',
    //'AU.2ndOrder.Kraj.AdministrativeUnitLabel'
  ];
  const borders = new Tile({
    source: new TileWMS({
        url: 'http://services.cuzk.cz/wms/local-UX-wms.asp?service=WMS',
        attributions: '<a href="http://www.cuzk.cz" target="blank"> Czech Office for Surveying, Mapping and Cadastre</a>',
        params: {
          'LAYERS': layers.join(','),
          'TILED': true,
          'TRANSPARENT': true,
        },
    })
  });
  const wmtsLayer = new Tile({});

  layerGroup.setLayers(new Collection([wmtsLayer, borders]));

  fetch('https://geoportal.cuzk.cz/WMTS_ORTOFOTO/WMTService.aspx?service=WMTS&request=GetCapabilities')
  .then( res => res.text())
  .then(text => {
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
      layer: 'orto',
      matrixSet: 'wgs84:pseudomercator:epsg:3857'
    });
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
