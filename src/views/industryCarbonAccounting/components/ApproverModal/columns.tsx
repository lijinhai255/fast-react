import { TableRenderProps } from 'table-render/dist/src/types';

import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';

export const columns = (): TableRenderProps<ImportLog>['columns'] => [
  {
    title: '姓名',
    dataIndex: 'realName',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
];
