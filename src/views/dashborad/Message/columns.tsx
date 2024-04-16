import classNames from 'classnames';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { msgClickFn, getUnreadNumFn } from '@/store/action/noticeAction';

import Style from './index.module.less';

export const columns = (
  refresh:
    | ((
        params?: { stay: boolean; tab: string | number } | undefined,
        search?: any,
      ) => Promise<void>)
    | undefined,
): TableRenderProps['columns'] => {
  return [
    {
      title: '所属模块',
      dataIndex: 'bizModule_name',
      ellipsis: true,
      width: 180,
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      render: (text, record) => {
        return (
          <span
            className={classNames(Style.text, {
              [Style.noClick]: !record.readFlag,
            })}
            onClick={() => {
              msgClickFn(
                record,
                () => {
                  getUnreadNumFn();
                },
                () => {
                  refresh?.({ stay: false, tab: 0 });
                },
              );
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
  ];
};

export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {},
});
