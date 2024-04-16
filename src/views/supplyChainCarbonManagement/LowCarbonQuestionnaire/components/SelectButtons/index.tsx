/*
 * @@description: 自定义组件-题目类型按钮 选中带钩 icon可选
 */
import { Field } from '@formily/core';
import { connect, mapProps, mapReadPretty, useField } from '@formily/react';
import classNames from 'classnames';

import { IconFont } from '@/components/IconFont';
import checkedIcon from '@/image/icon-check.svg';

import styles from './index.module.less';

type SelectButtonsProps = {
  value: number | string;
  options: { value: number | string; label: number | string; icon?: string }[];
  disabled: boolean;
  onChange: (value: number | string) => void;
};
function SelectButtons({
  value,
  options,
  disabled,
  onChange,
}: SelectButtonsProps) {
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
          <span>{label}</span>
          {value === optionValue && (
            <img src={checkedIcon} alt='' className={styles.checkedIcon} />
          )}
        </div>
      ))}
    </div>
  );
}
const SelectButtonsReadPretty = (props: { value: number }) => {
  const field = useField<Field>();
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
  SelectButtons,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
  mapReadPretty(SelectButtonsReadPretty),
);
