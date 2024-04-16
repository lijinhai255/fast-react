/*
 * @@description:
 */
import { Modal, Table } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import {
  ControlPlanProduct,
  getComputationControlPlanProductListControlPlanId,
  postComputationControlPlanProductDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  Toast,
  changeTableColumsNoText,
  returnDelModalStyle,
  returnNoIconModalStyle,
} from '@/utils';

import { ProductModel } from '../../utils/model';

type TypeControlPlanProduct = Omit<ControlPlanProduct, 'serviceUnit'> & {
  serviceUnit?: string[];
};
export const TableThree = () => {
  //  当前状态  ADD SHOW COPY
  const [status, setStatus] = useState<
    'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL'
  >('ADD');
  // 控制计划弹窗显隐
  const [visable, changeVisAble] = useState(false);
  /** 用于缓存record**/
  const [cathRecord, getCathRecord] = useState<TypeControlPlanProduct>({});
  const [dataSource, getDataSource] = useState<ControlPlanProduct[]>([]);
  const controlPlanId = new URLSearchParams(location.search).get('id') || '';

  // 获取主营产品-列表
  const productListFn = async () => {
    await getComputationControlPlanProductListControlPlanId({
      controlPlanId: Number(controlPlanId),
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data.data || [])]);
      }
      // console.log(data);
    });
  };
  useEffect(() => {
    productListFn();
  }, []);
  return (
    <>
      <Page
        title=''
        onBtnClick={async () => {
          setStatus('ADD');
          changeVisAble(true);
          getCathRecord({});
        }}
        actionBtnChild={
          window.location.pathname.indexOf('edit') >= 0 && <div>新增</div>
        }
      >
        <Table<ControlPlanProduct>
          columns={changeTableColumsNoText(
            [
              {
                title: '序号',
                dataIndex: 'name',
                render: (_, __, index) => {
                  return index + 1;
                },
              },
              {
                title: '产品或服务名称',
                dataIndex: 'serviceName',
              },
              {
                title: '产品或服务单位',
                dataIndex: 'serviceUnitName',
              },
              {
                title: '产品或服务单位描述',
                dataIndex: 'serviceDesc',
                width: 220,
              },
              {
                title: '操作',
                dataIndex: 'address',
                render: (_, record) => {
                  return (
                    <TableActions
                      menus={compact([
                        window.location.pathname.indexOf('show') === -1 && {
                          label: '编辑',
                          key: '编辑',
                          onClick: async ev => {
                            setStatus('EDIT');
                            ev.stopPropagation();
                            changeVisAble(true);
                            getCathRecord({
                              ...record,
                              serviceUnit: record?.serviceUnit?.split(','),
                            });
                          },
                        },
                        window.location.pathname.indexOf('show') === -1 && {
                          label: '删除',
                          key: '删除',
                          onClick: async ev => {
                            ev?.stopPropagation();
                            Modal.confirm({
                              title: '提示',
                              ...returnNoIconModalStyle,
                              ...returnDelModalStyle,
                              content: (
                                <span>
                                  确认删除该产品或服务：
                                  <span className='modal_text'>
                                    {record?.serviceName}?
                                  </span>
                                </span>
                              ),
                              onOk: () => {
                                return postComputationControlPlanProductDelete({
                                  req: { id: Number(record?.id) },
                                }).then(({ data }) => {
                                  if (data.code === 200) {
                                    Toast('success', '删除成功');
                                    productListFn?.();
                                  }
                                });
                              },
                            });
                          },
                        },
                        {
                          label: '查看',
                          key: '查看',
                          onClick: async ev => {
                            setStatus('SHOW');
                            ev.stopPropagation();
                            changeVisAble(true);
                            getCathRecord({
                              ...record,
                              serviceUnit: record?.serviceUnit?.split(','),
                            });
                          },
                        },
                      ])}
                    />
                  );
                },
              },
            ],
            '-',
          )}
          dataSource={[...dataSource]}
        />
      </Page>
      {/* 主营产品弹窗 */}
      <ProductModel
        status={status}
        visable={visable}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          productListFn?.();
        }}
        initValue={cathRecord}
      />
    </>
  );
};
