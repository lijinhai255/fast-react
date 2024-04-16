/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 18:15:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-24 19:00:54
 */
import { compact } from 'lodash-es';
import { ReactNode } from 'react';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';

import style from './index.module.less';
import CommonHeader from '../CommonHeader';

function ManagementPage({
  basicInfo,
  actionBtnChild,
  rightRender,
  children,
  onBtnClick,
}: {
  onBtnClick: () => Promise<void> | void;
  /** 表格上方展示的信息 */
  basicInfo?: { [key: string]: string | number | undefined };
  /** 按钮节点 */
  actionBtnChild?: ReactNode;
  /** 额外的dom节点 */
  rightRender?: ReactNode;
  /** 子节点 */
  children?: ReactNode;
}) {
  return (
    <main className={style.managementListWrapper}>
      <Page
        wrapperClass={style.managementListPageWrapper}
        title={
          <div className={style.headerWrapper}>
            <CommonHeader basicInfo={basicInfo} />
          </div>
        }
        onBtnClick={async () => {
          onBtnClick?.();
        }}
        actionBtnChild={actionBtnChild}
        rightRender={rightRender}
      >
        {children && <div className={style.tableWrapper}>{children}</div>}
      </Page>

      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </main>
  );
}
export default ManagementPage;
