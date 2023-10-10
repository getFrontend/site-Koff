import logoSrc from "../../../public/img/logo.svg";

export class Logo {
    constructor(mainClassName) {
        this.mainClassName = mainClassName;
    }

    create() {
        const logo = document.createElement('a');
        logo.classList.add(`${this.mainClassName}__link-logo`);
        logo.href = '/';

        const logoImg = new Image();
        logoImg.classList.add(`${this.mainClassName}__logo`);
        logoImg.src = logoSrc;
        logoImg.alt = "Логотип интернет-магазина Koff";

        logo.append(logoImg);

        return logo;
    }
}