/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-企业碳核算
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-02 18:37:44
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:13:39
 */
import { CarbonDataPropsType } from '@/views/supplyChainCarbonManagement/utils/type';

import Process from './Process';
import Result from './Result';

function CarbonAccounting({ applyType, cathRecord }: CarbonDataPropsType) {
  /** 是否为核算结果 */
  const isResult = Number(applyType) === 1;
  return (
    <div>
      {isResult ? (
        /** 结果 */
        <Result cathRecord={cathRecord} />
      ) : (
        /** 过程 */
        <Process cathRecord={cathRecord} />
      )}
    </div>
  );
}
export default CarbonAccounting;
