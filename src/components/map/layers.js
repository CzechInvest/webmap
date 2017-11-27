import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Cluster from 'ol/source/cluster';
import { generateColoredDonutStyle } from './styles';


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
export default function FilteredPointLayer(config) {
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
          if (res < 200 && config.label) {
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
