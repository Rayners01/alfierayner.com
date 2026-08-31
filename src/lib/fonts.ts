import { Lora, Montserrat, Press_Start_2P } from "next/font/google";

/** Body text. */
export const montserrat = Montserrat({ subsets: ["latin"] });

/** Serif accent — the desk clock and photo captions. */
export const lora = Lora({ subsets: ["latin"] });

/** Pixel face for the Kilimanjaro scene. */
export const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });
