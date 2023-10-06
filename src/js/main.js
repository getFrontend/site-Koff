import 'normalize.css';
import './../css/style.scss';
import Navigo from 'navigo';
import { Header } from './modules/_header';
import { Main } from './modules/_main';
import { Footer } from './modules/_footer';
import { Order } from './modules/order';


const productSlider = () => {
  Promise.all([
    import("swiper/modules"),
    import("swiper"),
    import("swiper/css"),
    import("swiper/css/navigation")
  ]).then(([{ Navigation, Thumbs }, Swiper]) => {
    const swiperThumbnails = new Swiper.default('.product__slider-thumbnails', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const swiperGallery = new Swiper.default(".product__slider-main", {
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

  });
};


const init = () => {
  new Header().mount();
  new Main().mount();
  new Footer().mount();


  productSlider();

  const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

  router
    .on("/", () => {
      console.log('Main page');
    })
    .on("/category", (obj) => {
      console.log('category');
      console.log(obj);
    })
    .on("/favourite", () => {
      console.log('favourite');
    })
    .on("/search", () => {
      console.log('search');
    })
    .on("/product/:id", (obj) => {
      console.log('obj: ', obj);
    })
    .on("/cart", () => {
      console.log('cart');
    })
    .on("/order", () => {
      new Order().mount(new Main().element);
      console.log('order');
    })
    .notFound(() => {
      console.log(404);
      document.body.innerHTML = `
        <h2>Страница не найдена...</h2>
      `;
    });

  router.resolve();

};

init();