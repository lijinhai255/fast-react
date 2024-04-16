import { DatePicker } from '@formily/antd';
// import { DatePicker } from 'antd';
// import locale from 'antd/es/date-picker/locale/zh_CN';
// import zhCN from 'antd/es/locale/zh_CN';
// import ConfigProvider from 'antd/lib/config-provider';
import { DatePickerProps as AntdDatePickerProps } from 'antd/lib/date-picker';
import { PropsWithChildren } from 'react';

import { AntProvider } from '../AntdProvider';

export const ZnDatePicker = (
  props: JSX.IntrinsicAttributes & PropsWithChildren<AntdDatePickerProps>,
) => {
  return (
    <AntProvider>
      <DatePicker {...props} />
    </AntProvider>
  );
};
