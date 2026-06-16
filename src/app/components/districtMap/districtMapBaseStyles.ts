/** Warm, colorful base tuned to match the app cream background. */
export const DISTRICT_ROADMAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "geometry",
    stylers: [{ color: "#f3f0e0" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#ebe6d4" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#e6e1cf" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#b8d4a0" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#fffef9" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#fff8e8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f5d78a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#8ec0e8" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c574c" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f3f0e0" }, { weight: 2.5 }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
];

export const DISTRICT_ROADMAP_TYPE_ID = "district_warm_roadmap";

/** Registers the warm colorful styled map type (requires no mapId). */
export function applyDistrictRoadmapStyle(map: google.maps.Map): void {
  map.mapTypes.set(
    DISTRICT_ROADMAP_TYPE_ID,
    new google.maps.StyledMapType(DISTRICT_ROADMAP_STYLES, {
      name: "District",
    }),
  );
  map.setMapTypeId(DISTRICT_ROADMAP_TYPE_ID);
}
