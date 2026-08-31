/**
 * Geometry shared by the camera and the developing view.
 */

export const FILM_SCALE = 4;

const MAX_WIDTH = 640;
const WIDTH_FRACTION = 0.92;
const HEIGHT_FRACTION = 0.9;

export type FrameSize = { width: number; height: number };

export function frameSize({ width, height }: FrameSize): FrameSize {
  return {
    width: Math.min(MAX_WIDTH, width * WIDTH_FRACTION),
    height: height * HEIGHT_FRACTION,
  };
}

/**
 * The white border around the photo, as fractions of the frame's width.
 */
const PADDING_RATIO = { top: 0.05, side: 0.05, bottom: 0.15 };

export function framePadding(width: number) {
  return {
    top: width * PADDING_RATIO.top,
    side: width * PADDING_RATIO.side,
    bottom: width * PADDING_RATIO.bottom,
  };
}
