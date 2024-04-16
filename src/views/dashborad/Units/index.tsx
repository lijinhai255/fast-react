/*
 * @@description: 单位换算
 */
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  FormItem,
  FormLayout,
  NumberPicker,
  Select,
} from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import {
  getSystemLibUnitPage,
  getSystemLibUnitPageProps,
  OperLog,
  postSystemLibUnitAdd,
  postSystemLibUnitDelete,
  postSystemLibUnitEdit,
} from '@/sdks/systemV2ApiDocs';
import {
  changeTableColumsNoText,
  getSearchParams,
  returnDelModalStyle,
  returnNoIconModalStyle,
  Toast,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import style from './index.module.less';
import { columns } from './utils/columns';
import { modalSchema, searchSchema } from './utils/schemas';
import { SearchParamses } from './utils/types';
import { useGetDict } from '../Dicts/hooks';

const SchemaProvider = createSchemaField({
  components: { Select, NumberPicker, FormLayout, FormItem },
});
const Dict = () => {
  const modalForm = useMemo(() => createForm(), []);
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });
  const units = useGetDict('factorUnitM');

  //   add/edit modal
  const [addModal, setAddModal] = useState<boolean | number>();

  const { form, refresh } = useTable();
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);

  const searchApi: SearchProps<OperLog>['api'] = ({ current, ...args }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;
    const time = JSON.parse(getSearchParams()[0]?.time || '[]').map(
      (t: string) => t,
    );

    const search = {
      ...getSearchParams()[0],
      time,
    } as Partial<SearchParamses>;
    let newSearch = { ...args, ...search };
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        moduleType: form.getValues().moduleType,
      };
      updateUrl(newSearch);
    } else {
      form.setValues({ ...search });
    }
    setSearchParams({ ...newSearch, current: newSearch.current || 1 });

    isFirstLoad.current = false;
    let searchVals = {
      ...newSearch,
      pageNum: current,
    } as unknown as getSystemLibUnitPageProps;
    if (newSearch?.time?.length) {
      searchVals = {
        ...searchVals,
      };
    }

    return getSystemLibUnitPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return { ...result, rows: result?.list || [], total: result.total || 0 };
    });
  };
  const effectElementPath = '*(unitFrom,unitTo)';
  const setUnitOptions = (type?: string) => {
    if (!type) return;
    modalForm.setFieldState(effectElementPath, {
      dataSource: units.enums
        .filter(u => u.sourceType === type)
        .map(v => ({ label: v.dictLabel, value: `${v.dictValue}` })),
    });
  };
  const addTypeChangeEffectId = 'unitClassEffect123';
  const addTypeChangeEffect = () => {
    modalForm.addEffects(addTypeChangeEffectId, () => {
      onFieldValueChange('unitClass', field => {
        const { value } = field;
        if (value) {
          modalForm.reset(effectElementPath);
          setUnitOptions(value);
        }
      });
    });
  };

  // modal 设置枚举值
  useEffect(() => {
    if (units.enums.length) {
      modalForm.setFieldState('unitClass', {
        dataSource: units.type.map(u => ({
          label: u.dictLabel,
          value: `${u.dictValue}`,
        })),
      });
    }
  }, [units]);

  const closeModal = (isRefresh?: boolean) => {
    modalForm.removeEffects(addTypeChangeEffectId);
    modalForm.reset();
    setAddModal(false);
    if (isRefresh) refresh?.();
  };
  return (
    <Page
      title='单位换算'
      actionBtnChild={checkAuth(
        '/sys/units/add',
        <>
          <PlusOutlined /> 新增
        </>,
      )}
      onBtnClick={async () => {
        setAddModal(true);
        addTypeChangeEffect();
      }}
    >
      <TableRender
        searchProps={{
          schema: searchSchema(units),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...columns(
                units,
                row => {
                  const unit1 = units.enums.find(
                    u => u.dictValue === String(row.unitFrom),
                  )?.dictLabel;
                  const unit2 = units.enums.find(
                    u => u.dictValue === String(row.unitTo),
                  )?.dictLabel;
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该单位换算关系：
                        <span className={style.warnText}>
                          {unit1}/{unit2}
                        </span>
                      </>
                    ),
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    onOk: async () => {
                      if (row.id)
                        postSystemLibUnitDelete({
                          req: { id: row.id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            refresh?.();
                            Toast('success', '删除成功');
                          }
                        });
                    },
                  });
                },
                row => {
                  setAddModal(row.id);
                  setUnitOptions(`${row.unitClass ?? ''}`);
                  const value = {
                    id: row.id,
                    unitClass: `${row.unitClass ?? ''}`,
                    unitFrom: `${row.unitFrom ?? ''}`,
                    unitTo: `${row.unitTo ?? ''}`,
                    unitValue: row.unitValue,
                  };
                  modalForm.setValues(value);
                  addTypeChangeEffect();
                },
              ),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.current ? +searchParams.current : undefined,
            size: 'default',
          },
        }}
      />
      <Modal
        open={!!addModal}
        maskClosable={false}
        centered
        onCancel={() => closeModal()}
        okText='保存'
        onOk={async () => {
          return modalForm.submit(values => {
            if (typeof addModal === 'boolean') {
              return postSystemLibUnitAdd({ req: values }).then(({ data }) => {
                if (data?.code === 200) {
                  Toast('success', '新增成功');
                  closeModal(true);
                }
              });
            }
            return postSystemLibUnitEdit({
              req: { ...values, id: addModal },
            }).then(({ data }) => {
              if (data?.code === 200) {
                Toast('success', '编辑成功');
                closeModal(true);
                modalForm.removeEffects(addTypeChangeEffectId);
                modalForm.reset();
                setAddModal(false);
              }
            });
          });
        }}
      >
        <Form form={modalForm}>
          <SchemaProvider schema={modalSchema()} />
        </Form>
      </Modal>
    </Page>
  );
};

export default withTable(Dict);
