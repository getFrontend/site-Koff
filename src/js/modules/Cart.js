import { API_URL } from "../const";
import { addContainer } from "../helpers/addContainer";
import { debounce } from "../helpers/debounce";
import { router } from "../main";
import { ApiService } from "../services/ApiService";
import { Header } from "./_header";

export class Cart {
  static instance = null;

  constructor() {
    if (!Cart.instance) {
      Cart.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('cart');
      this.containerElement = addContainer(this.element, 'cart__container');
      this.debUpdateCart = debounce(this.updateCart.bind(this), 300);
      this.isMounted = false;
    }

    return Cart.instance;
  }

  async mount(parent, data, title, emptyText) {
    if (this.isMounted) {
      return;
    }
    // Чтобы не было наложения текстов в блоке друг на друга, очищаем контейнер при рендере
    this.containerElement.textContent = '';

    const cartTitle = document.createElement('h2');
    cartTitle.classList.add('cart__title');
    cartTitle.textContent = title;
    this.containerElement.append(cartTitle);

    this.cartData = data;

    if (data.products && data.products.length) {
      this.renderProducts();
      this.renderForm();
      this.renderPlace();
    } else {
      this.containerElement.insertAdjacentHTML(
        'beforeend',
        `
          <p class="cart__empty">
            ${emptyText || 'Произошла ошибка, пожалуйста, попробуйте снова'}
          </p>
        `,
      );
    }

    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  updateCart(id, quantity) {
    if (quantity === 0) {
      new ApiService().removeProductFromCart(id);
      this.cartData.products = this.cartData.products.filter(
        (item) => item.id !== id,
      );
    } else {
      new ApiService().updateQuantityProductsInCart(id, quantity);
      this.cartData.products.forEach(item => {
        if (item.id === id) {
          item.quantity = quantity;

        }
      });
    }

    this.cartData.totalPrice = this.cartData.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const count = this.cartData.products.length;
    const totalPrice = this.cartData.totalPrice;

    if (totalPrice === 0) {
      this.cartProducts.textContent = 'Корзина пуста. Пожалуйста, добавьте товар, чтобы оформить заказ.';
    }

    this.cartCount.textContent = `
      ${count + `
        ${(count === 1) ? 'товар' : 'товара'}
      `
      }
      на сумму:
    `;
    this.cartTotalPrice.innerHTML = `
      ${(totalPrice)
        .toLocaleString()}
        &nbsp;₽
    `;
  }

  renderProducts() {
    const cartProductsData = this.cartData.products;

    this.cartProducts = document.createElement('div');
    this.cartProducts.classList.add('cart__products');

    const cartItems = cartProductsData.map((item) => {
      const cartProduct = document.createElement('li');
      cartProduct.classList.add('cart__product');

      const cartProductImg = document.createElement('img');
      cartProductImg.classList.add('cart__product-img');
      cartProductImg.src = `${API_URL}${item.images[0]}`;
      cartProductImg.alt = item.name;

      const imgLink = document.createElement('a');
      imgLink.classList.add('cart__product-link');
      imgLink.title = item.name;
      imgLink.href = `/product/${item.id}`;
      imgLink.append(cartProductImg);

      const cartProductTitle = document.createElement('h3');
      cartProductTitle.classList.add('cart__product-title');
      cartProductTitle.textContent = item.name;

      const cartProductArticle = document.createElement('p');
      cartProductArticle.classList.add('cart__product-article');
      cartProductArticle.textContent = `арт. ${item.article}`;

      const cartProductPrice = document.createElement('p');
      cartProductPrice.classList.add('cart__product-price');
      cartProductPrice.innerHTML = `
        ${(item.price * item.quantity)
          .toLocaleString()}
          &nbsp;₽
      `;

      const cartProductCount = document.createElement('div');
      cartProductCount.classList.add('cart__product-count');

      const cartCountBtnMinus = document.createElement('button');
      cartCountBtnMinus.classList.add('cart__product-btn');
      cartCountBtnMinus.textContent = '-';

      const cartCountBtnPlus = document.createElement('button');
      cartCountBtnPlus.classList.add('cart__product-btn');
      cartCountBtnPlus.textContent = '+';

      const cartProductQuantity = document.createElement('span');
      cartProductQuantity.classList.add('cart__product-quantity');
      cartProductQuantity.textContent = item.quantity;

      cartCountBtnMinus.addEventListener('click', async () => {
        if (item.quantity) {
          item.quantity--;
          cartProductQuantity.textContent = item.quantity;

          if (item.quantity === 0) {
            cartProduct.remove();
            this.debUpdateCart(item.id, item.quantity);

            let { totalCount } = await new ApiService().getCart();
            console.log('Item remove from Cart');
            totalCount--;
            new Header().changeCount(totalCount);
            return;
          }

          cartProductPrice.innerHTML = `
            ${(item.price * item.quantity)
              .toLocaleString()}
              &nbsp;₽
          `;

          this.debUpdateCart(item.id, item.quantity);
        }
      });

      cartCountBtnPlus.addEventListener('click', () => {
        item.quantity++;
        cartProductQuantity.textContent = item.quantity;

        cartProductPrice.innerHTML = `
        ${(item.price * item.quantity)
            .toLocaleString()}
          &nbsp;₽
      `;

        this.debUpdateCart(item.id, item.quantity);
      });

      cartProductCount.append(
        cartCountBtnMinus,
        cartProductQuantity,
        cartCountBtnPlus,
      );
      cartProduct.append(
        imgLink,
        cartProductTitle,
        cartProductArticle,
        cartProductPrice,
        cartProductCount,
      );

      return cartProduct;
    });

    this.cartProducts.append(...cartItems);

    this.containerElement.append(this.cartProducts);
  }

  renderPlace() {
    const count = this.cartData.products.length;
    const totalPrice = this.cartData.totalPrice;

    const cartPlace = document.createElement('div');
    cartPlace.classList.add('cart__order');

    const cartSubtitle = document.createElement('h3');
    cartSubtitle.classList.add('cart__subtitle');
    cartSubtitle.textContent = 'Оформление';

    const cartPlaceInfo = document.createElement('div');
    cartPlaceInfo.classList.add('cart__order-info');

    this.cartCount = document.createElement('p');
    this.cartCount.classList.add('cart__order-count');
    this.cartCount.textContent = `
      ${count + `
        ${(count === 1) ? 'товар' : 'товара'}
      `
      }
      на сумму:
    `;

    this.cartTotalPrice = document.createElement('p');
    this.cartTotalPrice.classList.add('cart__order-price');
    this.cartTotalPrice.innerHTML = `
      ${(totalPrice)
        .toLocaleString()}
        &nbsp;₽
    `;

    const cartaddressPrice = document.createElement('p');
    cartaddressPrice.classList.add('cart__order-delivery');
    cartaddressPrice.textContent = 'Доставка 0 ₽';

    const cartOrderBtn = document.createElement('button');
    cartOrderBtn.classList.add('cart__order-btn');
    cartOrderBtn.type = 'submit';
    cartOrderBtn.setAttribute('form', 'order');
    cartOrderBtn.textContent = 'Оформить заказ';

    cartPlaceInfo.append(this.cartCount, this.cartTotalPrice);
    cartPlace.append(
      cartSubtitle,
      cartPlaceInfo,
      cartaddressPrice,
      cartOrderBtn);

    this.containerElement.append(cartPlace);
  }

  renderForm() {
    const form = document.createElement('form');
    form.classList.add('cart__form', 'form-order');
    form.id = 'order';
    form.method = 'POST';

    const title = document.createElement('h3');
    title.classList.add('form-order__subtitle');
    title.textContent = 'Данные для доставки';

    const inputFieldsetInfo = document.createElement('fieldset');
    inputFieldsetInfo.classList.add(
      'form-order__fieldset',
      'form-order__fieldset_info'
    );

    const inputFieldsetDelivery = document.createElement('fieldset');
    inputFieldsetDelivery.classList.add(
      'form-order__fieldset',
      'form-order__fieldset_delivery'
    );

    const name = document.createElement('input');
    name.classList.add('form-order__input');
    name.type = 'text';
    name.name = 'name';
    name.required = true;
    name.placeholder = 'Фамилия Имя Отчество';

    const phone = document.createElement('input');
    phone.classList.add('form-order__input');
    phone.type = 'tel';
    phone.name = 'phone';
    phone.required = true;
    phone.placeholder = 'Телефон';

    const email = document.createElement('input');
    email.classList.add('form-order__input');
    email.type = 'email';
    email.name = 'email';
    email.required = true;
    email.placeholder = 'E-mail';

    const address = document.createElement('input');
    address.classList.add('form-order__input');
    address.type = 'text';
    address.name = 'address';
    address.required = false;
    address.placeholder = 'Адрес доставки';

    const comment = document.createElement('textarea');
    comment.classList.add('form-order__textarea-comment');
    comment.name = 'comment';
    comment.placeholder = 'Комментарий к заказу';

    inputFieldsetInfo.append(
      name,
      phone,
      email,
      address,
      comment,
    );

    const formLegendDelivery = document.createElement('legend');
    formLegendDelivery.classList.add('form-order__legend');
    formLegendDelivery.textContent = 'Доставка';

    const deliveryLabel = document.createElement('label');
    deliveryLabel.classList.add('form-order__label', 'radio');
    const deliveryLabelText = document.createTextNode('Доставка');

    const deliveryInput = document.createElement('input');
    deliveryInput.classList.add('radio__input');
    deliveryInput.type = 'radio';
    deliveryInput.name = 'deliveryType';
    deliveryInput.required = true;
    deliveryInput.value = 'delivery';
    deliveryInput.checked = true;

    deliveryLabel.append(deliveryInput, deliveryLabelText);

    const pickupLabel = document.createElement('label');
    pickupLabel.classList.add('form-order__label', 'radio');
    const pickupLabelText = document.createTextNode('Самовывоз');

    const pickupInput = document.createElement('input');
    pickupInput.classList.add('form-order__radio', 'radio__input');
    pickupInput.type = 'radio';
    pickupInput.name = 'deliveryType';
    pickupInput.required = true;
    pickupInput.value = 'pickup';

    pickupLabel.append(pickupInput, pickupLabelText);

    inputFieldsetDelivery.append(
      formLegendDelivery,
      deliveryLabel,
      pickupLabel,
    );

    inputFieldsetDelivery.addEventListener('change', (e) => {
      if (e.target === deliveryInput) {
        address.disabled = false;
      } else {
        address.disabled = true;
        address.value = '';
      }
    })

    const inputFieldsetPayment = document.createElement('fieldset');
    inputFieldsetPayment.classList.add(
      'form-order__fieldset',
      'form-order__fieldset_payment'
    );

    const formLegendPayment = document.createElement('legend');
    formLegendPayment.classList.add('form-order__legend');
    formLegendPayment.textContent = 'Оплата';

    const cardLabel = document.createElement('label');
    cardLabel.classList.add('form-order__label', 'radio');
    const cardlabelText = document.createTextNode('Картой при получении');

    const cardInput = document.createElement('input');
    cardInput.classList.add('form-order__radio', 'radio__input');
    cardInput.type = 'radio';
    cardInput.name = 'paymentType';
    cardInput.required = true;
    cardInput.value = 'card';

    cardLabel.append(cardInput, cardlabelText);

    const cashLabel = document.createElement('label');
    cashLabel.classList.add('form-order__label', 'radio');
    const cashlabelText = document.createTextNode('Наличными при получении');

    const cashInput = document.createElement('input');
    cashInput.classList.add('form-order__radio', 'radio__input');
    cashInput.type = 'radio';
    cashInput.name = 'paymentType';
    cashInput.required = true;
    cashInput.value = 'cash';
    cashInput.checked = true;

    cashLabel.append(cashInput, cashlabelText);

    inputFieldsetPayment.append(
      formLegendPayment,
      cardLabel,
      cashLabel,
    )

    form.append(
      title,
      inputFieldsetInfo,
      inputFieldsetDelivery,
      inputFieldsetPayment,
    )

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('Идёт отправка заказа');

      const data = Object.fromEntries(new FormData(form));

      const { orderId } = await new ApiService().postOrder(data);

      new Header().changeCount(0);

      router.navigate(`/order/${orderId}`);
    });

    this.containerElement.append(form);
  }
}