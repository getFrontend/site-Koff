import { addContainer } from "../helpers/addContainer";
import { router } from "../main";

export class Order {
  static instance = null;

  constructor() {
    if (!Order.instance) {
      Order.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('order');
      this.containerElement = addContainer(this.element, 'order__container');
      this.isMounted = false;
    }

    return Order.instance;
  }

  mount(parent, data) {
    if (this.isMounted) {
      return;
    }

    this.renderOrder(data);
    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  renderOrder(data) {
    const orderData = Object.entries(this.formatData(data));

    const { id, totalPrice } = data[0];

    const orderInfo = document.createElement('div');
    orderInfo.classList.add('order__info');

    const orderTitle = document.createElement('h3');
    orderTitle.classList.add('order__title');
    orderTitle.textContent = 'Заказ успешно размещен';

    const orderPrice = document.createElement('p');
    orderPrice.classList.add('order__fullprice');
    orderPrice.innerHTML = `${Number(totalPrice).toLocaleString('ua-UA')}&nbsp;₴`;

    const orderNumber = document.createElement('p');
    orderNumber.classList.add('order__number');
    orderNumber.textContent = `№ ${id}`;

    const orderSubTitle = document.createElement('h4');
    orderSubTitle.classList.add('order__subtitle');
    orderSubTitle.textContent = 'Данные доставки';

    const orderTable = document.createElement('table');
    orderTable.classList.add('order__table', 'table');

    const tableItems = orderData.map(item => {
      const tableRow = document.createElement('tr');
      tableRow.classList.add('table__row');

      const tableField = document.createElement('td');
      tableField.classList.add('table__field');
      tableField.textContent = item[0];

      const tableValue = document.createElement('td');
      tableValue.classList.add('table__value');
      tableValue.textContent = item[1];

      tableRow.append(tableField, tableValue);
      return tableRow;
    })

    const orderBtn = document.createElement('button');
    orderBtn.classList.add('order__button');
    orderBtn.textContent = 'На главную';
    orderBtn.type = 'button';

    orderBtn.addEventListener('click', () => {
      router.navigate('/');
    })

    orderInfo.append(orderTitle, orderPrice);
    orderTable.append(...tableItems);

    this.containerElement.append(
      orderInfo,
      orderNumber,
      orderSubTitle,
      orderTable,
      orderBtn,
    )
  }

  formatData(data) {
    const dataFormated = data[0];
    return {
      'Получатель': dataFormated.name,
      'Телефон': dataFormated.phone,
      'E-mail': dataFormated.email,
      'Адрес доставки': dataFormated.address,
      'Способ оплаты': dataFormated.paymentType === 'card'
        ? 'Картой при получении'
        : 'Наличными при получении',
      'Способ получения': dataFormated.deliveryType === 'delivery'
        ? 'Доставка'
        : 'Самовывоз',
    };
  }
}
