"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { travel, visitedCountryCodes } from "@/content/travel";
import { palette } from "@/lib/palette";

// react-globe.gl touches `window` on import, so it can only load in the browser.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type CountryFeature = {
  type: "Feature";
  properties: { WB_A2: string; name: string };
  geometry: GeoJSON.Geometry;
};

type CountriesGeoJson = {
  type: "FeatureCollection";
  features: CountryFeature[];
};

const COUNTRIES_URL = "/data/countries-110m.geojson";

export function GlobeView({ onBack }: { onBack: () => void }) {
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);

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

  // Allocated once: a new material on every render would leak GPU resources.
  const globeMaterial = useMemo(
    () => new THREE.MeshPhongMaterial({ color: palette.ocean }),
    [],
  );

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
            polygonCapColor={(feature) =>
              visitedCountryCodes.has(
                (feature as CountryFeature).properties.WB_A2,
              )
                ? palette.frame
                : palette.surface
            }
            polygonStrokeColor={() => "rgba(0,0,0,0.5)"}
            polygonSideColor={() => "rgba(255,255,255,0.5)"}
            backgroundColor="rgba(0,0,0,0)"
            globeMaterial={globeMaterial}
          />
        )}
      </div>
    </div>
  );
}
