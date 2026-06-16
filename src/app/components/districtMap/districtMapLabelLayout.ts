type PixelBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type DistrictLabelCandidate = {
  preferred: google.maps.LatLng;
  labelNum: string;
  stroke: string;
  fill: string;
  rank: number;
  area: number;
};

function idleOnce(map: google.maps.Map): Promise<void> {
  return new Promise((resolve) => {
    google.maps.event.addListenerOnce(map, "idle", () => resolve());
  });
}

function getMapProjection(
  map: google.maps.Map,
): Promise<google.maps.MapCanvasProjection | null> {
  return new Promise((resolve) => {
    const overlay = new google.maps.OverlayView();
    overlay.onAdd = () => {
      resolve(overlay.getProjection() ?? null);
      overlay.setMap(null);
    };
    overlay.draw = () => {};
    overlay.setMap(map);
  });
}

function measureLabel(
  createLabel: (
    text: string,
    stroke: string,
    fill: string,
  ) => HTMLDivElement,
  text: string,
  stroke: string,
  fill: string,
): { width: number; height: number } {
  const el = createLabel(text, stroke, fill);
  el.style.visibility = "hidden";
  el.style.position = "absolute";
  document.body.appendChild(el);
  const { width, height } = el.getBoundingClientRect();
  document.body.removeChild(el);
  return { width, height };
}

function pixelBox(
  projection: google.maps.MapCanvasProjection,
  latLng: google.maps.LatLng,
  width: number,
  height: number,
): PixelBox | null {
  const center = projection.fromLatLngToContainerPixel(latLng);
  if (!center) return null;
  const halfW = width / 2;
  const halfH = height / 2;
  return {
    left: center.x - halfW,
    top: center.y - halfH,
    right: center.x + halfW,
    bottom: center.y + halfH,
  };
}

function boxesOverlap(a: PixelBox, b: PixelBox, padding: number): boolean {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

function offsetLatLng(
  projection: google.maps.MapCanvasProjection,
  latLng: google.maps.LatLng,
  dxPx: number,
  dyPx: number,
): google.maps.LatLng {
  const pixel = projection.fromLatLngToContainerPixel(latLng);
  if (!pixel) return latLng;
  return (
    projection.fromContainerPixelToLatLng(
      new google.maps.Point(pixel.x + dxPx, pixel.y + dyPx),
    ) ?? latLng
  );
}

function* spiralPixelOffsets(
  stepPx: number,
  maxRings: number,
): Generator<[number, number]> {
  yield [0, 0];
  for (let ring = 1; ring <= maxRings; ring++) {
    const d = ring * stepPx;
    const dirs: [number, number][] = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    for (const [dx, dy] of dirs) {
      yield [dx * d, dy * d];
    }
  }
}

export async function resolveDistrictLabelPositions(
  map: google.maps.Map,
  candidates: DistrictLabelCandidate[],
  createLabel: (
    text: string,
    stroke: string,
    fill: string,
  ) => HTMLDivElement,
): Promise<google.maps.LatLng[]> {
  if (candidates.length === 0) return [];

  await idleOnce(map);
  const projection = await getMapProjection(map);
  if (!projection) {
    return candidates.map((c) => c.preferred);
  }

  const sorted = [...candidates].sort((a, b) => b.area - a.area);
  const placedBoxes: PixelBox[] = [];
  const positions: google.maps.LatLng[] = [];

  for (const candidate of sorted) {
    const size = measureLabel(
      createLabel,
      candidate.labelNum,
      candidate.stroke,
      candidate.fill,
    );
    let resolved = candidate.preferred;
    let placed = false;

    for (const [dx, dy] of spiralPixelOffsets(28, 6)) {
      const trial =
        dx === 0 && dy === 0
          ? candidate.preferred
          : offsetLatLng(projection, candidate.preferred, dx, dy);
      const box = pixelBox(projection, trial, size.width, size.height);
      if (!box) continue;
      if (!placedBoxes.some((existing) => boxesOverlap(box, existing, 8))) {
        resolved = trial;
        placedBoxes.push(box);
        placed = true;
        break;
      }
    }

    if (!placed) {
      const fallbackBox = pixelBox(
        projection,
        candidate.preferred,
        size.width,
        size.height,
      );
      if (fallbackBox) placedBoxes.push(fallbackBox);
    }

    positions.push(resolved);
  }

  const positionByCandidate = new Map(sorted.map((c, i) => [c, positions[i]!]));
  return candidates.map((c) => positionByCandidate.get(c) ?? c.preferred);
}
