import 'normalize.css';
import './../css/style.scss';
import Navigo from 'navigo';
import { Header } from './modules/_header';
import { Main } from './modules/_main';
import { Footer } from './modules/_footer';
import { ApiService } from './services/ApiService';
import { FavouriteService } from './services/LocalStorageService';
import { Pagination } from './features/Pagination';
import { BreadCrumbs } from './features/BreadCrumbs';
import { Catalog } from './modules/Catalog';
import { Page404 } from './modules/Page404';
import { ProductCard } from './modules/ProductCard';
import { ProductList } from './modules/ProductList';
import { Order } from './modules/Order';
import { Cart } from './modules/Cart';
import { productSlider } from './features/productSlider';


export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });
export const api = new ApiService();

const init = () => {
  new Header().mount();
  new Main().mount();
  new Footer().mount();

  router
    .on(// Main Page
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
          new Catalog().unmount();
          new ProductList().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
        }
      })
    .on(// Category page
      "/category",
      async ({ params: { slug, page = 1 } }) => {
        (await new Catalog().mount(new Main().element))
          .setActiveLink(slug);

        const { data: products, pagination } = await api.getProducts({
          category: slug,
          page: page,
        });

        new BreadCrumbs().mount(new Main().element, [{ text: slug }]);
        new ProductList().mount(new Main().element, products, slug);

        if (pagination.totalProducts > pagination.limit) {
          new Pagination()
            .mount(new ProductList().containerElement)
            .update(pagination);
        }

        router.updatePageLinks();
      },
      {
        async leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          (await new Catalog().unmount()).setActiveLink();
          done();
        }
      })
    .on(// Favourite page
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

        if (favourite.length > pagination?.limit) {
          new Pagination().mount(new ProductList().containerElement).update(pagination);
          router.updatePageLinks();
        } else if (favourite.length === 0) {
          setTimeout(() => {
            router.navigate('/');
          }, 5000);
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
    .on(// Search page
      "/search",
      async ({ params: { q } }) => {
        new Catalog().mount(new Main().element);
        const { data: products, pagination } = await api.getProducts({
          q
        });

        new BreadCrumbs().mount(new Main().element, [{ text: 'Поиск' }]);
        new ProductList()
          .mount(new Main().element,
            products,
            `Поиск: ${q}`,
            `Извините, но ничего не найдено по вашему запросу: "${q}"`
          );

        if (pagination.totalProducts > pagination.limit) {
          new Pagination()
            .mount(new ProductList().containerElement)
            .update(pagination);
        }

        router.updatePageLinks();
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
    .on(// Product page with gallery
      "/product/:id",
      async (obj) => {
        new Catalog().mount(new Main().element);
        const data = await api.getProductById(obj.data.id);
        new BreadCrumbs().mount(new Main().element, [
          {
            text: data.category,
            href: `/category?slug=${data.category}`
          },
          {
            text: data.name,
          }
        ]);
        new ProductCard().mount(new Main().element, data);

        productSlider();
        router.updatePageLinks();
      },
      {
        leave(done) {
          new Catalog().unmount();
          new BreadCrumbs().unmount();
          new ProductCard().unmount();
          done();
        }
      })
    .on(// Cart page
      "/cart", async () => {
        const cartItems = await api.getCart();
        new Cart().mount(
          new Main().element,
          cartItems,
          'Корзина',
          'Корзина пока пуста, добавьте пожалуйста товары'
        );

        router.updatePageLinks();
      }, {
      leave(done) {
        new Cart().unmount();
        done();
      },
      already(match) {
        match.route.handler(match);
      }
    })
    .on(// Order page
      "/order/:id",
      ({ data: { id } }) => {

        api.getOrder(id).then(data => {
          new Order().mount(new Main().element, data);
        })
      }, {
      leave(done) {
        new Order().unmount();
        done();
      }
    })
    .notFound(// Page 404
      () => {
        console.log("Message in console: Page ", 404);
        new Page404().mount(new Main().element);
        setTimeout(() => {
          router.navigate('/');
        }, 5000);
      }, {
      leave(done) {
        new Page404().unmount();
        done();
      }
    }
    );

  router.resolve();

  api.getCart().then(data => {
    new Header().changeCount(data.totalCount);
  })

};

init();