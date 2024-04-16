/**
 * @description 可以将输入内容保留在输入框的select
 */
import { connect, mapProps, mapReadPretty, useField } from '@formily/react';
import { Select } from 'antd';

export type OptionsProps = { label: string; value: string | number }[];

const FormilySearchInsertSelect = ({
  value,
  options,
  onSearch,
  ...props
}: {
  value: string;
  options: OptionsProps;
  onSearch: (value: string) => void;
}) => {
  return (
    <Select
      {...props}
      value={value}
      options={options}
      defaultActiveFirstOption={false}
      onSearch={searchValue => {
        const item = options.find(v => v.label === searchValue);
        if (searchValue && !item) {
          onSearch(searchValue);
        }
      }}
    />
  );
};

const FormilySearchInsertSelectReadPretty = ({ value }: { value: string }) => {
  const field = useField<any>();

  const options = field.dataSource ? (field.dataSource as OptionsProps[]) : [];

  return (
    <Select
      value={value}
      bordered={false}
      disabled
      options={options}
      suffixIcon=''
    />
  );
};

export default connect(
  FormilySearchInsertSelect,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
  mapReadPretty(FormilySearchInsertSelectReadPretty),
);
