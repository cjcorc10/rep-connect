export type DistrictMapLabel = {
  setMap(map: google.maps.Map | null): void;
};

export function boundsCenterFromFeature(
  feature: google.maps.Data.Feature,
): google.maps.LatLng | null {
  const bounds = new google.maps.LatLngBounds();
  feature.getGeometry()?.forEachLatLng((latlng) => {
    bounds.extend(latlng);
  });
  if (bounds.isEmpty()) return null;
  return bounds.getCenter() ?? null;
}

/** Lightweight HTML label — one OverlayView per district. */
export function attachDistrictLabel(
  map: google.maps.Map,
  options: {
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    content: HTMLElement;
    zIndex?: number;
  },
): DistrictMapLabel {
  class HtmlLabelOverlay extends google.maps.OverlayView {
    private container: HTMLElement | null = null;

    constructor(
      private readonly position: google.maps.LatLng,
      private readonly content: HTMLElement,
      private readonly zIndex: number,
    ) {
      super();
    }

    onAdd() {
      this.container = this.content;
      this.container.style.position = "absolute";
      this.getPanes()?.floatPane.appendChild(this.container);
    }

    draw() {
      const projection = this.getProjection();
      if (!projection || !this.container) return;

      const point = projection.fromLatLngToDivPixel(this.position);
      if (!point) return;

      this.container.style.left = `${point.x}px`;
      this.container.style.top = `${point.y}px`;
      this.container.style.transform = "translate(-50%, -50%)";
      this.container.style.zIndex = String(this.zIndex);
    }

    onRemove() {
      this.container?.remove();
      this.container = null;
    }
  }

  const position =
    options.position instanceof google.maps.LatLng
      ? options.position
      : new google.maps.LatLng(options.position);

  const overlay = new HtmlLabelOverlay(
    position,
    options.content,
    options.zIndex ?? 900,
  );
  overlay.setMap(map);

  return {
    setMap: (nextMap) => overlay.setMap(nextMap),
  };
}
