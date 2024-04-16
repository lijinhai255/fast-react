/*
 * @@description: 供应链碳管理-采购产品管理-导入
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-31 11:05:46
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-31 18:38:54
 */
import { useState } from 'react';

import { postSupplychainProductImport } from '@/sdks_v2/new/supplychainV2ApiDocs';
import { FileType } from '@/views/carbonFootPrint/utils/types';

import ImportFile from '../../components/ImportFile';

function Import() {
  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  /** 文件导入的标识 */
  const [importFlag, changeImportFlag] = useState(false);

  return (
    <ImportFile
      importType='2'
      importTypeName='采购产品'
      masterplateFile={{
        name: '采购产品导入模版.xlsx',
        url: 'https://bc-files.carbonstop.net/dct/template/tpl_import_product.xlsx',
      }}
      importFlag={importFlag}
      importBtnLoading={importBtnLoading}
      importFile={({ name, url }: FileType) => {
        setImportBtnLoading(true);
        postSupplychainProductImport({
          req: {
            fileName: name,
            fileUrl: url,
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            setImportBtnLoading(false);
            changeImportFlag(!importFlag);
          }
        });
      }}
    />
  );
}
export default Import;
