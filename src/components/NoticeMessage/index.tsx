/*
 * @@description: 消息通知 下拉内容
 */

import { Empty, Radio } from 'antd';
import classNames from 'classnames';

import { Msg } from '@/sdks_v2/new/systemV2ApiDocs';

import style from './index.module.less';

export const DropdownMessage = (props: {
  message: Msg[];
  onClickFn: (item: Msg) => void;
  allReadFn: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  showAllFn: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  // 这里可以根据originNode来渲染下拉菜单内容
  const { message, onClickFn, allReadFn, showAllFn } = props;
  return (
    <div className={style.wrapper}>
      {/* 下拉菜单内容 */}
      <h5>消息中心</h5>
      {message.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      {message.map(item => (
        <div
          onClick={() => {
            onClickFn(item);
          }}
          className={classNames(style.messageList, {
            [style.messageList_noClick]: !item?.readFlag,
          })}
          key={`${item.id}-${item.readFlag}-${item.createTime}`}
        >
          <p
            className={classNames(style.messageTitle, {
              [style.messageTitle_noClick]: !item?.readFlag,
            })}
          >
            {item.content}
          </p>
          <span>{`${item?.createTime}` || '-'}</span>
        </div>
      ))}
      {message.length !== 0 && (
        <Radio.Group value='1'>
          <Radio.Button
            value='large'
            onClick={e => {
              allReadFn(e);
            }}
          >
            全部已读
          </Radio.Button>
          <Radio.Button
            value='default'
            onClick={e => {
              showAllFn(e);
            }}
          >
            查看更多
          </Radio.Button>
        </Radio.Group>
      )}
    </div>
  );
};
