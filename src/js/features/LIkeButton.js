import { FavouriteService } from "../services/LocalStorageService";
import { likeSVG } from "./likeSVG";

export class LikeButton {
    constructor(className) {
        this.className = className;
        this.favouriteService = new FavouriteService();
    }

    create(id) {
        const button = document.createElement('button');
        button.classList.add(`${this.className}`);
        button.dataset.id = id;

        if (this.favouriteService.check(id)) {
            button.classList.add(`${this.className}_active`);
        }

        likeSVG().then((svg) => {
            button.append(svg);
        })

        button.addEventListener('click', () => {
            console.log('Favourite')

            if (this.favouriteService.check(id)) {
                this.favouriteService.remove(id);
                button.classList.remove(`${this.className}_active`);
            } else {
                this.favouriteService.add(id);
                button.classList.add(`${this.className}_active`);
            }
        })

        return button;
    }
}