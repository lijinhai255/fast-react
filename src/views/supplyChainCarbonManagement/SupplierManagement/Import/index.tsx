/*
 * @@description: 供应链碳管理-供应商管理-导入
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-31 11:05:46
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-31 18:38:40
 */
import { useState } from 'react';

import { postSupplychainSupplierImport } from '@/sdks_v2/new/supplychainV2ApiDocs';
import { FileType } from '@/views/carbonFootPrint/utils/types';

import ImportFile from '../../components/ImportFile';

function Import() {
  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  /** 文件导入的标识 */
  const [importFlag, changeImportFlag] = useState(false);

  return (
    <ImportFile
      importType='1'
      importTypeName='供应商'
      masterplateFile={{
        name: '供应商导入模版.xlsx',
        url: 'https://bc-files.carbonstop.net/dct/template/tpl_import_supplier.xlsx',
      }}
      importFlag={importFlag}
      importBtnLoading={importBtnLoading}
      importFile={({ name, url }: FileType) => {
        setImportBtnLoading(true);
        postSupplychainSupplierImport({
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
