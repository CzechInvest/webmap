import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Cluster } from 'ol/source';
import AnimatedCluster from './AnimatedClusterLayer';
import { createPointStyle } from './styles';


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
    // Object.keys(map).map(k => map[k])
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

  const colorify = feature => {
    const group = feature.get('features') || [feature];
    const colors = activeFilters.reduce((values, filter) => {
      for (let i = 0; i < group.length; i++) {
        const color = filter.filter(group[i]);
        if (color) {
          values.push(color);
          break;
        }
      }
      return values;
    }, []);
    return colors;
  }

  // const olLayer = new VectorLayer(
  const olLayer = new AnimatedCluster(
    Object.assign(config, {
      source: FilteredClusterSource(config.source),
      visible: false,
      style: createPointStyle(config.style, colorify)
    })
  );
  /*
  olLayer.getStyleFunction().highlight = color => (feature, res) => {
    if (res < 80 && config.label) {
      const label = feature.get(config.label);
      return styleFn([color], false, label);
    }
    return styleFn([color]);
  };
  */
  Object.assign(olLayer, {
    isActive(id) {
      return activeFiltersList.has(id);
    },
    setActive(id, active) {
      if (active === this.isActive(id)) {
        return;
      }
      if (active) {
        activeFiltersList.add(id);
      } else {
        activeFiltersList.delete(id);
      }
      activeFilters = filters.filter(f => activeFiltersList.has(f.id));
      olLayer.getSource().setActiveFilters(activeFilters);
      olLayer.setVisible(activeFilters.length > 0);
    },
    addFilter(filter) {
      filters.push(filter);
    },
    featureFilters(feature) {
      return activeFilters.filter(filter => filter.filter(feature)).map(filter => filter.id);
    }
  });
  return olLayer;
}


function FilteredSource(rootSource) {
  const filteredSource = new VectorSource({
    // loader: function(extent, resolution, projection) {
    //   rootSource.loadFeatures(extent, resolution, projection);
    // }
  });

  let filters = [];
  let filteringScheduled;
  filteredSource.setActiveFilters = activeFilters => {
    filters = activeFilters;
    if (!filteringScheduled) {
      filteringScheduled = setTimeout(filterActiveFeatures);
    }
  };

  function filterActiveFeatures() {
    filteredSource.clear();
    filteredSource.addFeatures(
      rootSource.getFeatures().filter(f => filters.find(filter => filter.filter(f)))
    );
    console.log(`## Active Features: ${filteredSource.getFeatures().length} / ${rootSource.getFeatures().length}`);
    filteringScheduled = null;
  }

  // rootSource.once('change', () => {
  //   console.log('DATA LOADED');
  //   filterActiveFeatures();
  // });

  filteredSource._loadFeatures = filteredSource.loadFeatures;
  filteredSource.loadFeatures = (extent, resolution, projection) => {
    if (rootSource.getFeatures().length) {
      filteredSource._loadFeatures(extent, resolution, projection);
    } else {
      rootSource.loadFeatures(extent, resolution, projection);
      rootSource.once('change', filterActiveFeatures);
    }
  }

  return filteredSource;
}

export function FilteredPolygonLayer(config) {
  let filters = [];
  let activeFilters = [];
  const activeFiltersList = new Set();

  const olLayer = new VectorLayer(
    Object.assign(config, {
      visible: false,
      source: FilteredSource(config.source),
      style: f => {
        const colors = activeFilters.reduce((values, filter) => {
          const color = filter.filter(f);
          if (color) {
            values.push(color);
          }
          return values;
        }, []);
        return config.styleFn(colors);
      }
    })
  );
  olLayer.getStyleFunction().highlight = color => (feature) => {
    return config.styleFn([color]);
  };

  Object.assign(olLayer, {
    isActive(id) {
      return activeFiltersList.has(id);
    },
    setActive(id, active) {
      if (active === this.isActive(id)) {
        return;
      }
      if (active) {
        activeFiltersList.add(id);
      } else {
        activeFiltersList.delete(id);
      }
      activeFilters = filters.filter(f => activeFiltersList.has(f.id));
      olLayer.getSource().setActiveFilters(activeFilters);
      olLayer.setVisible(activeFilters.length > 0);
    },
    addFilter(filter) {
      filters.push(filter);
    },
    featureFilters(feature) {
      return activeFilters.filter(filter => filter.filter(feature)).map(filter => filter.id);
    }
  });
  return olLayer;
}
