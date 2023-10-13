import axios from 'axios';
import { API_URL, limitDefault } from "../const";
import { AccessKeyService } from './LocalStorageService';

export class ApiService {
  #apiURL = API_URL;

  constructor() {
    this.accesKeyService = new AccessKeyService('accessKey');
    this.accessKey = this.accesKeyService.get();

    console.log('accessKey:', this.accessKey);
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

      // console.log("response.data =", response.data);

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        this.accesKeyService.delete();

        return this.getData(urlPathName, params);
      } else {
        console.log("Error: ", error);
      }
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

  async getCart() {
    return await this.getData('api/cart');
  }

}