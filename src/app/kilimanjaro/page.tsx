import type { Metadata } from "next";
import { MountainScene } from "@/features/kilimanjaro/mountain-scene";

export const metadata: Metadata = {
  title: "Kilimanjaro | Alfie Rayner",
  description:
    "Tracking my Kilimanjaro fundraiser — the hiker climbs as donations come in.",
};

export default function KilimanjaroPage() {
  return <MountainScene />;
}
