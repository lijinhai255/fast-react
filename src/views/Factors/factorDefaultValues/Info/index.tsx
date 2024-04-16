/**
 * @description 缺省值管理/详情
 */
import {
  ArrayTable,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd';
import { Field, createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact, forIn, zipObject, zipWith } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { RouteMaps } from '@/router/utils/enums';
import {
  DefaultValueDto,
  DefaultValueInsert,
  getEnterprisesystemSysDefaultYearId,
  putEnterprisesystemDefaultYear,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { getSystemDictenumListAllByDictTypeBatch } from '@/sdks_v2/new/systemV2ApiDocs';
import { Toast } from '@/utils';

import { DEFAULTVALUE_TYPE } from './constant';
import style from './index.module.less';
import { inputSchema, tableSchema } from './schemas';
import { EnumType, EnumsAllType } from './types';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    NumberPicker,
    Radio,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    ArrayTable,
  },
});

const FactorDefaultValuesInfo = () => {
  const navigate = useNavigate();

  const { isDetail, id } = usePageInfo();

  const [loading, setLoading] = useState(false);

  const [currentYear, setCurrentYear] = useState('');
  const [currentBusinessName, setCurrentBusinessName] = useState<string>();

  /** 数据类型 */
  const { INPUT, TABLE } = DEFAULTVALUE_TYPE;

  /** 缺省值数据 */
  const [defaultValueList, setDefaultValueList] = useState<DefaultValueDto[]>(
    [],
  );

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  /** 获取下拉框的枚举值 */
  const useAsyncDataSource = (dataType: string) => async (field: Field) => {
    const { data }: EnumsAllType =
      await getSystemDictenumListAllByDictTypeBatch({
        dictTypes: dataType,
      });
    const unitEnum: EnumType[] = data?.data[dataType];
    const unitEnums = unitEnum?.map((e: EnumType) => ({
      label: e.dictLabel,
      value: e.dictValue,
    }));
    field.setDataSource(unitEnums);
  };

  /** 获取缺省值详情 */
  useEffect(() => {
    if (id) {
      getEnterprisesystemSysDefaultYearId({ id }).then(({ data }) => {
        const { year, businessName } = data.data;
        setCurrentYear(year);
        setCurrentBusinessName(businessName);
        setDefaultValueList(data.data.defaultValueList || []);
      });
    }
  }, [id]);

  /** 保存 */
  const sumbitFn = () => {
    form.submit(async values => {
      setLoading(true);
      let resultValues: DefaultValueInsert[] = [];
      defaultValueList?.forEach(item => {
        forIn(values, (value, key) => {
          if (`id${item.id}` === key) {
            if (item.type === TABLE) {
              const fields = item.fields || [];
              /** 第一列的ID */
              const headColId = fields[0].id;
              /** 单元格id */
              const idArr: number[] = [];
              item.defaultValues?.forEach(tableData => {
                tableData.defaultValueList?.forEach(rowVal =>
                  idArr.push(Number(rowVal.id)),
                );
              });
              /** 单元格值 */
              const valueArr: string[] = [];
              value?.forEach((rowValue: unknown) => {
                forIn(rowValue, (v, k) => {
                  /** 去掉第一列的值 */
                  if (k !== `${headColId}id`) {
                    valueArr.push(v);
                  }
                });
              });
              /** 处理成[{id:1,value:'2'}...] */
              const tableResult = zipWith(idArr, valueArr, (resId, resValue) =>
                zipObject(['id', 'value'], [resId, resValue]),
              ) as unknown as DefaultValueInsert[];
              resultValues = [...resultValues, ...tableResult];
            } else {
              /** input类型 */
              resultValues.push({
                id: Number(item.id),
                value,
              });
            }
          }
        });
      });
      const { data } = await putEnterprisesystemDefaultYear({
        ro: resultValues,
      });
      if (data.data) {
        Toast('success', '保存成功');
        navigate(RouteMaps.factorDefaultValues);
        setLoading(false);
      } else {
        Toast('error', data?.msg);
        setLoading(false);
      }
    });
  };

  return (
    <main className={style.infoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.schemas_card}>
          <div className={style.header}>
            <span>
              核算年度：
              <span className={style.headerValue}>{currentYear}年</span>
            </span>
            <span>
              核算模型：
              <span className={style.headerValue}>{currentBusinessName}</span>
            </span>
          </div>
          {defaultValueList?.map(item => {
            if (item.type === INPUT) {
              return <SchemaField schema={inputSchema(item)} key={item.id} />;
            }
            if (item.type === TABLE) {
              return (
                <SchemaField
                  schema={tableSchema(item, isDetail)}
                  key={item.id}
                  scope={{ useAsyncDataSource }}
                />
              );
            }
            return '';
          })}
        </section>
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            loading,
            onClick: async () => {
              sumbitFn();
            },
          },
          {
            title: isDetail ? '返回' : '取消',
            onClick: async () => {
              navigate(RouteMaps.factorDefaultValues);
            },
          },
        ])}
      />
    </main>
  );
};
export default FactorDefaultValuesInfo;
