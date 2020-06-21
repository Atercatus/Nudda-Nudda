import { $ } from "./vendor/dom-api.js";
import {
  getMarkerImage,
  fetchPharmacies,
  DEFAULT_SETTING,
  DEBOUNCING_DELAY,
  MAP_LEVEL,
} from "./vendor/nudda-helper.js";
import { calculateRadius } from "./vendor/geometry.js";
import PharmacyInfoModal from "./pharmacy-info-modal.js";
import History from "./history.js";

export default class NuddaMap {
  constructor(position, pharmacies) {
    if (NuddaMap.instance) {
      return NuddaMap.instance;
    }

    this._pharmacies = pharmacies;
    this._target = $(DEFAULT_SETTING.MAP_TARGET);
    this._map = this._initMap(position);
    this._isIdle = true;
    this._pharmacyInfoModal = new PharmacyInfoModal();
    this._history = new History(this);
    this._markers = [];
    this._clusterer = this._clusterer = new kakao.maps.MarkerClusterer({
      map: this._map,
      averageCenter: true,
      minLevel: MAP_LEVEL.CLUSTERING,
    });
    this._level = DEFAULT_SETTING.LEVEL;
    NuddaMap.instance = this;

    this._initEventListener();
  }

  moveViewport(position) {
    const { lat, lng } = position;

    this._map.setCenter(new kakao.maps.LatLng(lat, lng));
    this.drawPharmaciesMarkers();
  }

  async drawPharmaciesMarkers() {
    // if (this._clusterer) {
    //   this._clusterer.clear();
    // }

    const level = this._map.getLevel();

    // 현재 화면을 분할해서 그려야된다
    // 전체 과정을 반복
    // _getPharmaciesInViewport => 여러 화면으로 분할 할 수 있어야함
    // 요청은 기존 그대로 하고
    const pharmacies = await this._getPharmaciesInViewport();

    const markers = await this._createPharmaciesMarkers(pharmacies);
    this._addMarkersListener(markers, pharmacies);
    this._markers = markers;

    // console.log(level);
    if (level >= MAP_LEVEL.INFOWINDOW) {
      // 인포윈도우
    } else if (level >= MAP_LEVEL.CLUSTERING) {
      if (this._level < MAP_LEVEL.CLUSTERING) {
        // this._removeMarkers();
      }

      this._clusterer.addMarkers(markers);
    } else {
      this._registerPharmaciesMarkers();
    }

    this._level = level;
  }

  async _getPharmaciesInViewport() {
    const viewportInfo = this._getViewportInfo();
    const { pharmacies } = await fetchPharmacies(viewportInfo);

    return pharmacies;
  }

  _registerPharmaciesMarkers() {
    const TERM = 5;

    for (let i = 0; i < this._markers.length; i += TERM) {
      const markers = this._markers.slice(i, i + TERM);

      setTimeout(() => {
        markers.forEach((marker) => {
          marker.setMap(this._map);
        });
      });
    }
  }

  _addMarkersListener(markers, pharmacies) {
    markers.forEach((marker, idx) => {
      const pharmacyInfo = pharmacies[idx];

      kakao.maps.event.addListener(marker, "click", () => {
        this._pharmacyInfoModal.toggleModal(pharmacyInfo);
        this._history.addHistory(pharmacyInfo);
      });
    });
  }

  async _createPharmaciesMarkers(pharmacies) {
    return pharmacies.map((pharmacy) => {
      const { lat, lng, remain_stat: remainStat } = pharmacy;
      const marker = this._createMarker({ lat, lng, remainStat });

      marker.setMap(this._map);
      return marker;
    });
  }

  _createMarker({ lat, lng, remainStat }) {
    const markerImage = getMarkerImage(remainStat);

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      image: markerImage,
    });

    return marker;
  }

  _initMap({ lat, lng }) {
    return new kakao.maps.Map(this._target, {
      center: new kakao.maps.LatLng(lat, lng),
      level: DEFAULT_SETTING.LEVEL,
    });
  }

  _getViewportInfo() {
    const center = this._map.getCenter();
    const bound = this._map.getBounds();
    const sw = bound.getSouthWest();
    const ne = bound.getNorthEast();
    const radius = calculateRadius({ sw, ne, map: this._map });

    return {
      lat: center.getLat(),
      lng: center.getLng(),
      radius,
    };
  }

  _initEventListener() {
    this._addDragMapListener();
    this._addZoomChangeListener();
  }

  async _addZoomChangeListener() {
    kakao.maps.event.addListener(this._map, "zoom_changed", async () => {
      this.drawPharmaciesMarkers();
    });
  }

  _addDragMapListener() {
    kakao.maps.event.addListener(this._map, "drag", () => {
      if (!this._isIdle) {
        return;
      }

      this._isIdle = false;
      this.drawPharmaciesMarkers();

      setTimeout(() => {
        this._isIdle = true;
      }, DEBOUNCING_DELAY);
    });
  }

  _removeMarkers() {
    this._markers.forEach((marker) => {
      marker.setMap(null);
    });
  }
}
