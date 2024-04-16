/**
 * @description 排放数据内容
 */
import classNames from 'classnames';
import { useState } from 'react';

import CommonHeader from '@/components/CommonHeader';

import { CLASSIFY_TYPE } from './constant';
import style from './index.module.less';
import {
  ClassifyProps,
  CycleDetailInfoType,
  HeaderBasicInfoType,
} from '../../utils/type';
import ClassificationTree from '../ClassificationTree';
import EmissionData from '../EmissionData';
import SupportFiles from '../SupportFiles';

const { EMISSION, PRODUCTION_DATA, SUPPORT_FILE } = CLASSIFY_TYPE;

const AccountingCycle = ({
  isViewMode,
  tendId,
  headerBasicInfo,
  cycleDetailInfo,
}: {
  /** 是否为详情查看模式 */
  isViewMode: boolean;
  /** 核算周期Id */
  tendId?: number;
  /** 排放数据列表头部展示的信息 */
  headerBasicInfo?: HeaderBasicInfoType;
  /** 核算周期详情展示的信息 */
  cycleDetailInfo?: CycleDetailInfoType;
}) => {
  /** 当前选中的分类项 */
  const [currentClassifyItem, setCurrentClassifyItem] =
    useState<ClassifyProps>();
  const { classifyId, classifyType, key } = currentClassifyItem || {};
  const classifyTypeValue = Number(classifyType);

  return (
    <div className={style.wrapper}>
      <div className={style.left}>
        <ClassificationTree
          tentId={tendId}
          currentClassifyId={key}
          onSelect={(selectedItem?: ClassifyProps) => {
            setCurrentClassifyItem(selectedItem);
          }}
        />
      </div>
      <div className={style.right}>
        {/* 列表上方展示的基本信息 */}
        {classifyId && (
          <div
            className={classNames(style.headerInfoWrapper, {
              [style.headerInfoViewWrapper]: isViewMode,
            })}
          >
            <CommonHeader
              wrapperClass={style.headerInfoWrapper}
              basicInfo={headerBasicInfo}
            />
          </div>
        )}
        {/* 排放数据列表 */}
        <div
          className={classNames({
            [style.listViewWrapper]: isViewMode,
            [style.supportFilesListWrapper]:
              !isViewMode && classifyTypeValue === SUPPORT_FILE,
          })}
        >
          {/* 排放源或者生产数据 */}
          {(classifyTypeValue === EMISSION ||
            classifyTypeValue === PRODUCTION_DATA) && (
            <EmissionData
              isViewMode={isViewMode}
              tenetId={tendId}
              selectedClassifyItem={{
                ...currentClassifyItem,
                orgId: cycleDetailInfo?.orgId,
                collectTime: cycleDetailInfo?.collectTime,
                accountYear: cycleDetailInfo?.accountYear,
              }}
            />
          )}

          {/* 支撑材料 */}
          {classifyTypeValue === SUPPORT_FILE && (
            <SupportFiles
              isViewMode={isViewMode}
              selectedClassifyItem={{
                ...currentClassifyItem,
                orgId: cycleDetailInfo?.orgId,
                collectTime: cycleDetailInfo?.collectTime,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default AccountingCycle;
