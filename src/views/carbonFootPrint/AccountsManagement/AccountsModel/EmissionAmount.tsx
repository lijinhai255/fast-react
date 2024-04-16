/*
 * @@description:  产品碳足迹-碳足迹核算-核算模型列表-数量列
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-16 23:35:09
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 13:10:21
 */
import { Col, InputNumber, Row } from 'antd';

import { ProductionMaterials } from '@/sdks/footprintV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { RegAccountValue } from '../utils/index';

function EmissionAmount({
  disabled,
  item,
  updateEmissionAmount,
}: {
  /** 表单是否禁用 */
  disabled: boolean;
  /** 表格数据当前项 */
  item: ProductionMaterials;
  /** 更改表单输入值 */
  updateEmissionAmount?: (data: ProductionMaterials) => void;
}) {
  const { formula, maMeasure, weight, distance, materialsType } = item;
  const formulaBack = materialsType === '运输' ? formula : undefined;
  switch (Number(formulaBack)) {
    /** 按里程-产品重量 */
    case 1:
      return (
        <Row>
          <Col span={8}>
            <InputNumber
              style={{
                width: '100%',
              }}
              disabled={disabled}
              onBlur={event => {
                const { value } = event.target;
                const errorText = RegAccountValue(value);
                if (errorText) {
                  Toast('error', errorText);
                  return;
                }
                updateEmissionAmount?.({
                  ...item,
                  weight: Number(value),
                });
              }}
              value={weight}
              placeholder='重量'
            />
          </Col>
          <Col className={style.emissionAmountUnitCol} span={3} offset={1}>
            {maMeasure}
          </Col>
          <Col span={8}>
            <InputNumber
              style={{
                width: '100%',
              }}
              disabled={disabled}
              onBlur={event => {
                const { value } = event.target;
                const errorText = RegAccountValue(value);
                if (errorText) {
                  Toast('error', errorText);
                  return;
                }
                updateEmissionAmount?.({
                  ...item,
                  distance: Number(value),
                });
              }}
              value={distance}
              placeholder='运输里程'
            />
          </Col>
          <Col className={style.emissionAmountUnitCol} span={3} offset={1}>
            公里
          </Col>
        </Row>
      );
    /** 按里程-载重比 */
    case 2:
      return (
        <Row>
          <Col span={8}>
            <InputNumber
              style={{
                width: '100%',
              }}
              disabled={disabled}
              onBlur={event => {
                const { value } = event.target;
                const errorText = RegAccountValue(value);
                if (errorText) {
                  Toast('error', errorText);
                  return;
                }

                updateEmissionAmount?.({
                  ...item,
                  weight: Number(value),
                });
              }}
              value={weight}
              placeholder='载重比'
            />
          </Col>
          <Col className={style.emissionAmountUnitCol} span={3} offset={1}>
            %
          </Col>
          <Col span={8}>
            <InputNumber
              style={{
                width: '100%',
              }}
              disabled={disabled}
              onBlur={event => {
                const { value } = event.target;
                const errorText = RegAccountValue(value);
                if (errorText) {
                  Toast('error', errorText);
                  return;
                }
                updateEmissionAmount?.({
                  ...item,
                  distance: Number(value),
                });
              }}
              value={distance}
              placeholder='运输里程'
            />
          </Col>
          <Col className={style.emissionAmountUnitCol} span={3} offset={1}>
            公里
          </Col>
        </Row>
      );
    default:
      return (
        <Row>
          <Col span={20}>
            <InputNumber
              style={{
                width: '100%',
              }}
              disabled={disabled}
              onBlur={event => {
                const { value } = event.target;
                const errorText = RegAccountValue(value);
                if (errorText) {
                  Toast('error', errorText);
                  return;
                }
                updateEmissionAmount?.({
                  ...item,
                  weight: Number(value),
                });
              }}
              value={weight}
              placeholder='数量'
            />
          </Col>
          <Col className={style.emissionAmountUnitCol} offset={1} span={3}>
            {maMeasure}
          </Col>
        </Row>
      );
  }
}
export default EmissionAmount;
