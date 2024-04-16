/*
 * @@description: 产品碳足迹-碳足迹报告-详情-数据质量评价-表格弹窗
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-07 15:05:58
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 14:14:01
 */
import { Modal, Button, Table } from 'antd';

import style from './index.module.less';
import { factorData } from './utils';
import { activityDataColums } from './utils/columns';
import { activityDataSource } from './utils/const';
import { FactorDataProps } from './utils/types';

/** 数据质量评价-活动数据弹窗 */
export const ActivityDataModal = ({
  isModalOpen,
  handleCancel,
}: {
  isModalOpen: boolean;
  handleCancel: () => void;
}) => {
  return (
    <Modal
      title='活动数据质量评级标准'
      open={isModalOpen}
      width={600}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          关闭
        </Button>,
      ]}
    >
      <Table
        bordered
        columns={activityDataColums}
        dataSource={activityDataSource}
        pagination={false}
      />
    </Modal>
  );
};

/** 数据质量评价-排放因子弹窗 */
export const FactorDataModal = ({
  isModalOpen,
  handleCancel,
}: {
  isModalOpen: boolean;
  handleCancel: () => void;
}) => {
  return (
    <Modal
      title='排放因子数据质量评级标准'
      width={600}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          关闭
        </Button>,
      ]}
    >
      <div className={style.factorModalTableWrapper}>
        {factorData.map((item: FactorDataProps) => {
          return (
            <div key={item.title}>
              <h4>{item.title}</h4>
              <Table
                bordered
                columns={item.columns}
                dataSource={item.dataSource}
                pagination={false}
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
