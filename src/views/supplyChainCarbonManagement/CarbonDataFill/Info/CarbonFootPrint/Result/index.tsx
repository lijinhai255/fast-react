/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-产品碳足迹-核算结果
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-02 18:20:47
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:11:16
 */

import { Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { differenceWith, isEqual, uniqBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  FootprintResult,
  getSupplychainDataFillFootprintApplyInfoId,
  getSupplychainDataFillFootprintStatisticApplyInfoIdProductionBusinessId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { updateUrl } from '@/utils';
import LocalStore from '@/utils/store';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import CarbonFootPrintResult from '@/views/supplyChainCarbonManagement/components/CarbonFootPrintResult';
import Report from '@/views/supplyChainCarbonManagement/components/Report';
import { SELECT_BACK_KEY } from '@/views/supplyChainCarbonManagement/utils';
import {
  CarbonDataPropsType,
  TypeFootprintResult,
} from '@/views/supplyChainCarbonManagement/utils/type';

import style from './index.module.less';

function Result({ cathRecord }: CarbonDataPropsType) {
  const navigate = useNavigate();

  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 选择核算产品确定后返回的信息 */
  const selectBackData = LocalStore.getValue<{
    productionBusinessId: number;
    currentTab: string;
  }>(SELECT_BACK_KEY);
  const productionBusinessId = selectBackData?.productionBusinessId;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 核算结果 */
  const [footprintResult, setFootprintResult] = useState<FootprintResult>();

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 详情获取的文件列表 */
  const [fileListDetail, setFileListDetail] = useState<FileListType[]>([]);

  /** 删除的文件列表 */
  const [delFileList, setDelFileList] = useState<FileListType[]>([]);

  /** 未点击选择核算产品 获取产品碳足迹核算结果详情  */
  useEffect(() => {
    if (id && !productionBusinessId && !isAdd) {
      getSupplychainDataFillFootprintApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data.data as TypeFootprintResult;
          const report = JSON.parse(result.report || '[]');
          setFileList(report);
          setFileListDetail(report);
          setFootprintResult(data.data);
        }
      });
    }
  }, [id, productionBusinessId, pageTypeInfo]);

  /** 选择核算产品后 匹配的产品碳足迹核算结果详情 */
  useEffect(() => {
    if (productionBusinessId && id) {
      getSupplychainDataFillFootprintStatisticApplyInfoIdProductionBusinessId({
        applyInfoId: Number(id),
        productionBusinessId: Number(productionBusinessId),
      }).then(({ data }) => {
        if (data.code === 200) {
          const {
            discardStage,
            materialStage,
            produceStage,
            storageStage,
            total,
            useStage,
            year,
          } = data?.data || {};
          setFootprintResult({
            discardStage,
            materialStage,
            produceStage,
            storageStage,
            total,
            useStage,
            year,
            productionBusinessId: Number(productionBusinessId),
          });
        }
      });
    }
  }, [productionBusinessId, id]);

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
        <div className={style.content_buttonWrapper}>
          <h4>产品碳足迹核算结果</h4>
          {!isDetail && (
            <Button
              type='primary'
              onClick={() => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfoProductSelect,
                    [PAGE_TYPE_VAR, ':id', ':pageType'],
                    [pageTypeInfo, id, 'resultSelect'],
                  ),
                );
                updateUrl({ likeProductionName: cathRecord?.productName });
              }}
            >
              选择核算产品
            </Button>
          )}
        </div>

        <CarbonFootPrintResult
          id={id}
          disabled={isDetail}
          fileList={fileList}
          hasAction
          cathRecord={cathRecord}
          footprintResult={footprintResult}
        />
      </div>
      <div className={style.content}>
        <h4>产品碳足迹报告</h4>
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
