/** A point on the climbing route, in percentages of the scene's dimensions. */
export type Waypoint = {
  atStep: number;
  x: number;
  y: number;
};

export const kilimanjaro = {
  /** Total donation target, in pounds. One step == £1. */
  totalSteps: 1500,
  /** Height of Uhuru Peak, in metres. */
  summitHeight: 5895,
  /** Steps travelled per animation frame while the hiker catches up. */
  climbSpeed: 10,
  timeZone: "Africa/Dar_es_Salaam",
  donateUrl: "https://givestar.io/gs/alfie-rayner",
  conversionNote: "Every £1 Raised = ~4m climbed",
  credit: "Live data from Givestar | Artwork © 2025 Alfie Rayner",
} as const;

/**
 * The route up the mountain. The hiker is linearly interpolated between
 * consecutive waypoints based on how much money has been raised.
 */
export const PATH_WAYPOINTS: Waypoint[] = [
  { atStep: 0, x: 19, y: 99 },
  { atStep: 50, x: 16.52, y: 95 },
  { atStep: 100, x: 11.01, y: 93 },
  { atStep: 150, x: 8.37, y: 89 },
  { atStep: 200, x: 11.01, y: 86 },
  { atStep: 250, x: 8.5, y: 79 },
  { atStep: 300, x: 8.6, y: 74 },
  { atStep: 350, x: 15.42, y: 71 },
  { atStep: 400, x: 20.93, y: 69.45 },
  { atStep: 450, x: 19.27, y: 63.42 },
  { atStep: 500, x: 18.72, y: 58.95 },
  { atStep: 550, x: 21.59, y: 56.03 },
  { atStep: 600, x: 24.34, y: 53.11 },
  { atStep: 650, x: 26.65, y: 51.17 },
  { atStep: 700, x: 28.52, y: 49.61 },
  { atStep: 750, x: 31.61, y: 46.31 },
  { atStep: 800, x: 33.81, y: 45.14 },
  { atStep: 850, x: 37, y: 43.39 },
  { atStep: 900, x: 39.54, y: 41.83 },
  { atStep: 950, x: 42.62, y: 39.89 },
  { atStep: 1000, x: 45.26, y: 38.14 },
  { atStep: 1050, x: 47.14, y: 36.58 },
  { atStep: 1100, x: 50, y: 35.42 },
  { atStep: 1150, x: 53.19, y: 35.03 },
  { atStep: 1200, x: 55.84, y: 34.25 },
  { atStep: 1250, x: 58.37, y: 32.3 },
  { atStep: 1300, x: 57.38, y: 28.42 },
  { atStep: 1350, x: 55.18, y: 27.44 },
  { atStep: 1400, x: 52.97, y: 25.89 },
  { atStep: 1450, x: 51.65, y: 24.14 },
  { atStep: 1500, x: 51.87, y: 23.55 },
];
