import request from './auth.interceptor';

export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.TablePosts;
  }>('/posts', {
    method: 'GET',
    ...(options || {}),
  });
}
