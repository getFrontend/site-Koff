import 'normalize.css';
import './../css/style.scss';
import Navigo from 'navigo';
import { Header } from './modules/_header';
import { Main } from './modules/_main';
import { Footer } from './modules/_footer';
import { Order } from './modules/Order';
import { ProductList } from './modules/productList';
import { ApiService } from './services/ApiService';
import { Catalog } from './modules/Catalog';
import { Page404 } from './modules/Page404';
import { FavouriteService } from './services/LocalStorageService';
import { Pagination } from './features/Pagination';
import { BreadCrumbs } from './features/BreadCrumbs';

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

export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

const init = () => {
  const api = new ApiService();

  new Header().mount();
  new Main().mount();
  new Footer().mount();


  productSlider();


  router
    .on(
      "/",
      async () => {
        new Catalog().mount(new Main().element);
        const products = await api.getProducts();
        new ProductList().mount(
          new Main().element,
          products,
          'Интернет-магазин мебели Koff'
        );

        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          new Catalog().unmount();
          // console.log("main page = leave");
          done();
        },
        already(match) {
          match.route.handler(match);
        }
      })
    .on(
      "/category",
      async ({ params: { slug, page = 1 } }) => {
        new Catalog().mount(new Main().element);
        const { data: products, pagination } = await api.getProducts({
          category: slug,
          page: page,
        });

        new BreadCrumbs().mount(new Main().element, [{ text: slug }]);
        new ProductList().mount(new Main().element, products, slug);
        new Pagination()
          .mount(new ProductList().containerElement)
          .update(pagination);

        router.updatePageLinks();
      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        }
      })
    .on(
      "/favourite",
      async ({ params }) => {
        new Catalog().mount(new Main().element);
        const favourite = new FavouriteService().get();
        const { data: products, pagination } = await api.getProducts({
          list: favourite.join(','),
          page: params?.page || 1,
        });
        new BreadCrumbs().mount(new Main().element, [{ text: 'Избранное' }]);
        new ProductList().mount(
          new Main().element,
          products,
          'Избранное',
          'В избранном пока пусто, через 5 секунд вы вновь на главной странице.'
        );
        new Pagination().mount(new ProductList().containerElement).update(pagination);
        
        router.updatePageLinks();

        if (favourite.length < 1) {
          setTimeout(() => {
            router.navigate('/');
          }, 5000);
          return;
        }

      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
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