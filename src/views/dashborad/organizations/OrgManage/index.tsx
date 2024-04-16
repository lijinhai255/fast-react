/*
 * @@description: 组织管理
 */
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { getSystemOrgTree, Org, OrgTree } from '@/sdks/systemV2ApiDocs';
import { RootState } from '@/store/types';
import { changeTableColumsNoText } from '@/utils';

import style from './index.module.less';
import { columns, dictSearchSchema } from './utils/columns';

const OrgTreeManage = () => {
  const { refresh } = useTable();

  const userInfo = useSelector<RootState, RootState['userInfo']>(
    s => s.userInfo,
  );

  const searchApi: SearchProps<Org>['api'] = () => {
    return getSystemOrgTree({
      userId: userInfo.userId,
    }).then(({ data }) => {
      const result = data?.data || {};
      return {
        rows: result?.tree || [],
        total: result?.tree?.length || 0,
      };
    });
  };
  const navigate = useNavigate();

  return (
    <Page title='组织管理' wrapperClass={style.wrapper}>
      <TableRender<OrgTree>
        searchProps={{
          hidden: true,
          schema: dictSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...columns({ refresh, navigate })],
            '-',
          ),
          expandRowByClick: true,
          expandable: {
            rowExpandable: record => {
              return !!record.children?.length;
            },
            // eslint-disable-next-line react/no-unstable-nested-components
            expandIcon: ({ expanded, record }) => {
              return record.children ? (
                expanded ? (
                  <DownOutlined className={style.orgGroupIcon} />
                ) : (
                  <RightOutlined className={style.orgGroupIcon} />
                )
              ) : (
                ''
              );
            },
          },
          rowKey: 'code',
          pagination: false,
        }}
      />
    </Page>
  );
};

export default withTable(OrgTreeManage);
