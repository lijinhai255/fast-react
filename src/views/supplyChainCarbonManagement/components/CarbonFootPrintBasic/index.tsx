/*
 * @@description: 产品碳足迹-核算过程-基本信息
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-05 18:55:06
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 13:14:18
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  DatePicker,
  Radio,
  Cascader,
  NumberPicker,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal, Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { PictureUpload } from '@/views/carbonFootPrint/components/PictureUpload';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import style from './index.module.less';
import { Schema } from './utils/schemas';
import { useSupplyChainEnums } from '../../hooks/useEnums';
import { TypeFootprintBase } from '../../utils/type';

function CarbonFootPrintBasic({
  open,
  basicCathRecord,
  handleCancel,
}: {
  open: boolean;
  basicCathRecord?: TypeFootprintBase;
  handleCancel: () => void;
}) {
  const SchemaField = createSchemaField({
    components: {
      NumberPicker,
      Input,
      Select,
      DatePicker,
      Radio,
      Cascader,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 核算数量单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 系统边界要求枚举值  */
  const periodTypeEnums = useSupplyChainEnums('PeriodType');

  /** 上传的文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  const form = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  /** 基本信息的数据 */
  useEffect(() => {
    if (basicCathRecord && accountsUnitsList) {
      const result = basicCathRecord;
      const { technological = '', checkUnit = '' } = result || {};
      const imgList = technological
        ? technological
            .split(',')
            .filter(v => v)
            .map(v => ({ url: v }))
        : [];
      /** 系统边界图 */
      setFileList([...imgList] as FileListType[]);

      const checkUnitItem = accountsUnitsList.factorUnitM.find(
        v => v.dictLabel === checkUnit,
      );

      /** 核算单位 */
      const checkUnitBack = checkUnitItem
        ? [checkUnitItem.sourceType, checkUnitItem.dictValue]
        : undefined;

      form.setValues({
        ...basicCathRecord,
        checkUnit: checkUnitBack,
      });
    }
  }, [basicCathRecord, accountsUnitsList]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 系统边界要求  */
    if (periodTypeEnums) {
      form.setFieldState('type', {
        dataSource: periodTypeEnums.map(item => ({
          label:
            item.code === 1
              ? `${item.name}（从资源开采到产品出厂：原材料获取、生产制造、分销和储存）`
              : `${item.name} （从资源开采到产品废弃：原材料获取、生产制造、分销和储存、产品使用、废弃处置）`,
          value: item.code,
        })),
      });
    }

    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('.checkUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [periodTypeEnums, accountsUnitsList]);

  return (
    <Modal
      centered
      title='基本信息'
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
      <div className={style.content_wrapper}>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={Schema()} />
        </Form>
        <div className={style.content_wrapper_picture}>
          <p>系统边界图（碳足迹报告用图）:</p>
          <PictureUpload
            disabled
            accept='.png, .PNG, .jpg, .JPG,.jpeg, .JPEG, .gif, .GIF'
            maxCount={5}
            maxSize={5 * 1024 * 1024}
            errorSizeTips='最大支持5M的图片'
            fileType={[
              'png',
              'PNG',
              'jpg',
              'JPG',
              'jpeg',
              'JPEG',
              'gif',
              'GIF',
            ]}
            fileList={fileList}
          />
        </div>
      </div>
    </Modal>
  );
}
export default CarbonFootPrintBasic;
