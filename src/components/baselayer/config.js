import { TileJSON } from 'ol/source';
import { OSM } from 'ol/source';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';

export const setOrtofoto = (layer) => {
  const parser = new WMTSCapabilities();
  fetch('http://geoportal.cuzk.cz/WMTS_ORTOFOTO/WMTService.aspx?service=WMTS&request=GetCapabilities')
  .then( res => res.text())
  .then(text => {
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
      layer: 'orto',
      matrixSet: 'wgs84:pseudomercator:epsg:3857'
    });
    const source = new WMTS(options);
    layer.setSource(source);

  });
}

export const setPositron = (layer) => {
  const source = new TileJSON({
    url: 'https://maps.tilehosting.com/styles/positron.json?key=mCnC0rArFsfnBvLPiB6J',
    attributions: OSM.ATTRIBUTION,
    crossOrigin: 'anonymous'
  });
  layer.setSource(source);
}
