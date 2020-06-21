import { GET_STORES } from "../common/routes.js";

export const DEBOUNCING_DELAY = 500; //ms
export const MAP_LEVEL = {
  CLUSTERING: 5,
  INFOWINDOW: 7,
};
export const MAXIMUM_HISTORY_SIZE = 10;

export const DEFAULT_SETTING = {
  LEVEL: 3,
  MAP_TARGET: "#map",
};

// 100개 이상(녹색): 'plenty'
// 30개 이상 100개미만(노랑색): 'some'
// 2개 이상 30개 미만(빨강색): 'few'
// 1개 이하(회색): 'empty'
// 판매중지(검은색): 'break'
export function getMarkerImage(remainStat) {
  return new kakao.maps.MarkerImage(
    `/assets/${remainStat || "break"}.svg`,
    new kakao.maps.Size(31, 35),
    {
      offset: new kakao.maps.Point(16, 34),
      alt: "마커 이미지",
      shape: "poly",
      coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33",
    }
  );
}

export async function fetchPharmacies({ lat, lng, radius }) {
  const requestUrl = `${GET_STORES}?lat=${lat}&lng=${lng}&m=${radius}`;

  const response = await fetch(requestUrl, {});
  const { count, stores: pharmacies } = await response.json();

  return { count, pharmacies };
}
