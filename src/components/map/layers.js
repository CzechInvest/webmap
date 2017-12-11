import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Cluster from 'ol/source/cluster';
import { generateColoredDonutStyle } from './styles';


export function DistinctPointsSource(source, r=10) {

  function checkFeatures() {
    // group points with the same position
    const map = {};
    source.forEachFeature(f => {
      const key = f.getGeometry().flatCoordinates.toString();
      if (!map[key]) {
        map[key] = [f];
      } else {
        map[key].push(f);
      }
    });

    // apply offset to the points on the same position
    Object.values(map).filter(g => g.length > 1).forEach(group => {
      const center = group[0].getGeometry().getCoordinates();
      const angle = 360 / group.length;
      group.forEach((f, i) => {
        const x = center[0] + r * Math.sin((25 + angle * i) * (Math.PI / 180));
        const y = center[1] + r * Math.cos((25 + angle * i) * (Math.PI / 180));
        f.getGeometry().setCoordinates([x, y]);
      });
    });

    // const duplicit = Object.values(map).filter(g => g.length > 1).reduce((list, g) => list.concat(g), []);
    // console.log('All:', source.getFeatures().length, 'Duplicit:', duplicit.length);
  }
  source.once('change', checkFeatures);
  return source;
}

function FilteredClusterSource(rootSource) {
  const clusterSource = new Cluster({
    source: new VectorSource(),
    distance: 30
  });
  let filters = [];
  let filteringScheduled;
  clusterSource.setActiveFilters = activeFilters => {
    filters = activeFilters;
    if (!filteringScheduled) {
      filteringScheduled = setTimeout(filterActiveFeatures);
    }
  };

  function filterActiveFeatures() {
    // For Debugging
    // const unique = rootSource.getFeatures().reduce((set, f) => {
    //   f.get('sectors').forEach(set.add.bind(set));
    //   return set;
    // }, new Set());
    // console.log(Array.from(unique));
    // console.log(rootSource.getFeatures().map((f) => {return f.get('sectors')}));

    clusterSource.getSource().clear();
    clusterSource.getSource().addFeatures(
      rootSource.getFeatures().filter(f => filters.find(filter => filter.filter(f)))
    );
    console.log(`## Active Features: ${clusterSource.getSource().getFeatures().length} / ${rootSource.getFeatures().length}`);
    filteringScheduled = null;
  }

  clusterSource._loadFeatures = clusterSource.loadFeatures;
  clusterSource.loadFeatures = (extent, resolution, projection) => {
    if (rootSource.getFeatures().length) {
      clusterSource._loadFeatures(extent, resolution, projection);
    } else {
      rootSource.loadFeatures(extent, resolution, projection);
      rootSource.once('change', filterActiveFeatures);
    }
  }
  return clusterSource;
}

/**
 * ol vector point layer with possibility to define multiple filters,
 * which can be later enabled or disabled. All filtered objects are
 * then grouped with cluster.
 */
export function FilteredPointLayer(config) {
  let filters = [];
  let activeFilters = [];
  const activeFiltersList = new Set();

  const olLayer = new VectorLayer(
    Object.assign(config, {
      source: FilteredClusterSource(config.source),
      visible: false,
      style: (feature, res) => {
        const group = feature.get('features');
        const colors = [];
        activeFilters.forEach(filter => {
          if (group.find(f => filter.filter(f))) {
            colors.push(filter.color);
          }
        });
        if (group.length > 1) {
          return generateColoredDonutStyle(colors, true, group.length.toString());
        } else {
          if (res < 80 && config.label) {
            const label = group[0].get(config.label);
            return generateColoredDonutStyle(colors, false, label);
          }
          return generateColoredDonutStyle(colors);
        }
      }
    })
  );

  Object.assign(olLayer, {
    isActive(fname) {
      return activeFiltersList.has(fname);
    },
    setActive(fname, active) {
      if (active === this.isActive(fname)) {
        return;
      }
      if (active) {
        activeFiltersList.add(fname);
      } else {
        activeFiltersList.delete(fname);
      }
      activeFilters = filters.filter(f => activeFiltersList.has(f.name));
      olLayer.getSource().setActiveFilters(activeFilters);
      olLayer.setVisible(activeFilters.length > 0);
    },
    addFilter(filter) {
      filters.push(filter);
    }
  });
  return olLayer;
}
