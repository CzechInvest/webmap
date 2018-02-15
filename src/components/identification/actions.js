export const SHOW_OBJECT_INFO = 'SHOW_OBJECT_INFO';

export const showObjectInfo = (featureId, layerId, identifyPoint) => ({
  type: SHOW_OBJECT_INFO,
  payload: {
    featureId,
    layerId,
    identifyPoint
  }
});
