/*
  Copyright (c) 2015 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (http://www.cecill.info/).
  
  ol.layer.AnimatedCluster is a vector layer tha animate cluster 
  
  olx.layer.AnimatedClusterOptions: extend olx.layer.Options
  { animationDuration {Number} animation duration in ms, default is 700ms 
    animationMethod {function} easing method to use, default ol.easing.easeOut
  }
*/

/**
* @constructor AnimatedCluster
* @extends {ol.layer.Vector}
* @param {olx.layer.AnimatedClusterOptions=} options
* @todo 
*/

import ol from 'ol';
import Easing from 'ol/easing';
import Extent from 'ol/extent';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Point from 'ol/geom/point';
import Map from 'ol/map';


export default function AnimatedCluster(opt_options) {
  const options = opt_options || {};
  VectorLayer.call (this, options);

  this.oldcluster = new VectorSource();
  this.clusters = [];
  this.animation = {start:false};
  this.set('animationDuration', typeof(options.animationDuration) === 'number' ? options.animationDuration : 700);
  this.set('animationMethod', options.animationMethod || Easing.easeOut);

  // Save cluster before change
  this.getSource().on('change', this.saveCluster, this);
  // Animate the cluster
  this.on('precompose', this.animate, this);
  this.on('postcompose', this.postanimate, this);
};
ol.inherits (AnimatedCluster, VectorLayer);

/** @private save cluster features before change
*/
AnimatedCluster.prototype.saveCluster = function() {
  this.oldcluster.clear();
  if (!this.get('animationDuration')) return;
  const features = this.getSource().getFeatures();
  if (features.length && features[0].get('features')) {
    this.oldcluster.addFeatures (this.clusters);
    this.clusters = features.slice(0);
    this.sourceChanged = true;
  }
};

/** @private Get the cluster that contains a feature
*/
AnimatedCluster.prototype.getClusterForFeature = function(f, cluster) {
  return cluster.find(cl => cl.get('features').indexOf(f) !== -1);
  // for (let j = 0; cluster[j]; j++) {
  //   const features = cluster[j].get('features');
  //   if (features && features.length) {
  //     for (let k = 0, f2; f2 = features[k]; k++) {
  //       if (f === f2) {
  //         return cluster[j];
  //       }
  //     }
  //   }
  // }
  // return false;
};

/** @private 
*/
AnimatedCluster.prototype.stopAnimation = function() {
  this.animation.start = false;
  this.animation.cA = [];
  this.animation.cB = [];
};

/** @private animate the cluster
*/
AnimatedCluster.prototype.animate = function(e) {
  const duration = this.get('animationDuration');
  if (!duration) return;
  const resolution = e.frameState.viewState.resolution;
  const a = this.animation;
  let time = e.frameState.time;

  // Start a new animation, if change resolution and source has changed
  if (a.resolution !== resolution && this.sourceChanged) {
    const extent = Extent.buffer(e.frameState.extent, 100*resolution);
    if (a.resolution < resolution) {
      a.cA = this.oldcluster.getFeaturesInExtent(extent);
      a.cB = this.getSource().getFeaturesInExtent(extent);
      a.revers = false;
    } else {
      a.cA = this.getSource().getFeaturesInExtent(extent);
      a.cB = this.oldcluster.getFeaturesInExtent(extent);
      a.revers = true;
    }
    a.clusters = [];
    
    a.cA.forEach(c0 => {
      const f = c0.get('features');
      if (f && f.length) {
        const c = this.getClusterForFeature(f[0], a.cB);
        if (c) {
          a.clusters.push({ f:c0, pt:c.getGeometry().getCoordinates() });
        }
      }
    });

    // Save state
    a.resolution = resolution;
    this.sourceChanged = false;

    // No cluster or too much to animate
    if (!a.clusters.length || a.clusters.length > 1000) {
      this.stopAnimation();
      return;
    }
    // Start animation from now
    time = a.start = (new Date()).getTime();
  }

  // Run animation
  if (a.start) {
    const vectorContext = e.vectorContext;
    let d = (time - a.start) / duration;
    // Animation ends
    if (d > 1.0) {
      this.stopAnimation();
      d = 1;
    }
    d = this.get('animationMethod')(d);
    // Animate
    const style = this.getStyle();
    const stylefn = (typeof(style) === 'function') ? style : style.length ? () => style : () => [style];
    // Layer opacity
    e.context.save();
    e.context.globalAlpha = this.getOpacity();
    // Retina device
    const ratio = e.frameState.pixelRatio;
    a.clusters.forEach(c => {
      const pt = c.f.getGeometry().getCoordinates();
      if (a.revers) {
        pt[0] = c.pt[0] + d * (pt[0]-c.pt[0]);
        pt[1] = c.pt[1] + d * (pt[1]-c.pt[1]);
      } else {
        pt[0] = pt[0] + d * (c.pt[0]-pt[0]);
        pt[1] = pt[1] + d * (c.pt[1]-pt[1]);
      }
      // Draw feature
      const st = stylefn(c.f, resolution);
      /* Preserve pixel ration on retina */
      const geo = new Point(pt);
      st.forEach(s => {
        let sc;
        // OL < v4.3 : setImageStyle doesn't check retina
        const imgs = Map.prototype.getFeaturesAtPixel ? false : s.getImage();
        if (imgs) {
          sc = imgs.getScale(); 
          imgs.setScale(sc*ratio); 
        }
        // OL3 > v3.14
        if (vectorContext.setStyle) {
          if (s.getImage() && s.getImage().getAnchor()) {
            vectorContext.setStyle(s);
            vectorContext.drawGeometry(geo);
          }
        }
        // older version
        else {
          vectorContext.setImageStyle(imgs);
          vectorContext.setTextStyle(s.getText());
          vectorContext.drawPointGeometry(geo);
        }
        if (imgs) imgs.setScale(sc);
      });
      /*/
      const f = new ol.Feature(new ol.geom.Point(pt));
      for (let k = 0; s = st[k]; k++) {
        const imgs = s.getImage();
        const sc = imgs.getScale(); 
        imgs.setScale(sc*ratio); // drawFeature don't check retina
        vectorContext.drawFeature(f, s);
        imgs.setScale(sc);
      }
      /**/
    });
    e.context.restore();
    // tell OL3 to continue postcompose animation
    e.frameState.animate = true;

    // Prevent layer drawing (clip with null rect)
    e.context.save();
    e.context.beginPath();
    e.context.rect(0,0,0,0);
    e.context.clip();
    this.clip_ = true;
  }

  return;
};

/** @private remove clipping after the layer is drawn
*/
AnimatedCluster.prototype.postanimate = function(e) {
  if (this.clip_) {
    e.context.restore();
    this.clip_ = false;
  }
};
