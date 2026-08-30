import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

/** Written by `scripts/fetch-donation.js`, which runs on a cron on the VPS. */
const SNAPSHOT_PATH = path.join(process.cwd(), "data", "donation-total.json");

export type DonationTotal = {
  total: number;
  updated: string | null;
};

// The snapshot is rewritten out of band, so it must be read per request rather
// than baked in at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = JSON.parse(await fs.readFile(SNAPSHOT_PATH, "utf-8"));

    return NextResponse.json<DonationTotal>({
      total: Number(snapshot.total) || 0,
      updated: snapshot.updated ?? null,
    });
  } catch (error) {
    console.error("[donations] could not read snapshot:", error);
    return NextResponse.json(
      { error: "Could not read donation total" },
      { status: 500 },
    );
  }
}
