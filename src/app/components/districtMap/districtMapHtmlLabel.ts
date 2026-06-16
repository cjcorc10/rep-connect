type HtmlMapLabelOptions = {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  content: HTMLElement;
  zIndex?: number;
};

export type HtmlMapLabel = google.maps.OverlayView;

/** HTML label anchored to a lat/lng (works without Advanced Markers / mapId). */
export function attachHtmlMapLabel(
  map: google.maps.Map,
  options: HtmlMapLabelOptions,
): HtmlMapLabel {
  class HtmlMapLabel extends google.maps.OverlayView {
    private position: google.maps.LatLng;
    private content: HTMLElement;
    private zIndex: number;
    private container: HTMLDivElement | null = null;

    constructor(opts: HtmlMapLabelOptions) {
      super();
      this.position =
        opts.position instanceof google.maps.LatLng
          ? opts.position
          : new google.maps.LatLng(opts.position);
      this.content = opts.content;
      this.zIndex = opts.zIndex ?? 1;
    }

    onAdd(): void {
      this.container = document.createElement("div");
      this.container.style.position = "absolute";
      this.container.style.zIndex = String(this.zIndex);
      this.container.style.pointerEvents = "none";
      this.container.appendChild(this.content);
      this.getPanes()?.overlayLayer.appendChild(this.container);
    }

    draw(): void {
      if (!this.container) return;
      const projection = this.getProjection();
      const point = projection.fromLatLngToDivPixel(this.position);
      if (!point) return;
      this.container.style.left = `${point.x}px`;
      this.container.style.top = `${point.y}px`;
      this.container.style.transform = "translate(-50%, -50%)";
    }

    onRemove(): void {
      this.container?.remove();
      this.container = null;
    }
  }

  const label = new HtmlMapLabel(options);
  label.setMap(map);
  return label;
}
