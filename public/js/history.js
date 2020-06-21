import { $ } from "./vendor/dom-api.js";
import { CLASSNAME, EVENT } from "./common/constants.js";
import { MAXIMUM_HISTORY_SIZE } from "./vendor/nudda-helper.js";

export default class History {
  constructor(map) {
    this._history = [];
    this._target = $(CLASSNAME.PHARMACY_HISTORY);
    this._target.addEventListener(EVENT.MOVE_VIEWPORT, (e) => {
      const { position } = e.detail;

      map.moveViewport(position);
    });
  }

  addHistory(pharmacy) {
    const existIndex = this._history.findIndex((record) => {
      return record.code === pharmacy.code;
    });

    if (existIndex >= 0) {
      this._removeHistory(existIndex);
    }

    if (this._history.length >= MAXIMUM_HISTORY_SIZE) {
      this._removeHistory(MAXIMUM_HISTORY_SIZE - 1);
    }

    this._history.push(pharmacy);
    this._render(pharmacy);
  }

  getHistories() {
    return this._history;
  }

  _removeHistory(index) {
    this._target.children[this._history.length - index - 1].remove();
    this._history.splice(index, 1);
  }

  _render(pharmacyInfo) {
    const {
      name,
      addr,
      remain_stat: remainStat,
      stock_at: stockAt,
      lat,
      lng,
    } = pharmacyInfo;

    const history = document.createElement("div");
    history.classList.add("history");
    history.insertAdjacentHTML(
      "afterbegin",
      /* html */ `
    <div class="history__pharmacy-name">병원이름: ${name}</div>
    <div class="history__pharmacy-address">주소: ${addr}}</div>
    <div class="history__pharmacy-remain-stat">남은 수량: ${remainStat}</div>
    <div class="history__pharmacy-stock-at">재고일시: ${stockAt}</div>
    `
    );

    this._target.insertAdjacentElement("afterbegin", history);

    history.addEventListener("click", (e) => {
      this._moveViewport({ lat, lng });
    });
  }

  _moveViewport(position) {
    const event = new CustomEvent(EVENT.MOVE_VIEWPORT, {
      detail: { position },
    });
    this._target.dispatchEvent(event);
  }
}
