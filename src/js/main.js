import 'normalize.css';
import '/css/main.scss';

import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const swiperThumbnails = new Swiper('.product__thumbs-swiper', {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});

const swiperGallery = new Swiper(".product__gallery-swiper", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".slide__button--next",
        prevEl: ".slide__button--prev",
    },
    modules: [Navigation, Thumbs],
    thumbs: {
        swiper: swiperThumbnails,
    },
});