import 'normalize.css';
import './../css/style.scss';
import Navigo from 'navigo';
import { Header } from './modules/_header';
import { Main } from './modules/_main';
import { Footer } from './modules/_footer';
import { Order } from './modules/Order';
import { ProductList } from './modules/productList';
import { apiService } from './services/ApiService';
import { Catalog } from './modules/Catalog';
import { Page404 } from './modules/Page404';
import { FavouriteService } from './services/LocalStorageService';
import { limitDefault } from './const';


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
  const api = new apiService();
  // console.log("API=", api.getProducts())
  const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  api.getProductCategories().then(data => {
    new Catalog().mount(new Main().element, data);
    router.updatePageLinks();
  });

  productSlider();


  router
    .on(
      "/",
      async () => {
        const product = await api.getProducts();

        new ProductList().mount(new Main().element, product, 'Интернет-магазин мебели Koff');

        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          console.log("main page = leave")
          done();
        },
        already() {
          console.log("already");
        }
      })
    .on(
      "/category",
      async ({ params: { slug } }) => {
        const product = await api.getProducts();

        new ProductList().mount(new Main().element, product, slug);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        }
      })
    .on(
      "/favourite",
      async () => {
        const favourite = new FavouriteService().get();
        const product = await api.getProducts(1, limitDefault, favourite);

        if (favourite.length < 1) {
          new ProductList().mount(new Main().element, product.data, 'В избранном пока пусто');
          setTimeout(() => {
            router.navigate('/');
          }, 5000);
          return;
        }


        new ProductList().mount(new Main().element, product.data, 'Избранное');
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        }
      })
    .on("/search", () => {
      console.log('search');
    })
    .on("/product/:id", (obj) => {
      // console.log('obj: ', obj);
    })
    .on("/cart", () => {
      console.log('cart');
    })
    .on("/order", () => {
      new Order().mount(new Main().element);
      console.log('order');
    })
    .notFound(() => {
      console.log("Message in console: Page ", 404);
      new Page404().mount(new Main().element);
      setTimeout(() => {
        router.navigate('/');
      }, 5000);
    }, {
      leave(done) {
        new Page404().unmount();
        console.log("leave 404");
        done();
      }
    });

  router.resolve();

};

init();