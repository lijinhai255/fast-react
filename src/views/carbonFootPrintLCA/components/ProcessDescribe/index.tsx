/**
 * @description 过程描述
 */

import { Descriptions, Button, Typography } from 'antd';
import { useState } from 'react';

import { PageTypeInfo } from '@/router/utils/enums';

import style from './index.module.less';

const { Text } = Typography;

const { edit, show } = PageTypeInfo;

interface ProcessDescribeProps {
  /** 是否展示操作按钮 */
  showActionBtn: boolean;
  /** 是否展示保存到库的按钮 */
  showSaveToLibraryBtn: boolean;
  /** 过程描述详情信息 */
  processDescDataSource?: {
    /** 过程名称 */
    processName?: string;
    /** 系统边界 */
    systemBoundary?: string;
  };
  /** 操作按钮的方法 */
  onActionBtnClick?: (type: string) => void;
  /** 点击保存到库的方法 */
  onSaveToLibraryFn?: (successCallBack: () => void) => void;
}

const ProcessDescribe = ({
  showActionBtn = true,
  showSaveToLibraryBtn = false,
  processDescDataSource,
  onActionBtnClick,
  onSaveToLibraryFn,
}: ProcessDescribeProps) => {
  const { processName, systemBoundary } = processDescDataSource || {};
  /** 按钮loading */
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className={style.processDescribeWrapper}>
      <div className={style.headerWrapper}>
        过程描述
        {showActionBtn && (
          <div className={style.actionBtnWrapper}>
            <Button
              type='primary'
              onClick={() => {
                onActionBtnClick?.(edit);
              }}
            >
              编辑
            </Button>
            {showSaveToLibraryBtn && (
              <Button
                loading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  onSaveToLibraryFn?.(() => {
                    setBtnLoading(false);
                  });
                }}
              >
                保存到库
              </Button>
            )}
          </div>
        )}
      </div>
      <Descriptions bordered>
        <Descriptions.Item label='过程名称'>
          <Text
            className={style.name}
            ellipsis
            onClick={() => {
              onActionBtnClick?.(show);
            }}
          >
            {processName || '-'}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label='系统边界'>
          <Text className={style.systemBoundary} ellipsis>
            {systemBoundary || '-'}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
export default ProcessDescribe;
