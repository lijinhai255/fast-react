/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-13 17:49:37
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-21 11:35:30
 */
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';

import { getComputationComputationOrgEmissionListId } from '@/sdks/Newcomputation/computationV2ApiDocs';
import { Computation } from '@/sdks/computation/computationV2ApiDocs';

const columns = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    render: (orgName: string) => {
      return orgName || '-';
    },
  },
  {
    title: '核算年度',
    dataIndex: 'year',
    render: (year: string) => {
      return year || '-';
    },
  },
  {
    title: '排放量（tCO₂e）',
    dataIndex: 'carbonEmission',
    render: (carbonEmission: string) => {
      return carbonEmission || '-';
    },
  },
];

export const EmissionListModel = ({
  open,
  onOk,
  onCancel,
  catchRecord,
}: {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
  catchRecord: Computation;
}) => {
  const [dataSource, getDataSource] = useState<Computation[]>([]);
  const emissionListFn = async () => {
    await getComputationComputationOrgEmissionListId({
      id: catchRecord?.id || 0,
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data.data || [])]);
      }
    });
  };
  useEffect(() => {
    if (open) {
      emissionListFn();
    }
  }, [open]);
  return (
    <Modal
      centered
      title='组织排放量列表'
      open={open}
      maskClosable={false}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      closable
      width={600}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ height: '300px' }}
        scroll={{ y: 300 }}
      />
    </Modal>
  );
};
