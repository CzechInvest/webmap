import app from './createApp';
import { setZoom, setCenter } from './components/view/actions';
import { setBaselayer, setBaselayerVisibility, setBaselayerOpacity } from './components/baselayer/actions';
import { setLanguage } from './components/lang/actions';
import { openCategory, closeCategory } from './components/categories/actions';
import { setLayerVisibility } from './components/layers/actions';
import { transform } from 'ol/proj'

export default class Cimap {
 /**
   * @classdesc
   * The map is the core component of CzechInvest web map.
   * @constructor
   * @param {string} target element query selector ( default #cimap).
   * @param {object} options map options.
   * @api
 */
  constructor(target, options) {
    this._app = new app(target, options);
  }


  /**
   * Set the center of the current map view.
   * @param {number} x The x coorinate (longitude) of the view.
   * @param {number} y The y coorinate (latitude) of the view.
   * @param {string} projCode Optional. The projection code of coordinates.
   * @api
   */
  setCenter(x, y, projCode = 'EPSG:4326') {
    this._app.dispatch(setCenter(x , y, projCode));
  };


  /**
   * Get the view center.
   * @param {string} projCode Optional. The output projection code. Default EPSG:4326.
   * @return {Array<number, number>} The center of the view.
   * @api
  */
  getCenter(projCode = 'EPSG:4326') {
    const x = this._app.getIn('view', ['x']);
    const y = this._app.getIn('view', ['y']);
    const projCodeSource = this._app.getIn('view', ['projCode']);
    return transform([x, y], projCodeSource, projCode.toUpperCase());
  };


  /**
   * Set zoom of the current map view.
   * @param {number} z The zoom level.
   * @api
   */
  setZoom(zoom) {
    this._app.dispatch(setZoom(zoom));
  };


  /**
   * Set zoom of the current map view.
   * @return {number} The current zoom level.
   * @api
  */
  getZoom() {
    return this._app.getIn('view', ['z']);
  };


  /**
   * Set style of baselayer.
   * @param {Baselayer.layerType} type Values: 'ortofoto', 'positron'
   * @api
  */
  setBaselayer(type) {
    this._app.dispatch(setBaselayer(type));
  }


  /**
   * Set visibility of baselayer.
   * @param {bool} visible Visibility of base layer.
   * @api
  */
  setBaselayerVisibility(visible) {
    this._app.dispatch(setBaselayerVisibility(visible));
  }


  /**
   * Set opacity of baselayer.
   * @param {number} opacity Opacity of base layer (range: 0 - 1).
   * @api
  */
  setBaselayerOpacity(opacity) {
    this._app.dispatch(setBaselayerOpacity(opacity));
  }

  /**
   * Get list of category IDs.
   * @api
  */
  getCategoryList() {
    return this._app.getIn('categories', ['categories']).keySeq().toArray();
  }


  /**
   * Open category popup.
   * @param {Cimap.Lang} categoryID ID of category.
   * @api
  */
  openCategory(categoryID) {
    this._app.dispatch(openCategory(categoryID, 10, 10));
  }


  /**
   * Close category popup.
   * @api
  */
  closeCategory(categoryID) {
    this._app.dispatch(closeCategory());
  }


  /**
   * Set visibility of layer.
   * @param {string} layerID Identificator of category.
   * @param {bool} visible Should be layer visible or hided.
   * @api
  */
  setLayerVisibility(layerID, visible) {
    this._app.dispatch(setLayerVisibility(layerID, visible));
  }


  /**
   * Get list of layer IDs.
   * @api
  */
  getLayerList(layerID, visible) {
    return this._app.getIn('layers', ['layers']).keySeq().toArray();
  }


  /**
   * Set language
   * @param {Cimap.Lang} lang Language in ISO 639-1 Code.
   * @api
  */
  setLanguage(lang = Cimap.Lang.CS) {
    this._app.dispatch(setLanguage(lang));
  }
}


/**
 * Languages (ISO 639-1).
 * @readonly
 * @enum {string}
*/
Cimap.Lang = {
  CS: 'cs',
  EN: 'en',
  SK: 'sk'
}


window.ci = {
  Map: Cimap,
}
