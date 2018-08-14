import { GeoJSON } from 'ol/format';
import geobuf from 'geobuf';
import Pbf from 'pbf';


/**
 * ol source for reading GeoJSON files converted to Geobuf binanry format.
 */
export default function Geobuf() {
  const format = new GeoJSON();

  return Object.assign(format, {
    getType() {
      return 'arraybuffer';
    },
    _readFeatures: format.readFeatures,
    readFeatures(source, params) {
      const geojson = geobuf.decode(new Pbf(source));
      return format._readFeatures(geojson, params);
    }
  });
}
