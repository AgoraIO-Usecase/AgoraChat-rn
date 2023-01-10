export const getUIKitVersion = () => {
  try {
    const v = require('../version').VERSION;
    return v;
  } catch (error) {
    console.warn('test:version:', error);
    return undefined;
  }
};
