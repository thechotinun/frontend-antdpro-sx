import request from './auth.interceptor';

export async function tablePosts(
  params: {
    page?: number;
    limit?: number;
    title?: string;
    postedBy?: string;
    tags?: string | string[];
    postedAt?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.TablePosts>('/posts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function dataPost(id?: number, options?: { [key: string]: any }) {
  return request<API.TablePosts>(`/posts/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
