import axios, { AxiosInstance } from 'axios';

type JiraQueryHeaders = {
  'Authorization': `Bearer ${string}`,
  'Accept': 'application/json',
}

type JiraAuthHeaders = {
  'Content-Type': 'application/json'
}

type Headers = JiraAuthHeaders | JiraQueryHeaders

type ClientConfig = {
  baseURL: string,
  timeout?: number,
  headers: Headers,
}

const createApiClient = (config: ClientConfig): AxiosInstance => axios.create(config);

export default createApiClient;
