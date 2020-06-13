import { $ } from "./vendor/dom-api.js";

export default class App {
  constructor() {
    const container = $("#map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);
  }
}
