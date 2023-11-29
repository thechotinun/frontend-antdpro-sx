import { axiosInterceptor } from './auth.interceptor';

export const login = (reqBody: APIs.LoginParams) => {
  return axiosInterceptor.post(`${REACT_APP_API}/backend/auth/login`, reqBody);
};
