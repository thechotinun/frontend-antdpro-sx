import request from './auth.interceptor';

export async function tablePosts(
  params: {
    current?: number | undefined;
    pageSize?: number | undefined;
  },
  sort: string | undefined,
  filter: string | undefined,
  options?: { [key: string]: any },
): Promise<Partial<API.RequestDataInterface<API.TablePosts>>> {
  return request<API.TablePosts>('/posts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
