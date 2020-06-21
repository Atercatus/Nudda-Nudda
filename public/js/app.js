import NuddaMap from "./map.js";

export default class App {
  constructor() {
    const initPos = { lat: 35.810748, lng: 128.545309 };
    this.map = new NuddaMap(initPos, []);

    this.init();
  }

  init() {
    // 마커 그리기
    this.map.drawPharmaciesMarkers();

    // 히스토리 초기화
  }
}
