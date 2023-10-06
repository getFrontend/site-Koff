import logoSrc from "../../../public/img/logo.svg";

export const getLogo = (linkClass, logoClass) => {
    const logo = document.createElement('a');
    logo.classList.add(linkClass);
    logo.href = '/';

    const logoImg = new Image();
    logoImg.classList.add(logoClass);
    logoImg.src = logoSrc;
    logoImg.alt = "Логотип интернет-магазина Koff";

    logo.append(logoImg);

    return logo;
};