/*
 * @@description: 碳足迹核算-核算模型-排放源-选择排放因子schema文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 22:27:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 11:56:25
 */

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { publishYear } from '@/views/Factors/utils';

/** 碳足迹核算-核算模型详情-选择排放因子-搜索schema */
export const selectEmissionFactorSearchSchema = () => ({
  type: 'object',
  properties: {
    likeName: xRenderSeachSchema({
      type: 'string',
      placeholder: '名称',
      widget: 'input',
      props: {},
    }),
    year: xRenderSeachSchema({
      type: 'number',
      placeholder: '发布年份',
      enum: publishYear(),
      widget: 'select',
    }),
    likeInstitution: xRenderSeachSchema({
      type: 'string',
      placeholder: '发布机构',
      widget: 'input',
    }),
    likeDescription: xRenderSeachSchema({
      type: 'string',
      placeholder: '适用场景',
      widget: 'input',
    }),
  },
});
