"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { travel, visitedCountryCodes } from "@/content/travel";
import { useTheme } from "@/features/theme/theme-provider";
import { palettes } from "@/lib/palette";

// react-globe.gl touches `window` on import, so it can only load in the browser.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type CountryFeature = {
  type: "Feature";
  properties: { name: string; code: string };
  geometry: GeoJSON.Geometry;
};

type CountriesGeoJson = {
  type: "FeatureCollection";
  features: CountryFeature[];
};

const COUNTRIES_URL = "/data/countries-110m.geojson";

const ALTITUDE = 0.01;
const HOVER_ALTITUDE = 0.06;

export function GlobeView({ onBack }: { onBack: () => void }) {
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [hovered, setHovered] = useState<object | null>(null);

  // WebGL cannot read the CSS variables, so the globe resolves the active
  // theme's colours itself.
  const { theme } = useTheme();
  const palette = palettes[theme];

  useEffect(() => {
    const controller = new AbortController();

    fetch(COUNTRIES_URL, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: CountriesGeoJson) => setCountries(data.features))
      .catch((error) => {
        if (error?.name !== "AbortError") console.error(error);
      });

    return () => controller.abort();
  }, []);

  const globeMaterial = useMemo(
    () => new THREE.MeshPhongMaterial({ color: palette.ocean }),
    [palette.ocean],
  );

  const capColor = useCallback(
    (polygon: object) => {
      const visited = visitedCountryCodes.has(
        (polygon as CountryFeature).properties.code,
      );

      if (polygon === hovered) return visited ? palette.muted : palette.raised;
      return visited ? palette.frame : palette.surface;
    },
    [hovered, palette],
  );

  const strokeColor = useCallback(
    (polygon: object) =>
      polygon === hovered ? palette.accent : "rgba(0,0,0,0.9)",
    [hovered, palette],
  );

  const altitude = useCallback(
    (polygon: object) => (polygon === hovered ? HOVER_ALTITUDE : ALTITUDE),
    [hovered],
  );

  const label = useCallback((polygon: object) => {
    const { name, code } = (polygon as CountryFeature).properties;
    const visited = visitedCountryCodes.has(code);

    return `
      <div style="
        display: flex; align-items: baseline; gap: 8px;
        padding: 6px 10px;
        border: 2px solid ${palette.frame}; border-radius: 8px;
        background: ${palette.surface}; color: ${palette.ink};
        font-size: 13px; line-height: 1.2; white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      ">
        <strong>${name}</strong>
        <span style="font-size: 11px; opacity: 0.75;">
          ${visited ? travel.visitedLabel : travel.unvisitedLabel}
        </span>
      </div>`;
  }, [palette]);

  return (
    <div className="view-enter h-screen w-full">
      <Button onClick={onBack} className="mt-4 ml-4 h-10 w-20">
        Back
      </Button>

      <div className="flex flex-col items-center">
        <Card className="w-fit bg-raised px-6 py-4 max-md:mx-4 max-md:px-4 max-md:py-2">
          <h2 className="text-xl font-semibold text-frame max-md:text-base">
            {travel.globeHeading}
          </h2>
        </Card>

        {countries && (
          <Globe
            polygonsData={countries}
            polygonCapColor={capColor}
            polygonStrokeColor={strokeColor}
            polygonSideColor={() => "rgba(255,255,255,0.5)"}
            polygonAltitude={altitude}
            polygonLabel={label}
            onPolygonHover={setHovered}
            polygonsTransitionDuration={180}
            backgroundColor="rgba(0,0,0,0)"
            globeMaterial={globeMaterial}
          />
        )}
      </div>
    </div>
  );
}
