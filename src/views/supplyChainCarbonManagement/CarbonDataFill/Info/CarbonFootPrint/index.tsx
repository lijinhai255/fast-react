/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-产品碳足迹
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-02 18:19:20
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:14:18
 */
import { CarbonDataPropsType } from '@/views/supplyChainCarbonManagement/utils/type';

import Process from './Process';
import Result from './Result';

function CarbonFootPrint({ applyType, cathRecord }: CarbonDataPropsType) {
  /** 是否为核算结果 */
  const isResult = Number(applyType) === 1;

  return (
    <div>
      {isResult ? (
        <Result cathRecord={cathRecord} />
      ) : (
        <Process cathRecord={cathRecord} />
      )}
    </div>
  );
}
export default CarbonFootPrint;
