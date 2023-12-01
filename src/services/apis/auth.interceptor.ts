/**
 * request api : https://github.com/umijs/umi-request
 */
import Cookies from 'js-cookie';
import { extend } from 'umi-request';

const errorHandler = (error: any) => {
  const { response } = error;
  return response;
};

const request = extend({
  prefix: 'http://localhost:3100/api/v1',
  errorHandler,
  // credentials: '',
});

function getToken() {
  return Cookies.get('token-user');
}

request.interceptors.request.use((url: string, options: RequestInit) => {
  const headersInit: HeadersInit = {};
  options.headers = headersInit;

  const token = getToken();

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  options.headers = {
    ...options.headers,
  };

  return {
    url: `${url}`,
    options: {
      ...options,
      interceptors: true,
    },
  };
});

export default request;
