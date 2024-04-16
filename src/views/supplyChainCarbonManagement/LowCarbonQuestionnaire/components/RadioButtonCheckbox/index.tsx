/*
 * @@description: 自定义组件-单选checkbox
 */
import { Checkbox } from '@formily/antd';
import { connect, mapProps, mapReadPretty } from '@formily/react';

import styles from './index.module.less';

type RadioButtonCheckboxProps = {
  options: { label: number | string }[];
  disabled: boolean;
  onChange: (value: boolean) => void;
};
function RadioButtonCheckbox({
  options,
  disabled,
  onChange,
}: RadioButtonCheckboxProps) {
  return (
    <div className={styles.radioGroupOptionWrapper}>
      {options.map(({ label }) => (
        <Checkbox
          onChange={e => {
            if (!disabled) {
              onChange(e.target.checked);
            }
          }}
          disabled={disabled}
        >
          <span className={styles.label}>{label}</span>
        </Checkbox>
      ))}
    </div>
  );
}
const RadioButtonCheckboxReadPretty = (props: { label: string }) => {
  const { label } = props;
  return (
    <div className={styles.readPretty}>
      <Checkbox disabled>{label || '-'}</Checkbox>
    </div>
  );
};
export default connect(
  RadioButtonCheckbox,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
  mapReadPretty(RadioButtonCheckboxReadPretty),
);
