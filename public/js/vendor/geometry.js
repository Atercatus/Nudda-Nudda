export function calculateRadius({ sw, ne, map }) {
  const polyline = new kakao.maps.Polyline({
    map,
    path: [sw, ne],
    strokeWeight: 0,
  });

  const radius = polyline.getLength() / 2;

  return radius;
}
