/*
 * @description:选择排放因子(用到的模块 排放源库、排放数据填报)
 */

import { searchSchema } from '@views/Factors/utils/schemas';
import { columns } from '@views/eca/emissionManage/Info/utils/factorColumns';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTable, withTable } from 'table-render';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  Factor,
  getSystemFactorPageProps as SearchApiProps,
  getSystemFactorPage,
} from '@/sdks/systemV2ApiDocs';
import { getSearchParams } from '@/utils';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import { ParamsProp } from './type';

const ChooseFactor = ({
  onDetailClick,
  onConfirmClick,
  onCancelClick,
}: {
  onDetailClick?: (data: Factor) => void;
  onConfirmClick?: (data: ParamsProp) => void;
  onCancelClick?: (data: ParamsProp) => void;
}) => {
  const { form } = useTable();
  const search = { ...getSearchParams()[0] };
  const formValues = JSON.parse(search[CHOOSE_FACTOR.FORM_VALUES] || '{}');
  const likeName = search?.likeName;

  // 选择selectKey
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const searchApi: CustomSearchProps<Factor, SearchApiProps> = args => {
    return getSystemFactorPage({ ...args, status: '0' }).then(({ data }) => {
      const result = data?.data || {};
      setSelectedRowKeys([result?.list?.[0]?.id || 0]);
      return {
        ...result,
        rows: result?.list || [],
        total: result.total || 0,
      };
    });
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: {
    selectedRowKeys: React.Key[];
    type: 'radio';
    onChange: (newSelectedRowKeys: React.Key[]) => void;
  } = {
    selectedRowKeys,
    type: 'radio',
    onChange: onSelectChange,
  };
  useEffect(() => {
    form.setValues({
      likeName,
    });
  }, []);
  return (
    <Page title='排放因子'>
      <TableRender<Factor, SearchApiProps>
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({ onDetailClick }),
          scroll: { x: 1200, y: 600 },
          rowSelection,
        }}
        autoAddIndexColumn
        autoFixNoText
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '保存',
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              onConfirmClick?.({
                [CHOOSE_FACTOR.FORM_VALUES]: formValues,
                [CHOOSE_FACTOR.FACTOR_ID]: selectedRowKeys[0],
              });
            },
          },
          {
            title: '取消',
            onClick: async () => {
              onCancelClick?.({
                [CHOOSE_FACTOR.FORM_VALUES]: formValues,
              });
            },
          },
        ])}
      />
    </Page>
  );
};

export default withTable(ChooseFactor);
