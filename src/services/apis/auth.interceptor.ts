/**
 * request api : https://github.com/umijs/umi-request
 */
import { history } from '@umijs/max';
import { notification } from 'antd';
import Cookies from 'js-cookie';
import { extend } from 'umi-request';

const codeMessage: { [key: number]: string } = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'The requested resource could not be found',
  406: 'Not Acceptable',
  410: 'The requested resource is permanently deleted and will not be retrieved.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred on the server.',
  502: 'Gateway Error',
  503: 'Service is unavailable, server is temporarily overloaded or maintained',
  504: 'Gateway Timeout',
};

const loginPath = '/user/login';

const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (status === 401) {
      notification.error({
        message: `Request error ${status}: ${url}`,
        description: 'Invalid Token',
      });
    } else {
      notification.error({
        message: `Request error ${status}: ${url}`,
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: 'Cannot connect to the server',
      message: 'Network Error',
    });
  }
  history.push(loginPath);
  return response;
};

const request = extend({
  prefix: 'http://localhost:3100/api/v1',
  errorHandler,
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
