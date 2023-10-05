import 'normalize.css';
import './../css/style.scss';

import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const swiperThumbnails = new Swiper('.product__slider-thumbnails', {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});

const swiperGallery = new Swiper(".product__slider-main", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".product__slider-controls_next",
        prevEl: ".product__slider-controls_prev",
    },
    modules: [Navigation, Thumbs],
    thumbs: {
        swiper: swiperThumbnails,
    },
});