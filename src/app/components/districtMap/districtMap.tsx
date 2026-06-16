"use client";

import type {
  Coordinates,
  DistrictMapFeatureCollection,
} from "@/app/lib/definitions";
import type { DistrictSwatch } from "@/app/lib/districtMapStyles";
import {
  buildDistrictSwatchByMapKey,
  districtNumberForMarker,
  paletteSwatchForMapKey,
  resolveDistrictFeatureMapKey,
  stateSwatchForMapKey,
} from "@/app/lib/districtMapStyles";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
import { applyDistrictRoadmapStyle } from "./districtMapBaseStyles";
import { attachHtmlMapLabel, type HtmlMapLabel } from "./districtMapHtmlLabel";
import {
  resolveDistrictLabelPositions,
  type DistrictLabelCandidate,
} from "./districtMapLabelLayout";
import {
  buildSearchAreaOverlay,
  fitMapToSearchArea,
  isSearchAreaOverlayFeature,
  resolveSearchAreaBounds,
  searchAreaZipLabelPosition,
  styleSearchAreaFeature,
  waitForMapIdle,
} from "./districtMapSearchArea";
import styles from "./districtMap.module.scss";
import {
  districtPolygonMapStyle,
  SEARCH_ZIP_LABEL,
  searchZipLabelInlineStyle,
} from "./districtMapVisualConfig";

type MapFallback = {
  bounds?: Coordinates;
  location?: { lat: number; lng: number };
};

type GovLevel = "federal" | "state";

function createDistrictLabel(
  text: string,
  fill: string,
): HTMLDivElement {
  const label = document.createElement("div");
  label.className = styles.districtLabel;
  label.textContent = text;
  label.style.setProperty("--district-fill", fill);
  return label;
}

function createSearchZipLabel(zip: string): HTMLDivElement {
  const label = document.createElement("div");
  label.textContent = zip;
  label.setAttribute("aria-label", `Searched ZIP code ${zip}`);
  Object.assign(label.style, searchZipLabelInlineStyle());
  return label;
}

function styleDistrictFeature(swatch: DistrictSwatch) {
  return districtPolygonMapStyle(swatch);
}

type Props = {
  /** ZIP code for the searched area label on the map. */
  searchZip?: string;
  districtGeoJson: DistrictMapFeatureCollection | null;
  mapFallback: MapFallback;
  level?: GovLevel;
};

export default function DistrictMap({
  searchZip = "",
  districtGeoJson,
  mapFallback,
  level = "federal",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const geoKey = districtGeoJson
    ? JSON.stringify(districtGeoJson)
    : "";
  const fallbackKey = JSON.stringify(mapFallback);
  const trimmedSearchZip = searchZip.trim();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !apiKey) return;

    let cancelled = false;
    const labels: HtmlMapLabel[] = [];
    const mapListeners: google.maps.MapsEventListener[] = [];

    setOptions({ key: apiKey, v: "weekly" });

    (async () => {
      await importLibrary("maps");
      if (cancelled || !containerRef.current) return;

      const mapOptions: google.maps.MapOptions = {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        disableDefaultUI: false,
        tilt: 0,
        heading: 0,
        rotateControl: false,
      };

      const map = new google.maps.Map(
        containerRef.current,
        mapOptions,
      );
      applyDistrictRoadmapStyle(map);

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

      const districtSwatchByMapKey = hasFeatures
        ? buildDistrictSwatchByMapKey(districtGeoJson.features, level)
        : new Map<string, DistrictSwatch>();

      const resolveDistrictSwatch = (mapKey: string): DistrictSwatch => {
        const swatch = districtSwatchByMapKey.get(mapKey);
        if (swatch) return swatch;
        if (level === "state" && districtGeoJson) {
          return stateSwatchForMapKey(mapKey, districtGeoJson.features);
        }
        return paletteSwatchForMapKey(mapKey);
      };

      const applySearchAreaOverlay = () => {
        if (!searchAreaBounds) return;
        map.data.addGeoJson(buildSearchAreaOverlay(searchAreaBounds));
      };

      const fitInitialView = (
        districtBounds: google.maps.LatLngBounds,
      ) => {
        if (searchAreaBounds) {
          fitMapToSearchArea(map, searchAreaBounds);
          return;
        }
        if (!districtBounds.isEmpty()) {
          map.fitBounds(districtBounds, 28);
        }
      };

      const placeSearchZipLabel = () => {
        if (!trimmedSearchZip || !searchAreaBounds) return;
        labels.push(
          attachHtmlMapLabel(map, {
            position: searchAreaZipLabelPosition(searchAreaBounds),
            content: createSearchZipLabel(trimmedSearchZip),
            zIndex: SEARCH_ZIP_LABEL.zIndex,
          }),
        );
      };

      if (hasFeatures) {
        map.data.addGeoJson(districtGeoJson);
        const styleRank = new Map<string, number>();
        let rankIdx = 0;

        let keyIdx = 0;
        map.data.forEach((feature) => {
          const mapKey = resolveDistrictFeatureMapKey(
            {
              name: feature.getProperty("name"),
              mapKey: feature.getProperty("mapKey"),
            },
            keyIdx,
            level,
          );
          feature.setProperty("_mapKey", mapKey);
          if (!styleRank.has(mapKey)) {
            styleRank.set(mapKey, rankIdx++);
          }
          keyIdx++;
        });

        applySearchAreaOverlay();

        map.data.setStyle((feature) => {
          const searchStyle = styleSearchAreaFeature(feature);
          if (searchStyle) return searchStyle;

          const mapKey = String(feature.getProperty("_mapKey") ?? "");
          const swatch = resolveDistrictSwatch(mapKey);
          return styleDistrictFeature(swatch);
        });

        const bounds = new google.maps.LatLngBounds();
        map.data.forEach((feature) => {
          if (isSearchAreaOverlayFeature(feature)) return;
          feature.getGeometry()?.forEachLatLng((latlng) => {
            bounds.extend(latlng);
          });
        });

        fitInitialView(bounds);
        await waitForMapIdle(map);
        placeSearchZipLabel();

        const labelCandidates: DistrictLabelCandidate[] = [];
        const markerPlaced = new Set<string>();
        map.data.forEach((feature) => {
          const mapKey = String(
            feature.getProperty("_mapKey") ?? "",
          );
          if (!mapKey || markerPlaced.has(mapKey)) return;
          markerPlaced.add(mapKey);

          const fb = new google.maps.LatLngBounds();
          feature.getGeometry()?.forEachLatLng((latlng) => {
            fb.extend(latlng);
          });
          if (fb.isEmpty()) return;

          const rank = styleRank.get(mapKey) ?? 0;
          const swatch = resolveDistrictSwatch(mapKey);
          const labelNum = districtNumberForMarker(
            feature.getProperty("name"),
            rank,
          );
          const ne = fb.getNorthEast();
          const sw = fb.getSouthWest();

          labelCandidates.push({
            preferred: fb.getCenter()!,
            labelNum,
            stroke: swatch.stroke,
            fill: swatch.fill,
            rank,
            area:
              Math.abs(ne.lat() - sw.lat()) *
              Math.abs(ne.lng() - sw.lng()),
          });
        });

        const labelPositions = await resolveDistrictLabelPositions(
          map,
          labelCandidates,
          (text, _stroke, fill) => createDistrictLabel(text, fill),
        );

        labelCandidates.forEach((candidate, i) => {
          labels.push(
            attachHtmlMapLabel(map, {
              position: labelPositions[i] ?? candidate.preferred,
              content: createDistrictLabel(
                candidate.labelNum,
                candidate.fill,
              ),
              zIndex: 900 + candidate.rank,
            }),
          );
        });
      } else if (searchAreaBounds) {
        applySearchAreaOverlay();

        map.data.setStyle((feature) => {
          const searchStyle = styleSearchAreaFeature(feature);
          if (searchStyle) return searchStyle;
          return {};
        });

        fitMapToSearchArea(map, searchAreaBounds);
        await waitForMapIdle(map);
        placeSearchZipLabel();
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
  }, [
    apiKey,
    geoKey,
    fallbackKey,
    districtGeoJson,
    mapFallback,
    trimmedSearchZip,
    level,
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
