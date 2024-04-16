/*
 * @@description: 产品碳足迹信息（结果、过程、报告）（供应商碳数据、碳数据审核、采购产品管理-详情-产品碳足迹公用的页面）
 */
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  FootprintBase,
  FootprintProcess,
  FootprintResult,
  ProcessModel,
  getSupplychainProcessFootprintBaseApplyInfoId,
  getSupplychainProcessFootprintPage,
  getSupplychainResultFootprintApplyInfoId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import {
  FileListType,
  SearchParamses,
} from '@/views/carbonFootPrint/utils/types';

import { culHistory } from '../../utils';
import { CarbonDataPropsType, TypeFootprintResult } from '../../utils/type';
import style from '../CarbonAccountingInfo/index.module.less';
import CarbonFootPrintProcess from '../CarbonFootPrintProcess';
import CarbonFootPrintResult from '../CarbonFootPrintResult';
import Report from '../Report';

function CarbonFootPrintInfo({
  /** 数据id */
  id,
  /** 表单是否禁用 */
  disabled,
  /** 数据请求类型 1: 核算结果 2: 核算过程 */
  applyType,
  /** 数据请求的详情 */
  cathRecord,
}: CarbonDataPropsType) {
  const navigate = useNavigate();
  const {
    pageTypeInfo,
    dataId,
    dataType,
    auditStatus,
    carbonFootPrintPageTypeInfo,
    carbonFootPrintId,
  } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    dataId: string;
    dataType: string;
    auditStatus: string;
    carbonFootPrintPageTypeInfo: PageTypeInfo;
    carbonFootPrintId: string;
  }>();

  /** 是否为碳数据审核页面 */
  const isApprove = culHistory('/supplyChain/carbonDataApproval');

  /** 是否为碳数据页面 */
  const isCarbonData = culHistory('/supplyChain/supplierCarbonData');

  /** 是否为采购产品管理 */
  const isProductManage = culHistory('/supplyChain/productManagement');

  /** 请求类型是否为核算过程 */
  const isProcess = Number(applyType) === 2;

  /** 页码配置 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 表格加载 */
  const [loading, changeLoading] = useState(false);

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 产品碳足迹核算-核算结果数据 */
  const [footprintResult, setFootprintResult] = useState<FootprintResult>();

  /** 当前生命周期阶段 */
  const [currentMenu, changeCurrentMenu] = useState<ProcessModel>();

  /** 产品碳足迹核算-核算过程数据 */
  const [footprinProcess, setFootprinProcess] = useState<FootprintProcess[]>();

  /** 产品碳足迹核算-核算过程-基本信息 */
  const [basicCathRecord, setBasicCathRecord] = useState<FootprintBase>();

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 获取产品碳足迹的填报数据的数据 */
  useEffect(() => {
    if (id && applyType) {
      /** 核算结果 */
      getSupplychainResultFootprintApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data.data as TypeFootprintResult;
          const report = JSON.parse(result.report || '[]');
          setFileList(report);
          setFootprintResult(data.data);
        }
      });
      /** 核算过程 */
      if (isProcess) {
        /** 基本信息详情 */
        getSupplychainProcessFootprintBaseApplyInfoId({
          applyInfoId: Number(id),
        }).then(({ data }) => {
          if (data.code === 200) {
            setBasicCathRecord(data.data);
          }
        });
      }
    }
  }, [id, applyType]);

  /** 获取排放源列表 */
  useEffect(() => {
    if (id && applyType && isProcess && currentMenu && currentMenu?.id) {
      changeLoading(true);
      getSupplychainProcessFootprintPage({
        applyInfoId: Number(id),
        pageNum: searchParams.current,
        pageSize: searchParams.pageSize || 10,
        processModelId: currentMenu.id,
      }).then(({ data }) => {
        if (data.code === 200) {
          setFootprinProcess(data?.data?.list || []);
          setTotal(data?.data?.total || 0);
          changeLoading(false);
        }
      });
    }
  }, [id, applyType, currentMenu]);

  /** tabs展示列表 */
  const tabList = compact([
    {
      label: '产品碳足迹核算结果',
      key: '1',
    },
    isProcess && {
      label: '产品碳足迹核算过程',
      key: '2',
    },
    {
      label: '产品碳足迹核算报告',
      key: '3',
    },
  ]);

  /** 当前切换的顶部Tab栏 */
  const [currentTab, changeCurrentTab] = useState<string>('1');

  /** 切换tab展示不同的信息 */
  const tabsShowInfo = () => {
    switch (Number(currentTab)) {
      /** 产品碳足迹核算结果 */
      case 1:
        return (
          <CarbonFootPrintResult
            id={id}
            disabled={disabled}
            cathRecord={cathRecord}
            footprintResult={footprintResult}
          />
        );
      /** 产品碳足迹核算过程 */
      case 2:
        return (
          <CarbonFootPrintProcess
            footprinProcess={footprinProcess}
            basicCathRecord={basicCathRecord}
            loading={loading}
            total={total}
            searchParams={searchParams}
            onchange={(current: number, pageSize: number) => {
              setSearchParams({
                current,
                pageSize,
              });
            }}
            onChangeMenu={item => {
              changeCurrentMenu(item);
            }}
            onDetailFactorClick={row => {
              if (isApprove) {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmApprovalInfoProductEmissonSourceInfo,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':dataId',
                      ':dataType',
                      ':auditStatus',
                      ':factorPageInfo',
                      ':factorId',
                      ':factorInfo',
                    ],
                    [
                      pageTypeInfo,
                      id,
                      dataId,
                      dataType,
                      auditStatus,
                      PageTypeInfo.show,
                      row?.id,
                      JSON.stringify({
                        stage: currentMenu?.id,
                        stageName: currentMenu?.modelName,
                        functionalUnit: basicCathRecord?.functionalUnit,
                        beginDate: basicCathRecord?.beginDate,
                        endTime: basicCathRecord?.endTime,
                      }),
                    ],
                  ),
                );
              }
              if (isCarbonData) {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmCarbonDataInfoProductEmissonSourceInfo,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':factorPageInfo',
                      ':factorId',
                      ':factorInfo',
                    ],
                    [
                      pageTypeInfo,
                      id,
                      PageTypeInfo.show,
                      row?.id,
                      JSON.stringify({
                        stage: currentMenu?.id,
                        stageName: currentMenu?.modelName,
                        functionalUnit: basicCathRecord?.functionalUnit,
                        beginDate: basicCathRecord?.beginDate,
                        endTime: basicCathRecord?.endTime,
                      }),
                    ],
                  ),
                );
              }
              if (isProductManage) {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfoEmissionSourceInfo,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':carbonFootPrintPageTypeInfo',
                      ':carbonFootPrintId',
                      ':factorPageInfo',
                      ':factorId',
                      ':factorInfo',
                    ],
                    [
                      pageTypeInfo,
                      id,
                      carbonFootPrintPageTypeInfo,
                      carbonFootPrintId,
                      PageTypeInfo.show,
                      row?.id,
                      JSON.stringify({
                        stage: currentMenu?.id,
                        stageName: currentMenu?.modelName,
                        functionalUnit: basicCathRecord?.functionalUnit,
                        beginDate: basicCathRecord?.beginDate,
                        endTime: basicCathRecord?.endTime,
                      }),
                    ],
                  ),
                );
              }
            }}
          />
        );
      /** 产品碳足迹核算报告 */
      default:
        return fileList && fileList.length > 0 ? (
          <Report
            fileList={fileList}
            fileType='.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf,.rar,.zip'
            maxCount={10}
            maxSize={10 * 1024 * 1024}
            errorTip='文件大小不能超过10M'
            disabled
          />
        ) : (
          '未提交报告'
        );
    }
  };

  return (
    <div className={style.wrapper}>
      <Radio.Group
        defaultValue='1'
        buttonStyle='solid'
        onChange={({ target: { value } }: RadioChangeEvent) => {
          changeCurrentTab(value);
        }}
      >
        {tabList &&
          tabList.map(item => {
            return (
              <Radio.Button value={item.key} key={item.key}>
                {item.label}
              </Radio.Button>
            );
          })}
      </Radio.Group>
      <div className={style.wrapper_main}>{tabsShowInfo()}</div>
    </div>
  );
}
export default CarbonFootPrintInfo;
