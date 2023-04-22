/**
 * Get the current uikit version number.
 * @returns The version.
 */
export function getUikitVersion(): string | undefined {
  try {
    const v = require('../version').VERSION;
    return v;
  } catch (error) {
    console.warn('test:version:', error);
    return undefined;
  }
}
