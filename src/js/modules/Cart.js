import { API_URL } from "../const";
import { addContainer } from "../helpers/addContainer";
import { debounce } from "../helpers/debounce";
import { ApiService } from "../services/ApiService";

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
      this.renderPlace();
      this.renderForm();
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

    console.log(data);


    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  updateCart(id, quantity) {
    // console.log(id, quantity)
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

    const cartProducts = document.createElement('div');
    cartProducts.classList.add('cart__products');

    const cartItems = cartProductsData.map((item) => {
      const cartProduct = document.createElement('li');
      cartProduct.classList.add('cart__product');

      const cartProductImg = document.createElement('img');
      cartProductImg.classList.add('cart__product-img');
      cartProductImg.src = `${API_URL}${item.images[0]}`;
      cartProductImg.alt = item.name;

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
        cartProductImg,
        cartProductTitle,
        cartProductArticle,
        cartProductPrice,
        cartProductCount,
      );

      return cartProduct;
    });

    cartProducts.append(...cartItems);

    this.containerElement.append(cartProducts);
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

    const cartDeliveryPrice = document.createElement('p');
    cartDeliveryPrice.classList.add('cart__order-delivery');
    cartDeliveryPrice.textContent = 'Доставка 0 ₽';

    const cartOrderBtn = document.createElement('button');
    cartOrderBtn.classList.add('cart__order-btn');
    cartOrderBtn.type = 'submit';
    cartOrderBtn.setAttribute('form', 'order');
    cartOrderBtn.textContent = 'Оформить заказ';

    cartPlaceInfo.append(this.cartCount, this.cartTotalPrice);
    cartPlace.append(
      cartSubtitle,
      cartPlaceInfo,
      cartDeliveryPrice,
      cartOrderBtn);

    this.containerElement.append(cartPlace);
  }

  renderForm() {
    const form = document.createElement('form');
    form.classList.add('cart__form', 'form-order');
    form.id = 'order';
    form.method = 'post';
    form.innerHTML = `
            <h3 class="form-order__subtitle">Данные для доставки</h3>
            <fieldset class="form-order__fieldset form-order__fieldset_info">
                <input class="form-order__input" type="text" name="name" placeholder="Фамилия Имя Отчество" required>
                <input class="form-order__input" type="tel" name="phone" placeholder="Телефон" required>
                <input class="form-order__input" type="email" name="email" placeholder="E-mail" required>
                <input class="form-order__input" type="text" name="address" placeholder="Адрес доставки">
                <textarea class="form-order__textarea-comment" name="comment" placeholder="Комментарий к заказу"></textarea>
            </fieldset>

            <fieldset class="form-order__fieldset form-order__fieldset_delivery">
                <legend class="form-order__legend">Доставка</legend>
                <label class="form-order__label radio">
                    <input class="form-order__radio radio__input" type="radio" name="deliveryType" value="delivery" required>
                    Доставка
                </label>
                <label class="form-order__label radio">
                    <input class="form-order__radio radio__input" type="radio" name="deliveryType" value="self-delivery" required>
                    Самовывоз
                </label>
            </fieldset>

            <fieldset class="form-order__fieldset form-order__fieldset_payment">
                <legend class="form-order__legend">Оплата</legend>
                <label class="form-order__label radio">
                    <input class="form-order__radio radio__input" type="radio" name="paymentType" value="card" required>
                    Картой при получении
                </label>
                <label class="form-order__label radio">
                    <input class="form-order__radio radio__input" type="radio" name="paymentType" value="cash" required>
                    Наличными при получении
                </label>
            </fieldset>
    `;

    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log('Идёт отправка заказа');
    })

    this.containerElement.append(form);
  }
}