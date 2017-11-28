import app from './createApp';
import { setZoom, setCenter } from './components/view/actions';
import { setBaselayerStyle, setBaselayerVisibility, setBaselayerOpacity } from './components/baselayer/actions';
import Proj from 'ol/proj'

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
    return Proj.transform([x, y], projCodeSource, projCode.toUpperCase());
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
   * @param {string} style Possible values 'bright-v9', 'dark-v9', 'bright-v9', 'light-v9', 'streets-v9', 'satellite-v9'
   * @api
  */
  setBaselayerStyle(style = 'dark-v9') {
    this._app.dispatch(setBaselayerStyle(style));
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


}

window.ci = { Map: Cimap };
