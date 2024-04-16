/**
 * @description 新增缺省值-核算模型
 */
import { connect, mapReadPretty } from '@formily/react';
import ModelIcon from '@views/industryCarbonAccounting/components/ModelCard/icon-model.svg';
import classNames from 'classnames';

import { IconFont } from '@/components/IconFont';

import style from './index.module.less';

type AccountingModelButtonProps = {
  /** 值 */
  value: string | number;
  /** 是否禁用 */
  disabled: boolean;
  onChange: (val: string | number) => void;
  /** options */
  options: {
    /** 值 */
    id: string | number;
    /** 模型名称 */
    businessName: string;
    /** 模型描述 */
    businessInfo: string;
  }[];
};

const AccountingModelButton = ({
  value,
  disabled,
  options,
  onChange,
}: AccountingModelButtonProps) => {
  return (
    <div className={style.modelButton}>
      {options?.map(item => (
        <div
          key={item.id}
          className={classNames(style.btnCard, {
            [style.radioChecked]: value === item.id,
            [style.radioDisabled]: disabled,
          })}
          onClick={() => {
            if (!disabled) {
              onChange(item.id);
            }
          }}
        >
          <div className={style.cardHeader}>
            <img className={style.iconLeft} src={ModelIcon} alt='' />
            <div className={style.modalName}>{item.businessName}</div>
            {value === item.id && (
              <IconFont
                icon='icon-icon-xuanzhong'
                className={style.iconChecked}
              />
            )}
          </div>
          <p className={style.outline}>{item.businessInfo}</p>
        </div>
      ))}
    </div>
  );
};

export default connect(
  AccountingModelButton,
  mapReadPretty(AccountingModelButton),
);
