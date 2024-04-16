import { request } from '../request';

export const getTransLate = (data: {
  text: string;
  from: string;
  to: string;
}) => {
  return request<{ data: string; code: number }>({
    url: '/textTranslate',
    method: 'get',
    params: data,
  });
};
