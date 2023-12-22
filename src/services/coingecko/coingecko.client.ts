import axios from 'axios';

export class CoingeckoClient {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  dataCache = {};

  async get<T>(endpoint: string): Promise<T> {
    console.log(endpoint, this.dataCache);

    if (!this.dataCache[endpoint]) {
      const { data } = await axios.get(this.baseUrl + endpoint);
      this.dataCache[endpoint] = data;
      return data;
    }

    return this.dataCache[endpoint];
  }
}

export const coingeckoClient = new CoingeckoClient();
