/*
 * @@description:数据字典 分类
 */

import { PlusOutlined } from '@ant-design/icons';
import { Form, FormItem, FormLayout, Input, NumberPicker } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { isBoolean } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  DictTypeResp,
  getSystemDictdataPage,
  getSystemDictdataPageProps,
  getSystemDicttypePage,
  postSystemDictdataAdd,
  postSystemDictdataEdit,
} from '@/sdks/systemV2ApiDocs';
import {
  Toast,
  changeTableColumsNoText,
  getSearchParams,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import style from './index.module.less';
import { dictAddSchema, dictColumns, dictSearchSchema } from './utils/columns';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormLayout,
    NumberPicker,
  },
});

const DictType = () => {
  const [searchParams, setSearchParams] = useState<
    Record<string, string | number>
  >(getSearchParams()[0]);
  const { id: dictType } = useParams<{ id: string }>();
  const { form, refresh } = useTable();
  const modalForm = useMemo(createForm, []);
  // 编辑时存放id，其它时候是boolean
  const [isModalVisible, setIsModalVisible] = useState<
    string | number | boolean
  >();
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // table 标题 - 字典名称
  const [dict, setDict] = useState<DictTypeResp>();
  useEffect(() => {
    getSystemDicttypePage({
      dictType,
      pageNum: 1,
      pageSize: 1,
      dictName: '',
    }).then(({ data }) => {
      setDict(data?.data?.list?.[0]);
    });
  }, [dictType]);
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
      dictType,
    } as getSystemDictdataPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
        dictType,
      } as getSystemDictdataPageProps;
      updateUrl(args);
    } else {
      form.setValues({ ...newSearch });
    }
    setSearchParams({ ...args, pageNum });
    isFirstLoad.current = false;
    return getSystemDictdataPage(newSearch).then(({ data }) => {
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
    modalForm.setFieldState('dictValue', {
      editable: true,
    });
  };
  return (
    <Page
      title=''
      wrapperClass={style.wrapper}
      actionBtnChild={
        <div className={style.headerAction}>
          <PlusOutlined /> 新增
        </div>
      }
      onBtnClick={async () => {
        setIsModalVisible(true);
      }}
    >
      <TableRender
        searchProps={{
          schema: dictSearchSchema(),
          className: style.search,
          api: searchApi,
        }}
        tableProps={{
          headerTitle: (
            <div className={style.title}>
              <span>字典名称：{dict?.dictName}</span>
              <span>字典标识：{dictType}</span>
            </div>
          ),
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...dictColumns({
                onEdit: async row => {
                  setIsModalVisible(row.id as number);
                  // 字典标识不能修改
                  const setFormValue = () => {
                    modalForm.setValues(row);
                    modalForm.setFieldState('dictValue', {
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
            '-',
          ),
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
        width={440}
        maskClosable={false}
        title={`${isBoolean(isModalVisible) ? '新增' : '编辑'}分类`}
        okText='保存'
        onOk={async () => {
          modalForm.submit(values => {
            if (typeof isModalVisible === 'boolean') {
              return postSystemDictdataAdd({
                req: { ...values, dictType },
              }).then(({ data }) => {
                if (data?.code === 200) {
                  Toast('success', '新增分类成功');
                  modalClose();
                }
              });
            }
            return postSystemDictdataEdit({
              req: { ...values, id: isModalVisible },
            }).then(({ data }) => {
              if (data?.code === 200) {
                Toast('success', '编辑分类成功');
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
      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => history.back(),
          },
        ]}
      />
    </Page>
  );
};

export default withTable(DictType);
