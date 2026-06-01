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
