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

export const FRAME_PADDING = { top: 32, side: 32, bottom: 96 };
