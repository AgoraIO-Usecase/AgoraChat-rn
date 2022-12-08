const DEFAULT_LANDSCAPE_HEIGHT = 48;
const DEFAULT_HEIGHT = 56;

export default function defaultHeaderHeight(isLandscape: boolean) {
  if (isLandscape) return DEFAULT_LANDSCAPE_HEIGHT;
  return DEFAULT_HEIGHT;
}
