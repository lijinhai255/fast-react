import { ProFormInstance } from '@ant-design/pro-components';
import { AxiosResponse } from 'axios';
import html2canvas from 'html2canvas';
import { debounce } from 'lodash-es';
import { useRef } from 'react';

import { Toast } from '@/utils';

import { BUTTON } from './constant';

/** echarts图片下载方法 */
export const useDownloadHandler = (fileName: () => string, id: string) => {
  const handleDownload = useRef(
    debounce(() => {
      const element = document.getElementById(id);
      if (element) {
        html2canvas(element, { scale: 2 })
          .then(canvas => {
            // 将Canvas转换为图像URL
            const imageURL = canvas.toDataURL('image/png');
            // 创建一个隐藏的<a>标签，并设置下载属性
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = `${fileName?.()}.png`;
            // 模拟点击链接以触发下载
            link.click();
          })
          .catch(() => {
            Toast('error', '下载失败');
          });
      }
    }, 500),
  ).current;

  return handleDownload;
};

/**
 * @description 获取图片下载名
 * @param orgName 组织名称
 * @param searchForm 表单
 * @param typeName 图片类型名称
 * @param isSingleYear 是否是一个年份
 * @param noStandardType 是否没有核算标准GHG/ISO
 * @returns 图片文件名称
 */
export const generateImgName = (
  orgName: string,
  searchForm: React.MutableRefObject<ProFormInstance | undefined>,
  typeName: string,
  isSingleYear?: boolean,
  noStandardType?: boolean,
) => {
  const values = searchForm.current?.getFieldsFormatValue?.();
  const { standardAllType, standardType, startYear, endYear, year } = values;
  let imgName = `${typeName}`;
  let imgYear = '';
  if (standardAllType === BUTTON.GHG || standardType === BUTTON.GHG) {
    imgName = `GHG${typeName}`;
  }
  if (standardAllType === BUTTON.ISO || standardType === BUTTON.ISO) {
    imgName = `ISO${typeName}`;
  }
  if (noStandardType) {
    imgName = `${typeName}`;
  }
  if (!isSingleYear && startYear && endYear) {
    imgYear = `${startYear}年至${endYear}年`;
  }
  if (isSingleYear && year) {
    imgYear = `${year}年`;
  }
  return `${orgName}${imgYear}${imgName}`;
};

/** 合并单元格 */
export const getMergeData = (data: any[], mergeNameArray: string[]) => {
  mergeNameArray?.forEach(mergeName => {
    let count = 0;
    let indexCount = 1;
    while (indexCount < data.length) {
      const currentItem = data[count];
      const nextItem = data[indexCount];

      if (!currentItem[`${mergeName}RowSpan`]) {
        currentItem[`${mergeName}RowSpan`] = 1;
      }

      if (currentItem[mergeName] === nextItem[mergeName]) {
        currentItem[`${mergeName}RowSpan`]++;
        nextItem[`${mergeName}RowSpan`] = 0;
      } else {
        count = indexCount;
      }

      indexCount++;
    }
  });
  return data;
};

/** 解析Content-Disposition字段以获取文件名 */
export const downloadFile = (
  response: unknown,
  res: AxiosResponse,
  fileNameValue?: string,
) => {
  try {
    const disposition = res.headers['content-disposition'];
    const fileName = decodeURI(disposition?.split('filename=')?.[1] || '');
    const url = URL.createObjectURL(response as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileNameValue || fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    Toast('error', '文件下载失败');
  }
};
