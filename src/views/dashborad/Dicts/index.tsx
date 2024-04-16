/*
 * @@description:数据字典
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:15:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-24 19:04:21
 */

import { PlusOutlined } from '@ant-design/icons';
import { Form, FormItem, FormLayout, Input } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { isBoolean } from 'lodash-es';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import {
  DictTypeResp,
  getSystemDicttypePage,
  getSystemDicttypePageProps,
  postSystemDicttypeAdd,
  postSystemDicttypeEdit,
} from '@/sdks/systemV2ApiDocs';
import { Toast, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { dictAddSchema, dictColumns, dictSearchSchema } from './utils/columns';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormLayout,
  },
});

const Dict = () => {
  const [searchParams, setSearchParams] = useState<
    Record<string, string | number>
  >(getSearchParams()[0]);
  const { form, refresh } = useTable();
  const navigate = useNavigate();
  const modalForm = useMemo(createForm, []);
  // 编辑时存放id，其它时候是boolean
  const [isModalVisible, setIsModalVisible] = useState<
    string | number | boolean
  >();
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  const searchApi: SearchProps<DictTypeResp>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum: number =
      (isFirstLoad.current ? Number(searchParams.pageNum) : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getSystemDicttypePageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getSystemDicttypePageProps;
      updateUrl(newSearch);
    } else {
      form.setValues({ ...newSearch });
    }
    setSearchParams({ ...args, pageNum });
    isFirstLoad.current = false;
    return getSystemDicttypePage(newSearch).then(({ data }) => {
      return {
        rows: data?.data?.list || [],
        total: data?.data?.total || 0,
      };
    });
  };
  const modalClose = (isRefresh?: boolean) => {
    if (isRefresh !== false) refresh?.();
    setIsModalVisible(false);
    modalForm.reset();
    modalForm.setFieldState('dictType', {
      editable: true,
    });
  };
  return (
    <Page
      title='数据字典'
      onBtnClick={async () => {
        setIsModalVisible(true);
      }}
      actionBtnChild={checkAuth(
        '/sys/dicttype/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender
        searchProps={{
          schema: dictSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: [
            ...indexColumn,
            ...dictColumns({
              navigate,
              onEdit: async row => {
                setIsModalVisible(row.id);
                // 字典标识不能修改
                const setFormValue = () => {
                  modalForm.setValues(row);
                  modalForm.setFieldState('dictType', {
                    editable: false,
                  });
                };
                // 第一次
                modalForm.onMount = () => {
                  setFormValue();
                };
                setFormValue();
              },
            }),
          ],
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
        }}
      />
      <Modal
        open={!!isModalVisible}
        maskClosable={false}
        width={440}
        title={`${isBoolean(isModalVisible) ? '新增' : '编辑'}字典`}
        okText='保存'
        onOk={async () => {
          modalForm.submit(values => {
            if (typeof isModalVisible === 'boolean') {
              return postSystemDicttypeAdd({ req: values }).then(({ data }) => {
                if (data?.code === 200) {
                  Toast('success', '新增字典成功');
                  modalClose();
                }
              });
            }
            return postSystemDicttypeEdit({
              req: { ...values, id: isModalVisible },
            }).then(({ data }) => {
              if (data?.code === 200) {
                Toast('success', '编辑字典成功');
                modalClose();
              }
            });
          });
        }}
        onCancel={() => modalClose(false)}
      >
        <Form form={modalForm}>
          <SchemaField schema={dictAddSchema()} />
        </Form>
      </Modal>
    </Page>
  );
};

export default withTable(Dict);
