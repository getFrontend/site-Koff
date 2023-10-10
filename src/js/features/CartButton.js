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

        button.addEventListener('click', () => {
            console.log('Korzina')
        })

        return button;
    }
}