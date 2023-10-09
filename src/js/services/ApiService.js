import axios from 'axios';
import { API_URL, limitDefault } from "../const";
import { LocalStorageService } from './LocalStorageService';

export class apiService {
  #apiURL = API_URL;

  constructor() {
    this.storage = new LocalStorageService();
    this.accessKey = this.storage.get('accessKey');

    console.log('accessKey:', this.accessKey);
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        const response = await axios.get(`${this.#apiURL}api/users/accessKey`);

        this.accessKey = response.data.accessKey;
        this.storage.set('accessKey', this.accessKey);
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
        this.storage.delete('accessKey');
        // localStorage.removeItem('accessKey');

        return this.getData(urlPathName, params);
      } else {
        console.log("Error: ", error);
      }
    }
  }

  async getProducts(page = 1, limit = limitDefault, list, category, search) {
    return await this.getData('api/products', {
      page,
      limit,
      category,
      list,
      search,
    });
  }

  async getProductCategories() {
    return await this.getData('api/productCategories');
  }

  async getProductById(id) {
    return await this.getData(`api/products/${id}`);
  }

  async getCart() {
    return await this.getData('api/cart');
  }

}