/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-企业碳核算-核算结果
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-05 11:28:07
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:05:34
 */
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { differenceWith, isEqual, uniqBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import { getComputationComputationYear } from '@/sdks_v2/new/computationV2ApiDocs';
import {
  ComputationResult,
  getSupplychainDataFillComputationApplyInfoId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import CarbonAccountingResult from '@/views/supplyChainCarbonManagement/components/CarbonAccountingResult';
import Report from '@/views/supplyChainCarbonManagement/components/Report';
import { CarbonDataPropsType } from '@/views/supplyChainCarbonManagement/utils/type';

import style from '../../CarbonFootPrint/Result/index.module.less';

export type TypeEmissionStatisticDto = ComputationResult & {
  carbonEmission?: number;
};
function Result({ cathRecord }: CarbonDataPropsType) {
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 是否为未填报的页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 企业碳核算的核算结果 */
  const [computationResult, setComputationResult] =
    useState<ComputationResult>();

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 详情获取的文件列表 */
  const [fileListDetail, setFileListDetail] = useState<FileListType[]>([]);

  /** 删除的文件列表 */
  const [delFileList, setDelFileList] = useState<FileListType[]>([]);

  /** 已经填报 获取企业碳核算的核算结果详情 */
  useEffect(() => {
    if (id && !isAdd) {
      getSupplychainDataFillComputationApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const report = JSON.parse(data.data.report || '[]');
          setFileList(report);
          setFileListDetail(report);
          setComputationResult(data.data);
        }
      });
    }
  }, [id, pageTypeInfo]);

  /** 未填报时 根据核算年份自动获取碳排放明细 */
  useEffect(() => {
    if (cathRecord && cathRecord.year && isAdd) {
      getComputationComputationYear({
        year: cathRecord?.year,
      }).then(({ data }) => {
        if (data.code === 200) {
          const {
            scopeOne,
            scopeTwo,
            scopeThree,
            direct,
            energy,
            outsourcing,
            rests,
            supplyChain,
            transport,
            carbonEmission,
          } = data.data || {};

          setComputationResult({
            scopeOne,
            scopeTwo,
            scopeThree,
            direct,
            energy,
            outsourcing,
            rests,
            supplyChain,
            transport,
            total: carbonEmission,
          });
        }
      });
    }
  }, [cathRecord, pageTypeInfo]);

  /** 文件上传 */
  const changeFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const newArr: FileListType[] = [];
    info.fileList.forEach(item => {
      if (item.status === 'done' && item.originFileObj) {
        if (item.response?.code === 200) {
          const nameArr = item.name.split('.');
          newArr.push({
            suffix: nameArr[nameArr.length - 1],
            name: item.name,
            url: item.response.data.url,
            uid: item.uid,
          });
        }
      }
    });
    const allList = [
      ...uniqBy([...newArr, ...fileListDetail, ...delFileList], 'uid'),
    ];

    setFileList([
      ...differenceWith(allList, delFileList, isEqual),
    ] as FileListType[]);
  };

  /** 文件删除 */
  const onRemoveList = (item: FileListType) => {
    const arr = fileList.filter(v => v.uid !== item.uid);
    setDelFileList([...delFileList, item]);
    setFileList([...arr]);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <h4>企业碳核算结果</h4>
        <CarbonAccountingResult
          id={id}
          disabled={isDetail}
          hasAction
          fileList={fileList}
          cathRecord={cathRecord}
          computationResult={computationResult}
        />
      </div>
      <div className={style.content}>
        <h4>企业碳核算报告</h4>
        {!isDetail && (
          <p>
            支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件上传，最多10个文件，每个不超过10M
          </p>
        )}
        <Report
          fileList={fileList}
          fileType='.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf,.rar,.zip'
          maxCount={10}
          maxSize={10 * 1024 * 1024}
          errorTip='文件大小不能超过10M'
          disabled={isDetail}
          changeFileChange={changeFileChange}
          removeList={onRemoveList}
        />
      </div>
    </div>
  );
}
export default Result;
