import { CLASSNAME } from "./common/constants.js";
import { $ } from "./vendor/dom-api.js";

export default class PharmacyInfoModal {
  constructor() {
    this._target = $(CLASSNAME.PHARMACY_INFO_MODAL);

    this._initListener();
  }

  toggleModal(pharmacyInfo) {
    this._fillContent(pharmacyInfo);

    this._target.classList.toggle("open");
  }

  offModal() {
    this._target.classList.remove("open");
  }

  _fillContent(pharmacyInfo) {
    const {
      addr,
      name,
      remain_stat: remainStat,
      stock_at: stockAt,
    } = pharmacyInfo;
    const content = $(CLASSNAME.PHARMACY_INFO_MODAL_CONTENT);

    content.innerHTML = /* html */ `
      <div class="content__pharmacy-name">병원이름: ${name}</div>
      <div class="content__pharmacy-address">주소: ${addr}}</div>
      <div class="content__pharmacy-remain-stat">남은 수량: ${remainStat}</div>
      <div class="content__pharmacy-stock-at">재고일시: ${stockAt}</div>
    `;
  }

  _initListener() {
    const overlay = this._target.firstElementChild;

    overlay.addEventListener("click", (e) => {
      this.offModal();
    });
  }
}
