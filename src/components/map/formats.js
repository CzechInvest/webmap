import { GeoJSON } from 'ol/format';
import geobuf from 'geobuf';
import Pbf from 'pbf';


/**
 * ol source for reading GeoJSON files converted to Geobuf binanry format.
 */
export default function Geobuf(options) {
  const format = new GeoJSON(options);

  return Object.assign(format, {
    getType() {
      return 'arraybuffer';
    },
    _readFeatures: format.readFeatures,
    readFeatures(source, params) {
      const geojson = geobuf.decode(new Pbf(source));
      console.log({geojson, source})
      return format._readFeatures(geojson, params);
    }
  });
}
