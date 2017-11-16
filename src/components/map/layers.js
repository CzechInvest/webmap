import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Cluster from 'ol/source/cluster';


function FilteredClusterSource(rootSource) {
  const clusterSource = new Cluster({
    source: new VectorSource(),
    distance: 30
  });
  let filters = [];
  clusterSource.setActiveFilters = activeFilters => {
    filters = activeFilters;
    filterActiveFeatures();
  };

  function filterActiveFeatures() {
    clusterSource.getSource().clear();
    clusterSource.getSource().addFeatures(
      rootSource.getFeatures().filter( f => {
        return filters.find(filter => {
          return filter.filter(f);
        })
      })
    );
    console.log(`## Active Features: ${clusterSource.getSource().getFeatures().length} / ${rootSource.getFeatures().length}`);
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
  let activeFiltersList = new Set();

  const olLayer = new VectorLayer(
    Object.assign(config, {
      source: FilteredClusterSource(config.source),
      visible: false,
      style(f, res) {
        const f1 = f.get('features')[0];
        const filter = activeFilters.find(filter => {
          return filter.filter(f1);
        });
        if (filter) {
          return Array.isArray(filter.style) ? filter.style : filter.style(f, res);
        }
      }
    })
  );

  Object.assign(olLayer, {
    setActive(fname, active) {
      if (active) {
        activeFiltersList.add(fname);
      } else {
        activeFiltersList.delete(fname);
      }
      activeFilters = filters.filter(f => {
        return activeFiltersList.has(f.name);
      });
      olLayer.getSource().setActiveFilters(activeFilters);
      olLayer.setVisible(activeFilters.length > 0);
    },
    addFilter(filter) {
      filters.push(filter);
    }
  });
  return olLayer;
}