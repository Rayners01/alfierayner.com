import { Lora, Montserrat, Press_Start_2P } from "next/font/google";

/**
 * Every font the site loads, in one place.
 *
 * next/font must be called at module scope, so declaring these together keeps
 * the set visible and stops the same face being configured two different ways
 * in two different components.
 */

/** Body text. */
export const montserrat = Montserrat({ subsets: ["latin"] });

/** Serif accent — the desk clock and photo captions. */
export const lora = Lora({ subsets: ["latin"] });

/** Pixel face for the Kilimanjaro scene. */
export const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });
