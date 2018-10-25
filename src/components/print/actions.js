export const ACTIVATE_PRINT = 'ACTIVATE_PRINT';


export const activatePrint = active => ({
  type: ACTIVATE_PRINT,
  payload: {
    active
  }
});
