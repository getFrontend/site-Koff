import axios from 'axios';
import { API_URL, limitDefault } from "../const";
import { AccessKeyService } from './LocalStorageService';

export class ApiService {
  #apiURL = API_URL;

  constructor() {
    this.accesKeyService = new AccessKeyService('accessKey');
    this.accessKey = this.accesKeyService.get();
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        const response = await axios.get(`${this.#apiURL}api/users/accessKey`);

        this.accessKey = response.data.accessKey;
        this.accesKeyService.set(this.accessKey);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }


  async getData(urlPathName, params = {}) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }
    try {
      const response = await axios.get(`${this.#apiURL}${urlPathName}`, {
        headers: {
          Authorization: `Bearer ${this.accessKey}`,
        },
        params
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        this.accesKeyService.delete();
        return this.getData(urlPathName, params);
      } else if (error.response.status === 500) {
        return this.getData(urlPathName, params);
      }
      console.log("Error: ", error);
    }
  }

  async getProducts(params) {
    return await this.getData('api/products', params);
  }

  async getProductCategories() {
    return await this.getData('api/productCategories');
  }

  async getProductById(id) {
    return await this.getData(`api/products/${id}`);
  }

  async postProductToCart(productId, quantity = 1) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }

    try {
      const response = await axios.post(
        `${this.#apiURL}api/cart/products`,
        {
          productId,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        this.AccessKeyService.delete();
      }
      console.error(error);
    }
  }

  async updateQuantityProductsInCart(productId, quantity) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }

    try {
      const response = await axios.put(
        `${this.#apiURL}api/cart/products`,
        {
          productId,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        this.AccessKeyService.delete();
      }
      console.error(error);
    }
  }

  async getCart() {
    return await this.getData('api/cart');
  }

  async removeProductFromCart(id) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }

    try {
      const response = await axios.delete(
        `${this.#apiURL}api/cart/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        this.AccessKeyService.delete();
      }
      console.error(error);
    }
  }

  async postOrder(data) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }

    try {
      const response = await axios.post(
        `${this.#apiURL}api/orders`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.accessKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        this.AccessKeyService.delete();
      }
      console.error(error);
    }
  }

  async getOrder(id) {
    return await this.getData(`api/orders/${id}`);
  }

}