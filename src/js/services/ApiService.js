import axios from 'axios';
import { API_URL, limitDefault } from "../const";

export class apiService {
  #apiURL = API_URL;

  constructor() {
    this.accessKey = localStorage.getItem('accessKey');
    console.log("this.accessKey: ", this.accessKey);
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        // const url = new URL(this.#apiURL);
        // url.pathname = '/api/users/accessKey';

        const response = await axios.get(`${this.#apiURL}api/users/accessKey`);
        this.accessKey = response.data.accessKey;
        localStorage.setItem('accessKey', this.accessKey);
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
      // const url = new URL(this.#apiURL);
      // url.pathname = urlPathName;
      // console.log("url: ", url.href)

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
        localStorage.removeItem('accessKey');

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
}