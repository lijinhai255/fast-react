/*
 * @@description: 待审核人列表
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-16 09:44:52
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 16:12:36
 */
import {
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
} from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Modal, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';
import {
  AuditUserDto,
  getComputationAuditUserPage,
  postComputationAuditAudit,
  postComputationReportGenerate,
} from '@/sdks/Newcomputation/computationV2ApiDocs';

import { TextArea } from '../component/TextArea';
import { TextAreaMaxLength500 } from '../util/type';

const columns = [
  {
    title: '姓名',
    dataIndex: 'realName',
  },
  {
    title: '所属公司',
    dataIndex: 'orgName',
  },
];
export const PendReviewModal = ({
  open,
  handleCancel,
  id,
}: {
  open: boolean;
  handleCancel: () => void;
  id: number;
}) => {
  const [dataSource, getDataSource] = useState<AuditUserDto[]>([]);
  const [pageParams, changePageParams] = useState({
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState(0);
  // user/page
  const getUserPage = async () => {
    await getComputationAuditUserPage({
      ...pageParams,
      id,
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data?.data?.list || [])]);
        setTotal(data?.data?.total || 0);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getUserPage();
    }
  }, [id, pageParams]);

  // 获取待审核人列表
  return (
    <Modal
      centered
      title='待审核人'
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          关闭
        </Button>,
      ]}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: pageParams.pageSize,
          current: pageParams.pageNum,
          total,
          onChange: (pageNum, pageSize) => {
            changePageParams({
              pageNum,
              pageSize,
            });
          },
          showSizeChanger: false,
        }}
      />
    </Modal>
  );
};
export const ApproveUserList = ({ id }: { id: number }) => {
  const [dataSource, getDataSource] = useState<AuditUserDto[]>([]);
  const [pageParams, changePageParams] = useState({
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState(0);
  // user/page
  const getUserPage = async () => {
    await getComputationAuditUserPage({
      ...pageParams,
      id,
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data?.data?.list || [])]);
        setTotal(data?.data?.total || 0);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getUserPage();
    }
  }, [id, pageParams]);
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{
        pageSize: pageParams.pageSize,
        current: pageParams.pageNum,
        total,
        onChange: (pageNum, pageSize) => {
          changePageParams({
            pageNum,
            pageSize,
          });
        },
        showSizeChanger: false,
      }}
    />
  );
};

export const AuditModal = ({
  open,
  handleCancel,
  handleOk,
  id,
}: {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  id: number;
}) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      FormLayout,
      Radio,
      Input,
      TextArea,
    },
  });

  const form = useMemo(() => {
    return createForm({
      initialValues: {},
      effects() {
        onFieldValueChange('auditStatus', () => {
          form.setFieldState('auditComment', {
            value: null,
          });
        });
      },
    });
  }, [id]);
  return (
    <Modal
      centered
      title='审核'
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          取消
        </Button>,
        <Button
          onClick={async () => {
            form.submit(async value => {
              await postComputationAuditAudit({
                req: {
                  ...value,
                  auditDataId: id,
                },
              }).then(({ data }) => {
                if (data.code === 200) {
                  handleOk();
                }
              });
            });
          }}
          type='primary'
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={{
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  layout: 'vertical',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      rowGap: 2,
                      maxColumns: 1,
                      minColumns: 1,
                    },
                    properties: {
                      auditStatus: {
                        type: 'string',
                        title: '审核结果',
                        'x-validator': [
                          { required: true, message: '请选择审核结果' },
                        ],
                        'x-decorator': 'FormItem',
                        'x-component': 'Radio.Group',
                        enum: [
                          {
                            label: '审核通过',
                            value: '1',
                          },
                          {
                            label: '审核不通过',
                            value: '2',
                          },
                        ],
                        'x-component-props': {
                          onChange: (e: { target: { value: string } }) => {
                            // 获取Field组件实例
                            if (e.target.value === '1') {
                              form?.validate('auditComment');
                            }
                          },
                        },
                      },
                      auditComment: {
                        type: 'string',
                        title: '备注',
                        'x-decorator': 'FormItem',
                        'x-component': 'TextArea',
                        'x-component-props': {
                          placeholder: '请输入',
                          maxLength: TextAreaMaxLength500,
                        },
                        'x-reactions': {
                          dependencies: ['auditStatus'],
                          when: `{{$deps[0]==='2'}}`,
                          fulfill: {
                            schema: {
                              'x-validator': [
                                { required: true, message: '请输入备注' },
                              ],
                            },
                          },
                          otherwise: {
                            state: {
                              required: false,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
        />
      </Form>
    </Modal>
  );
};

// 生成报告
export const ReportModal = ({
  open,
  handleCancel,
  handleOk,
  id,
}: {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  id: number;
}) => {
  const navigate = useNavigate();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      FormLayout,
      Checkbox,
      Input,
      TextArea,
    },
  });
  const form = useMemo(() => {
    return createForm({
      initialValues: {
        reportTypeList: ['1'],
      },
      effects() {},
    });
  }, [id]);
  return (
    <Modal
      centered
      title='生成报告'
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          关闭
        </Button>,
        <Button
          onClick={async () => {
            form.submit(async value => {
              await postComputationReportGenerate({
                // @ts-ignore
                req: {
                  ...value,
                  reportId: id,
                },
              }).then(({ data }) => {
                if (data.code === 200) {
                  handleOk();
                  Modal.confirm({
                    centered: true,
                    title: '生成报告',
                    className: 'modal_del',
                    content:
                      '生成报告任务已创建，点击“确定”跳转到“下载管理”中下载',
                    onOk: async () => {
                      navigate(RouteMaps.systemDownload);
                    },
                  });
                }
              });
            });
          }}
          type='primary'
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={{
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  layout: 'vertical',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      rowGap: 2,
                      maxColumns: 1,
                      minColumns: 1,
                    },
                    properties: {
                      reportTypeList: {
                        type: 'string',
                        title: '报告版本',
                        'x-validator': [
                          { required: true, message: '请选择报告版本' },
                        ],
                        'x-decorator': 'FormItem',
                        'x-component': 'Checkbox.Group',
                        enum: [
                          {
                            label: 'GHG Protocol版',
                            value: '1',
                          },
                          {
                            label: 'ISO 14064-1:2018版',
                            value: '2',
                          },
                        ],
                        'x-component-props': {},
                      },
                    },
                  },
                },
              },
            },
          }}
        />
      </Form>
    </Modal>
  );
};
