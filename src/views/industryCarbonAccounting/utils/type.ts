import {
  SysBusinessColumnName,
  SysBusinessParam,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

export type ClassifyProps = {
  /** 分类id */
  classifyId?: number;
  /** 分类类型 */
  classifyType?: number;
  /** 排放源、生产数据关联的生产单元id */
  cellId?: number;
  /** 当前选中的分类id */
  key?: number;
  /** 核算模型id */
  sysBusinessId?: number;
  /** 组织ID */
  orgId?: number;
  /** 数据收集的时间范围 */
  collectTime?: string;
  /** 核算模型ID */
  bossModelId?: number;
  /** 核算年度 */
  accountYear?: string;
  /** 后台排放源id */
  bossMaterialId?: number;
};

export type HeaderBasicInfoType = {
  [key: string]: string | number | undefined;
};

export type CycleDetailInfoType = {
  /** 组织id */
  orgId?: number;
  /** 组织名称 */
  orgName?: string;
  /** 核算年度 */
  accountYear?: string;
  /** 模型名称 */
  businessName?: string;
  /** 数据收集的时间范围 */
  collectTime?: string;
};

/** 实体参数的文件类型以及支撑材料的文件类型 */
export type FileListType = {
  /** 数据收集周期 */
  collectTime?: string;
  /** 列名id */
  colunmId?: number;
  /** 租户id */
  companyId?: number;
  createBy?: number;
  createTime?: Date;
  /** 文件id */
  fileId?: string;
  /** 文件名称 */
  fileName?: string;
  /** 文件url */
  fileUrl?: string;
  /** id */
  id?: number;
  /** 组织id */
  orgId?: number;
  /** 支撑材料id */
  sysSupportId?: number;
  updateBy?: number;
  updateTime?: Date;
  /** 文件名称 */
  name?: string;
  /** 文件id */
  uid?: string;
  /** 文件url地址 */
  url?: string;
};

export type EmissionDetailInfoType = {
  [key: number]: { id?: number; value: string };
};

export type FileDetailDataType = {
  [key: number]: {
    fileList: FileListType[];
  };
};

export type EmissionDataListType = SysBusinessParam & {
  [key: number]: string | undefined;
};

export type EmissionColumnNameDataType = {
  [key: number]: SysBusinessColumnName | undefined;
};
