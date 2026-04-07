"use client";

import type { Coordinates, DistrictMapFeatureCollection } from "@/app/lib/definitions";
import {
  districtFeatureName,
  districtNumberForMarker,
  districtStyleIndexByName,
  paletteForDistrictRank,
} from "@/app/lib/districtMapStyles";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
import styles from "./districtMap.module.scss";

type MapFallback = {
  bounds?: Coordinates;
  location?: { lat: number; lng: number };
};

type Props = {
  apiKey: string;
  districtGeoJson: DistrictMapFeatureCollection | null;
  mapFallback: MapFallback;
};

export default function DistrictMap({
  apiKey,
  districtGeoJson,
  mapFallback,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const geoKey = districtGeoJson
    ? JSON.stringify(districtGeoJson)
    : "";
  const fallbackKey = JSON.stringify(mapFallback);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !apiKey) return;

    let cancelled = false;
    const markers: google.maps.Marker[] = [];

    setOptions({ key: apiKey, v: "weekly" });

    (async () => {
      await importLibrary("maps");
      if (cancelled || !containerRef.current) return;

      const map = new google.maps.Map(containerRef.current, {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        disableDefaultUI: false,
      });

      const hasFeatures =
        districtGeoJson &&
        Array.isArray(districtGeoJson.features) &&
        districtGeoJson.features.length > 0;

      if (hasFeatures) {
        map.data.addGeoJson(districtGeoJson);
        const styleRank = districtStyleIndexByName(
          districtGeoJson.features
        );

        let keyIdx = 0;
        map.data.forEach((feature) => {
          const mapKey = districtFeatureName(
            feature.getProperty("name"),
            keyIdx
          );
          feature.setProperty("_mapKey", mapKey);
          keyIdx++;
        });

        map.data.setStyle((feature) => {
          const mapKey = String(feature.getProperty("_mapKey") ?? "");
          const rank = styleRank.has(mapKey)
            ? styleRank.get(mapKey)!
            : 0;
          const { stroke, fill } = paletteForDistrictRank(rank);
          return {
            strokeColor: stroke,
            strokeWeight: 2,
            fillColor: fill,
            fillOpacity: 0.22,
          };
        });

        const bounds = new google.maps.LatLngBounds();
        map.data.forEach((feature) => {
          feature.getGeometry()?.forEachLatLng((latlng) => {
            bounds.extend(latlng);
          });
        });

        const markerPlaced = new Set<string>();
        map.data.forEach((feature) => {
          const mapKey = String(feature.getProperty("_mapKey") ?? "");
          if (!mapKey || markerPlaced.has(mapKey)) return;
          markerPlaced.add(mapKey);

          const fb = new google.maps.LatLngBounds();
          feature.getGeometry()?.forEachLatLng((latlng) => {
            fb.extend(latlng);
          });
          if (fb.isEmpty()) return;

          const rank = styleRank.has(mapKey)
            ? styleRank.get(mapKey)!
            : 0;
          const { stroke, fill } = paletteForDistrictRank(rank);
          const labelNum = districtNumberForMarker(
            feature.getProperty("name"),
            rank
          );

          markers.push(
            new google.maps.Marker({
              map,
              position: fb.getCenter(),
              zIndex: 900 + rank,
              label: {
                text: labelNum,
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "bold",
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: fill,
                fillOpacity: 1,
                strokeColor: stroke,
                strokeWeight: 2,
              },
            })
          );
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 28);
        }
      } else if (mapFallback.bounds) {
        const b = new google.maps.LatLngBounds(
          mapFallback.bounds.southwest,
          mapFallback.bounds.northeast
        );
        map.fitBounds(b, 28);
      } else if (mapFallback.location) {
        map.setCenter(mapFallback.location);
        map.setZoom(11);
      }
    })().catch(() => {
      /* Map load failure: leave container empty */
    });

    return () => {
      cancelled = true;
      markers.forEach((m) => m.setMap(null));
      el.replaceChildren();
    };
  }, [
    apiKey,
    geoKey,
    fallbackKey,
    districtGeoJson,
    mapFallback,
  ]);

  if (!apiKey) {
    return (
      <div
        className={styles.fallback}
        role="img"
        aria-label="Map unavailable: set GOOGLE_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
      />
    );
  }

  return <div ref={containerRef} className={styles.map} />;
}
