import { RadioChangeEvent } from 'antd';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { EDIT_ENUM, REQ_ENUM, TYPES, WITHDRAW_ENUM } from './constant';
import { OnSysSetRadioChangeType } from './type';

/** 类型标识 */
const { ENTERPRISE_CARBON_ACCOUNTING, CARBON_ACCOUNTING_INDUSTRY_EDITION } =
  TYPES;
/** 修改的接口字段 */
const { DATAAUDIOLLBACK, EMISSIONSTANDARDEDIT } = REQ_ENUM;

/** 企业碳核算 */
export const ecaSchema = (onSysSetRadioChange: OnSysSetRadioChangeType) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({ columns: 1 }),
        properties: {
          dataAuditRollback: renderFormItemSchema({
            title: '排放数据审核通过后，是否可以撤回',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
              colon: false,
            },
            enum: WITHDRAW_ENUM,
            'x-component': 'Radio.Group',
            'x-component-props': {
              onChange: ({ target: { value } }: RadioChangeEvent) => {
                onSysSetRadioChange(
                  value,
                  ENTERPRISE_CARBON_ACCOUNTING,
                  DATAAUDIOLLBACK,
                );
              },
            },
          }),
          emissionStandardEdit: renderFormItemSchema({
            title: '基准年设定时，查询的核算数据，是否可以编辑',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
              colon: false,
            },
            enum: EDIT_ENUM,
            'x-component': 'Radio.Group',
            'x-component-props': {
              onChange: ({ target: { value } }: RadioChangeEvent) => {
                onSysSetRadioChange(
                  value,
                  ENTERPRISE_CARBON_ACCOUNTING,
                  EMISSIONSTANDARDEDIT,
                );
              },
            },
          }),
        },
      },
    },
  );

/** 碳核算行业版 */
export const caieSchema = (onSysSetRadioChange: OnSysSetRadioChangeType) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({ columns: 1 }),
        properties: {
          dataAuditRollback: renderFormItemSchema({
            title: '排放数据审核通过后，是否可以撤回',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
              colon: false,
            },
            enum: WITHDRAW_ENUM,
            'x-component': 'Radio.Group',
            'x-component-props': {
              onChange: ({ target: { value } }: RadioChangeEvent) => {
                onSysSetRadioChange(
                  value,
                  CARBON_ACCOUNTING_INDUSTRY_EDITION,
                  DATAAUDIOLLBACK,
                );
              },
            },
          }),
        },
      },
    },
  );
