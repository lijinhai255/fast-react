/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-10 15:02:24
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTi me: 2023-03-10 15:16:39
 */
import { connect, mapProps, mapReadPretty, useField } from '@formily/react';
import classNames from 'classnames';

import { IconFont } from '@/components/IconFont';

import styles from './index.module.less';

type FormilyButtonSelectProps = {
  value: number | string;
  options: { value: number | string; label: number | string; icon?: string }[];
  disabled: boolean;
  onChange: (value: number | string) => void;
};
function FormilyRadioButton({
  value,
  options,
  disabled,
  onChange,
}: FormilyButtonSelectProps) {
  return (
    <div className={styles.radioGroupOptionWrapper}>
      {options.map(({ value: optionValue, label, icon }) => (
        <div
          className={classNames(styles.normalRadioButton, {
            [styles.radioChecked]: value === optionValue,
            [styles.radioDisabled]: disabled,
          })}
          key={optionValue}
          onClick={() => {
            if (!disabled) {
              onChange(optionValue);
            }
          }}
        >
          {icon && <IconFont className={styles.icon} icon={icon} />}
          <p className={styles.label}>{label}</p>
          {value === optionValue && (
            <IconFont
              className={styles.checkedIcon}
              icon='icon-icon-chenggong1'
            />
          )}
        </div>
      ))}
    </div>
  );
}
const FormilyButtonSelectReadPretty = (props: { value: number }) => {
  const field = useField<any>();
  const options = field.dataSource
    ? (field.dataSource as { label: string; value: number; icon: string }[])
    : [];
  const selectedItem = options.find(option => option.value === props.value);
  return (
    <div className={styles.readPretty}>
      {selectedItem?.icon && (
        <IconFont className={styles.icon} icon={selectedItem?.icon || ''} />
      )}
      {selectedItem?.label ? <span>{selectedItem.label}</span> : '-'}
    </div>
  );
};
export default connect(
  FormilyRadioButton,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
  mapReadPretty(FormilyButtonSelectReadPretty),
);
