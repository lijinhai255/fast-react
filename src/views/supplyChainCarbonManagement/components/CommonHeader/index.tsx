/*
 * @@description: 头部展示的信息
 */
import { Typography } from 'antd';
import classNames from 'classnames';

import style from './index.module.less';

const { Text } = Typography;

function CommonHeader({
  wrapperClass,
  basicInfo,
}: {
  wrapperClass?: string;
  basicInfo?: { [key: string]: string | number | undefined };
}) {
  return (
    <main className={classNames(style.commonHeaderWrapper, wrapperClass)}>
      {basicInfo &&
        Object.keys(basicInfo).map(key => {
          return (
            <p className={style.contentItem} key={key}>
              <span className={style.label}>{key}: </span>
              <Text
                className={style.text}
                ellipsis={{ tooltip: basicInfo[key] }}
              >
                {basicInfo[key] || '-'}
              </Text>
            </p>
          );
        })}
    </main>
  );
}
export default CommonHeader;
