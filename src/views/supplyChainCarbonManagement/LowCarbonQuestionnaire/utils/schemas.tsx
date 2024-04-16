/*
 * @@description: 低碳问卷列表搜索框
 */
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const searchSchema = (
  orgList: Org[],
  questionnaireStatusOptions?: EnumResp[],
) => ({
  type: 'object',
  properties: {
    likeQuestionnaireName: xRenderSeachSchema({
      type: 'string',
      placeholder: '问卷名称',
      widget: 'input',
    }),
    orgId: xRenderSeachSchema({
      type: 'string',
      placeholder: '所属组织',
      enum: compact(orgList.map(u => String(u.id))),
      enumNames: compact(orgList.map(u => u.orgName)),
      widget: 'select',
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
    questionnaireStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: '状态',
      widget: 'select',
      enum: compact(questionnaireStatusOptions?.map(v => String(v.code))),
      enumNames: compact(questionnaireStatusOptions?.map(v => v.name)),
      props: {
        allowClear: true,
      },
    }),
  },
});
