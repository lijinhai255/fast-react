/*
 * @@description: 产品碳足迹-碳足迹核算-核算模型-导入历史文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-20 14:48:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-22 19:25:35
 */
import { useParams } from 'react-router-dom';

import ImportFile from '../../../components/ImportFile';

function Import() {
  /** 碳足迹核算id */
  const { modelId } = useParams<{ modelId: string }>();
  return (
    <ImportFile
      modelFileType='01'
      modelType='2'
      productionBusinessId={modelId}
    />
  );
}
export default Import;
