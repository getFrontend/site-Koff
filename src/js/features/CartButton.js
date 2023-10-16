import { Header } from "../modules/_header";
import { ApiService } from "../services/ApiService";

export class CartButton {
    constructor(className, text) {
        this.className = className;
        this.text = text;
    }

    create(id) {
        const button = document.createElement('button');
        button.classList.add(`${this.className}`);
        button.dataset.id = id;
        button.textContent = `${this.text}`;

        button.addEventListener('click', async () => {
            const { totalCount } = await new ApiService().postProductToCart(id);
            console.log('The item added to Cart');
            new Header().changeCount(totalCount);
        })

        return button;
    }
}