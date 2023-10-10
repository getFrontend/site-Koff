import { API_URL } from "../const";
import { CartButton } from "./CartButton";
import { LikeButton } from "./LIkeButton";

export class Card {
    constructor({ id, image, title, price }) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.price = price;
        this.cartButton = new CartButton('card__button-cart', 'В корзину');
        this.likeButton = new LikeButton('card__button-favourite');
    }

    create() {
        const article = document.createElement('article');
        article.classList.add('goods__card', 'card');

        const cardLink = document.createElement('a');
        cardLink.classList.add('card__link');
        cardLink.href = `/product/${this.id}`;

        const cardImage = new Image();
        cardImage.classList.add('card__image');
        cardImage.src = `${API_URL}${this.image}`;
        cardImage.alt = this.title;

        cardLink.append(cardImage);

        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card__info');

        const cardTitle = document.createElement('h3');
        cardTitle.classList.add('card__item-title');

        const cardTtitleLink = document.createElement('a');
        cardTtitleLink.classList.add('card__item-link');
        cardTtitleLink.href = `/product/${this.id}`;
        cardTtitleLink.textContent = `${this.title}`;

        cardTitle.append(cardTtitleLink);

        const cardPrice = document.createElement('span');
        cardPrice.classList.add('card__item-price');
        cardPrice.innerHTML = `${this.price.toLocaleString('ru-RU')}&nbsp;₽`;

        cardInfo.append(cardTitle, cardPrice);

        const btnCart = this.cartButton.create(this.id);
        const btnFavourite = this.likeButton.create(this.id);

        article.append(cardLink, cardInfo, btnCart, btnFavourite);

        return article;
    }
}