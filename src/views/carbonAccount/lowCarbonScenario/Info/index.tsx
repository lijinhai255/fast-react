/*
 * @@description: 添加、编辑、查看
 */
import {
  Cascader,
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
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact, split } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getAccountsystemSceneId,
  postAccountsystemScene,
  putAccountsystemScene,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import style from './index.module.less';
import { schemaActivity, schemaInfo } from './schemas';
import CardUpload from '../../components/CardUpload';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Radio,
    Checkbox,
    Cascader,
    NumberPicker,
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
      effects() {
        onFieldValueChange('sceneImage', (field, newForm) => {
          // console.log(field, 'field', field.value);
          // 获取Field组件实例
          if (field.value) {
            newForm?.validate('sceneImage');
          }
        });
        onFieldValueChange('sceneGraph', (field, newForm) => {
          if (field.value) {
            newForm?.validate('sceneGraph');
          }
        });
        onFieldValueChange('errPath', (field, newForm) => {
          if (field.value) {
            newForm?.validate('errPath');
          }
        });
      },
    });
  }, [pageTypeInfo, id]);

  // 获取-枚举值
  const ENUMS_SC = useAllEnumsBatch('accountSceneClassify');
  const ENUMS_ST = useAllEnumsBatch('accountSceneType');
  const ENUMS_F = useAllEnumsBatch('factorUnitM');

  useEffect(() => {
    /** 场景分类 */
    form.setFieldState('sceneClassify', {
      dataSource: ENUMS_SC?.accountSceneClassify,
    });
    /** 场景分类 */
    ENUMS_ST?.accountSceneType?.map((item: any) => {
      item.label = item.dictLabel;
      item.value = item.dictValue;
      return item;
    });
    form.setFieldState('sceneType', {
      dataSource: ENUMS_ST?.accountSceneType,
    });
    /** 活动单位 */
    form.setFieldState('sceneUnit', {
      dataSource: changeFactorM2cascaderOptions(ENUMS_F?.factorUnitM || []),
    });
  }, [ENUMS_SC, ENUMS_F, ENUMS_ST]);

  /** 场景详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getAccountsystemSceneId({ id: +id }).then(({ data }) => {
        const result = data?.data;
        form.setValues({
          ...result,
          sceneImage: JSON.parse(result.sceneImage),
          sceneGraph: JSON.parse(result.sceneGraph as string),
          errPath: JSON.parse(result.errPath as string),
          sceneUnit: split(result.sceneUnit, ',', 2),
          limitType: result.limitType === 3 ? [1, 2] : [result.limitType],
        });
      });
    }
  }, [id, pageTypeInfo]);

  return (
    <main className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <div className={style.card}>
          <h3 className={style.title}>场景信息</h3>
          <SchemaField schema={schemaInfo(pageTypeInfo!)} />
        </div>
        <div className={style.empty} />
        <div className={style.card}>
          <h3 className={style.title}>活动规则</h3>
          <SchemaField schema={schemaActivity()} />
        </div>
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
                  sceneImage: JSON.stringify(values?.sceneImage),
                  sceneGraph: JSON.stringify(values?.sceneGraph),
                  errPath: JSON.stringify(values?.errPath),
                  sceneUnit: String(values?.sceneUnit),
                  limitType:
                    values?.limitType.length === 2
                      ? 3
                      : Number(values?.limitType),
                };
                // return;
                // 新增
                if (isAdd) {
                  postAccountsystemScene({
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
                  putAccountsystemScene({
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
    </main>
  );
};

export default OrgInfo;
