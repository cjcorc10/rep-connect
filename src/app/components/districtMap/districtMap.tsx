"use client";

import type {
  DistrictMapFeatureCollection,
  MapFallback,
  Rep,
} from "@/app/lib/definitions";
import {
  resolveDistrictFeatureMapKey,
  districtNumberForMarker,
} from "@/app/lib/districtMapStyles";
import { formatStateDistrictDisplay } from "@/app/reps/[zip]/helper";
import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "./districtMapLoader";
import {
  attachDistrictLabel,
  boundsCenterFromFeature,
  type DistrictMapLabel,
} from "./districtMapLabels";
import {
  buildSearchAreaOverlay,
  fitMapToDistrictView,
  fitMapToSearchArea,
  isSearchAreaFeature,
  resolveSearchAreaBounds,
} from "./districtMapSearchArea";
import styles from "./districtMap.module.scss";
import {
  buildFederalPartyColorByMapKey,
  buildStateDistrictColorByMapKey,
  districtPolygonStyle,
  readPartyPalettes,
  readStateDistrictColors,
  searchAreaPolygonStyle,
} from "./districtMapVisualConfig";

type GovLevel = "federal" | "state";

function districtLabelText(
  level: GovLevel,
  mapKey: string,
  featureName: unknown,
  rank: number,
): string {
  if (level === "state") {
    const district = mapKey.split(":")[1];
    if (district) return formatStateDistrictDisplay(district);
  }
  return districtNumberForMarker(featureName, rank);
}

function districtLabelClassName(level: GovLevel): string {
  return level === "state"
    ? `${styles.districtLabel} ${styles.districtLabelState}`
    : styles.districtLabel;
}

function createDistrictLabelElement(
  text: string,
  className: string,
  backgroundColor?: string,
): HTMLDivElement {
  const label = document.createElement("div");
  label.className = className;
  label.textContent = text;
  if (backgroundColor) {
    label.style.backgroundColor = backgroundColor;
    label.style.color = "#ffffff";
  }
  return label;
}

type Props = {
  searchZip?: string;
  districtGeoJson: DistrictMapFeatureCollection | null;
  mapFallback: MapFallback;
  level?: GovLevel;
  houseReps?: Rep[];
};

export default function DistrictMap({
  districtGeoJson,
  mapFallback,
  level = "federal",
  houseReps = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const geoKey = districtGeoJson
    ? JSON.stringify(districtGeoJson)
    : "";
  const fallbackKey = JSON.stringify(mapFallback);
  const houseRepsKey = houseReps
    .map((rep) => `${rep.district}:${rep.party}`)
    .join("|");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !apiKey) return;

    let cancelled = false;
    const mapListeners: google.maps.MapsEventListener[] = [];
    const labels: DistrictMapLabel[] = [];

    (async () => {
      await loadGoogleMaps(apiKey);
      if (cancelled || !containerRef.current) return;

      const map = new google.maps.Map(containerRef.current, {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        disableDefaultUI: false,
        tilt: 0,
        heading: 0,
        rotateControl: false,
      });

      mapListeners.push(
        map.addListener("tilt_changed", () => {
          if (map.getTilt() !== 0) map.setTilt(0);
        }),
      );

      const hasFeatures =
        districtGeoJson &&
        Array.isArray(districtGeoJson.features) &&
        districtGeoJson.features.length > 0;

      const searchAreaBounds = resolveSearchAreaBounds(mapFallback);
      const mapContainer = containerRef.current;
      const searchAreaStyle = searchAreaPolygonStyle();

      const applySearchAreaOverlay = () => {
        if (!searchAreaBounds) return;
        map.data.addGeoJson(buildSearchAreaOverlay(searchAreaBounds));
      };

      if (hasFeatures) {
        const stateDistrictColors = readStateDistrictColors(mapContainer);
        const federalColorByMapKey =
          level === "federal"
            ? buildFederalPartyColorByMapKey(
                districtGeoJson.features,
                houseReps,
                readPartyPalettes(mapContainer),
              )
            : null;
        const stateColorByMapKey =
          level === "state"
            ? buildStateDistrictColorByMapKey(
                districtGeoJson.features,
                stateDistrictColors,
              )
            : null;

        map.data.addGeoJson(districtGeoJson);
        applySearchAreaOverlay();

        let keyIdx = 0;
        let labelRank = 0;
        const bounds = new google.maps.LatLngBounds();
        const placedLabels = new Set<string>();

        map.data.forEach((feature) => {
          if (isSearchAreaFeature(feature)) return;

          const mapKey = resolveDistrictFeatureMapKey(
            {
              name: feature.getProperty("name"),
              mapKey: feature.getProperty("mapKey"),
            },
            keyIdx,
            level,
          );
          feature.setProperty("_mapKey", mapKey);
          keyIdx++;

          const featureName = feature.getProperty("name");
          let polygonColor: string | undefined;

          if (level === "federal" && federalColorByMapKey) {
            polygonColor = federalColorByMapKey.get(mapKey);
            if (polygonColor) {
              feature.setProperty("_polygonColor", polygonColor);
            }
          } else if (stateColorByMapKey) {
            polygonColor = stateColorByMapKey.get(mapKey);
            if (polygonColor) {
              feature.setProperty("_polygonColor", polygonColor);
            }
          }

          feature.getGeometry()?.forEachLatLng((latlng) => {
            bounds.extend(latlng);
          });

          if (!mapKey || placedLabels.has(mapKey)) return;

          const center = boundsCenterFromFeature(feature);
          if (!center) return;

          const rank = labelRank++;
          const text = districtLabelText(level, mapKey, featureName, rank);

          placedLabels.add(mapKey);
          labels.push(
            attachDistrictLabel(map, {
              position: center,
              content: createDistrictLabelElement(
                text,
                districtLabelClassName(level),
                level === "federal" ? polygonColor : undefined,
              ),
              zIndex: 900 + rank,
            }),
          );
        });

        map.data.setStyle((feature) => {
          if (isSearchAreaFeature(feature)) return searchAreaStyle;

          const polygonColor = feature.getProperty("_polygonColor");
          if (polygonColor) {
            return districtPolygonStyle(String(polygonColor));
          }

          return districtPolygonStyle("#888888");
        });

        if (!bounds.isEmpty()) {
          fitMapToDistrictView(map, bounds, searchAreaBounds);
        }
      } else if (searchAreaBounds) {
        applySearchAreaOverlay();
        map.data.setStyle((feature) =>
          isSearchAreaFeature(feature) ? searchAreaStyle : {},
        );
        fitMapToSearchArea(map, searchAreaBounds);
      } else if (mapFallback.location) {
        map.setCenter(mapFallback.location);
        map.setZoom(11);
      }
    })().catch(() => {
      /* Map load failure: leave container empty */
    });

    return () => {
      cancelled = true;
      mapListeners.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
      labels.forEach((label) => {
        label.setMap(null);
      });
      el.replaceChildren();
    };
  }, [apiKey, geoKey, fallbackKey, level, houseRepsKey]);

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
