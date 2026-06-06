export const calculateCarouselPosition = (
  totalImages: number,
  index: number,
  radius: number = 150,
) => {
  const angle = (index * 2 * Math.PI) / totalImages;
  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);
  const rotationY = angle * (180 / Math.PI);
  return { x, z, rotationY };
};

export const calculateXPos = (
  parent: HTMLDivElement,
  x: number,
  size: number,
) => {
  if (!parent) return 0;
  const rect = parent.getBoundingClientRect();
  return x - rect.left - size / 2;
};

export const calculateYPos = (
  parent: HTMLDivElement,
  y: number,
  size: number,
) => {
  if (!parent) return 0;
  const rect = parent.getBoundingClientRect();
  return y - rect.top - size / 2;
};
