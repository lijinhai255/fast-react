/*
 * @@description: 审核详情
 */
import { Table } from 'antd';

import style from './index.module.less';
import { processColumns, recordColumns } from './utils/columns';
import { CarbonDataPropsType } from '../../utils/type';
import TableList from '../Table';

function ApproveInfo({
  /** 审核记录数据 */
  approvalRecord,
  /** 审核流程数据 */
  approvalProcess,
}: CarbonDataPropsType) {
  return (
    <div className={style.wrapper}>
      <section className={style.content}>
        <h4>审核流程</h4>
        <Table
          columns={processColumns()}
          dataSource={approvalProcess}
          pagination={false}
        />
      </section>
      <section className={style.content}>
        <h4>审核记录</h4>
        <TableList columns={recordColumns()} dataSource={approvalRecord} />
      </section>
    </div>
  );
}
export default ApproveInfo;
