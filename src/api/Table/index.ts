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

export const aiHardNumberFn = (data: any) => {
  return request<{ data: string; code: number }>({
    url: 'https://aiopen.zhongzaiyuntu.com/rest/v1/hard_number',
    method: 'POST',
    data,
  });
};
