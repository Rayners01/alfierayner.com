'use client';

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from 'three';
import Button from "./ui/button";
import Card from "./ui/card";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface CountryProperties {
  WB_A2: string;
  name: string;
}

interface CountryFeature {
  type: "Feature";
  properties: CountryProperties;
  geometry: GeoJSON.Geometry;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: CountryFeature[];
}

interface GlobeComponentProps {
  goBack: () => void;
}

const visitedCountryCodes = new Set([
  'US','BB','LC','AG','GB','FR','ES','IT','VA','CH','BE',
  'NL','LU','AT','DE','CZ','PL','HU','HR','GR','CY','ZA',
  'BW','ZW','ZM'
]);

const GlobeComponent: React.FC<GlobeComponentProps> = ({ goBack }) => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then((data: GeoJSONData) => setGeoData(data))
      .catch(console.error);
  }, []);

  return (
    <div className="h-screen w-full">
      <Button
        onClick={goBack}
        className="mt-4 ml-4 p-4"
        width="20"
        height="10"
      >
        Back
      </Button>

      <div className="flex flex-col items-center">
        <Card className="px-6 py-4 rounded-lg border-2 border-green-700 bg-lime-100 w-fit">
          <h2 className="text-xl font-semibold text-green-700">
            Countries I have visited
          </h2>
        </Card>

        <div className="w-full h-full">
          {geoData && (
            <Globe
              polygonsData={geoData.features}
              polygonCapColor={(obj) => {
                const feature = obj as CountryFeature;
                return visitedCountryCodes.has(feature.properties.WB_A2)
                  ? "#15803d"
                  : "#d9f99d";
              }}
              polygonStrokeColor={() => "rgba(0,0,0,0.5)"}
              polygonSideColor={() => "rgba(255,255,255,0.5)"}
              backgroundColor="rgba(0,0,0,0)"
              globeMaterial={new THREE.MeshPhongMaterial({ color: "#0b3d91" })}
            />

          )}
        </div>
      </div>
    </div>
  );
};

export default GlobeComponent;
