/**
 * @description 因子数据库详情
 */

import { IconFont } from '@/components/IconFont';

import style from './index.module.less';
import { FactorResp } from './type';

const FactorDatabase = ({ factorInfo }: { factorInfo?: FactorResp }) => {
  const {
    name,
    dataSource,
    productName,
    productInfo,
    productCarbonFootprint,
    factorUnitZ,
    productUnitName,
    systemBoundary,
    timeRepresent,
    areaRepresentName,
    techRepresent,
  } = factorInfo || {};

  return (
    <div className={style.wrap}>
      <div className={style.container}>
        <div className={style.factorTitle}>
          <span className={style.titleMain}>
            <IconFont className={style.icon} icon='icon-paifangyinziku' />
            <span className={style.title}>{name || '-'}</span>
          </span>
          <span className={style.source}>数据来源：{dataSource || '-'}</span>
        </div>
        <div className={style.factorDetailWrap}>
          <div className={style.nameMain}>
            <p className={style.value}>{productName || '-'}</p>
            <p className={style.tag}>{productInfo || '-'}</p>
          </div>
          <div className={style.contentMain}>
            <div className={style.section}>
              <p className={style.value}>
                {factorUnitZ
                  ? `${productCarbonFootprint}${factorUnitZ}`
                  : `${productCarbonFootprint}`}
              </p>
              <p className={style.tag}>产品碳足迹</p>
            </div>
            <div className={style.section}>
              <p className={style.value}>{productUnitName || '-'}</p>
              <p className={style.tag}>产品单位</p>
            </div>
            <div className={style.section}>
              <p className={style.value}>{systemBoundary || '-'}</p>
              <p className={style.tag}>系统边界</p>
            </div>
          </div>
        </div>
        <div className={style.otherWrap}>
          <p className={style.info}>时间代表性：{timeRepresent || '-'}</p>
          <p className={style.info}>地理代表性：{areaRepresentName || '-'}</p>
          <p className={style.info}>技术代表性：{techRepresent || '-'}</p>
        </div>
      </div>
    </div>
  );
};
export default FactorDatabase;
