/*
 * @description: 默认题目列表表头
 */

import { TableRenderProps } from 'table-render/dist/src/types';

import { Tags } from '@/components/Tags';
import { QuestionnaireQuestion } from '@/sdks_v2/new/supplychainV2ApiDocs';

import style from '../index.module.less';

export const columns =
  (): TableRenderProps<QuestionnaireQuestion>['columns'] => [
    {
      title: '序号',
      dataIndex: 'px',
      fixed: 'left',
      width: 35,
      render: (_t: any, _: unknown, index: number) => {
        return index + 1;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (value, row) => {
        const { required } = row;
        if (value && required) {
          return (
            <span>
              <span className={style.requiredStar}>*</span>
              {value}
            </span>
          );
        }
        return value;
      },
    },
    {
      title: '题型',
      dataIndex: 'questionType_name',
      fixed: 'right',
      width: 98,
      render: value => {
        return (
          <Tags
            className='customTag'
            kind='raduis'
            color='green'
            tagText={value}
          />
        );
      },
    },
  ];
