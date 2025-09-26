'use client';

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from 'three';

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

const GlobeComponent: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);

  const countryCodes = new Set([
    'US','BB','LC','AG','GB','FR','ES','IT','VA','CH','BE',
    'NL','LU','AT','DE','CZ','PL','HU','HR','GR','CY','ZA',
    'BW','ZW','ZM'
  ]);

  // Load GeoJSON data
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((r) => r.json())
      .then((data: GeoJSONData) => setGeoData(data))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full">
      {geoData && (
        <Globe
          polygonsData={geoData.features}
          polygonCapColor={(obj) => {
            const d = obj as CountryFeature;
            return countryCodes.has(d.properties.WB_A2) ? "#15803d" : "#d9f99d";
          }}
          polygonStrokeColor={() => "rgba(0,0,0, 0.5)"}
          polygonSideColor={() => "rgba(255,255,255,0.5)"}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={new THREE.MeshPhongMaterial({ color: "#0b3d91" })}
        />
      )}
    </div>
  );
};

export default GlobeComponent;
