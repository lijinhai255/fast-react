/*
 * @@description: 添加、编辑、查看
 */
import {
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact, isEmpty, join, map, split } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getAccountsystemGoodsId,
  postAccountsystemGoods,
  putAccountsystemGoods,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

import { schema } from './schemas';
import CardUpload from '../../components/CardUpload';
import { UseGroup } from '../../hooks';
import style from '../index.module.less';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Radio,
    NumberPicker,
    Checkbox,
    CardUpload,
    FormGrid,
    FormLayout,
  },
});
const OrgInfo = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;
  /** 是否为编辑页面 */
  const isEdit = pageTypeInfo === PageTypeInfo.edit;

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      // effects() {
      //   onFieldValueChange('materialsTypeFormula', field => {
      //     console.log(field, 'field', field.value);
      //         form.setFieldState('limitNum', state => {
      //           console.log(state, 'state');
      //           // 对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
      //           state.display = field.value;
      //         });
      //   });
      // },
    });
  }, [pageTypeInfo, id]);

  // 获取-枚举值
  const groupData = UseGroup();

  useEffect(() => {
    /** 投放渠道 */
    form.setFieldState('deptId', { dataSource: groupData });
  }, [groupData]);

  /** 场景详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getAccountsystemGoodsId({ id: +id }).then(({ data }) => {
        const result = data?.data;
        const ary =
          !isEmpty(result.deptId) && result.deptId
            ? split(String(result.deptId), ',')
            : undefined;
        const deptIdData = isEdit ? map(ary, Number) : [result.deptName];
        form.setValues({
          ...result,
          imgPath: result.imgPath && [
            { url: result.imgPath, uid: 1, name: '商品图' },
          ],
          deptId: deptIdData,
        });
      });
    }
  }, [id, pageTypeInfo]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit(values => {
                // console.log(values?.limitType, values?.limitType.length);
                const submitVals = {
                  ...values,
                  // imgPath: JSON.stringify(values?.imgPath),
                  imgPath: values?.imgPath?.[0]?.url,
                  deptId: values.deptId && join(values.deptId, ','),
                };
                // return;
                // 新增
                if (isAdd) {
                  postAccountsystemGoods({
                    ro: submitVals,
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      Toast('success', '新增成功');
                      history.back();
                    }
                  });
                }
                // 修改
                if (isEdit) {
                  putAccountsystemGoods({
                    ro: { ...submitVals, id },
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      Toast('success', '修改成功');
                      history.back();
                    }
                  });
                }
              });
            },
          },
          {
            title: PageTypeInfo.show !== pageTypeInfo ? '取消' : '返回',
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;
