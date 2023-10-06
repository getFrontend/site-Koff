import { getHTML } from "../helpers/getHTML";
import { orderHTML } from "../html/order-html";
import { addContainer } from "../helpers/addContainer";

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

    mount(parent) {
        if (this.isMounted) {
            return;
        }

        this.containerElement.insertAdjacentHTML('beforeend', getHTML(orderHTML));

        parent.append(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    }

}