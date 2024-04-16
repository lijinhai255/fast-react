import { UploadFile } from '../ProcessManageTable/type';

/** 过程管理-表单类型 */
export interface ProcessManageFormProps {
  productType?: number;
  name?: string;
  count?: number;
  unit?: number[];
  allocationCoefficient?: number;
  inputOutputType?: number;
  lifeStageType?: number;
  calcMethod?: number;
  transportMileage?: number;
  energyCount?: number;
  energyUnit?: number[];
  goodsName?: string;
  weightCount?: number;
  weightUnit?: number[];
  depreciationRate?: number;
  dataType?: number;
  upOrDownstreamData?: UpOrDownstreamProps;
  downStreamInputData?: DownStreamInputProps;
  supportMaterials?: (UploadFile & FileType)[];
}

/** 过程管理-表单-上下游数据类型 */
export interface UpOrDownstreamProps {
  processName?: string;
  relatedProductName?: string;
  factorValue?: string;
  factorUnitZ?: string;
  relatedProductUnit?: number[];
  convertRatio?: number;
  timeRepresent?: number;
  areaRepresent?: string;
  areaRepresentDetail?: string;
  techRepresent?: string;
  dataSource?: string;
}
/** 过程管理-表单-下游数据-输入类型 */
export interface DownStreamInputProps {
  processName?: number;
  relatedInputName?: string;
  relatedInputType?: number;
  relatedInputUnit?: number[];
  recyclingCount?: number;
  convertRatio?: number;
}

export interface FileType {
  name: string;
  url: string;
  uid: string;
}

/**
 * 选择输入的类型
 */
export interface ChooseInputOutputLibrary {
  /**
   * 分配系数
   */
  allocationCoefficient?: number;
  /**
   * 地域代表性
   */
  areaRepresent?: string;
  /**
   * 地域代表性-详细地址
   */
  areaRepresentDetail?: string;
  /**
   * 计算公式内容
   */
  calcContent?: string;
  /**
   * 计算方式: 1 按里程; 2 按能耗(1:按里程; 2:按能耗)
   */
  calcMethod?: number;
  /**
   * 类别:1 输入; 2 输出; 3 产品(1:输入; 2:输出; 3:产品)
   */
  category?: number;
  /**
   * 单位换算比例
   */
  convertRatio?: number;
  /**
   * 数量/能耗数量/货物重量
   */
  count?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 数据来源
   */
  dataSource?: string;
  /**
   * 数据类型: 1 过程数据; 2 因子(1:过程数据; 2:因子)
   */
  dataType?: number;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 折旧率
   */
  depreciationRate?: number;
  /**
   * 下游过程id
   */
  downstreamProcessId?: number;
  /**
   * 因子id
   */
  factorId?: number;
  /**
   * 因子数值
   */
  factorValue?: string;
  /**
   * 货物名称
   */
  goodsName?: string;
  id?: number;
  /**
   * 类型: 1 原材料;2 耗材;3 包装材料;4 能耗;5 水耗;6 运输; 7 资本货物; 8 处置产品; 9 废气; 10 废水; 11 固体废弃物; 12 可再生输出物;
   * 13 待处理输出物(1:原材料; 2:耗材; 3:包装材料; 4:能耗; 5:水耗; 6:运输; 7:资本货物; 8:处置产品; 9:废气; 10:废水; 11:固体废弃物;
   * 12:可再生输出物; 13:待处理输出物)
   */
  inputOutputType?: number;
  /**
   * 生命周期阶段类型:1 原材料获取及预加工;2 生产制造; 3 分销和存储; 4 产品使用; 5 废弃处置(1:原材料获取及预加工; 2:生产制造; 3:分销和存储;
   * 4:产品使用; 5:废弃处置)
   */
  lifeStageType?: number;
  /**
   * 输入/输出/原材料名称
   */
  name?: string;
  /**
   * id路径
   */
  path?: string;
  /**
   * 下游输入id
   */
  pid?: number;
  /**
   * 过程名称/因子名称
   */
  processName?: string;
  /**
   * 产品类型: 1 主产品;2 副产品;3 避免产品(1:主产品; 2:副产品; 3:避免产品)
   */
  productType?: number;
  /**
   * 循环利用数量
   */
  recyclingCount?: number;
  /**
   * 输入类型(1:原材料; 2:耗材; 3:包装材料; 4:能耗; 5:水耗; 6:运输; 7:资本货物; 8:处置产品; 9:废气; 10:废水; 11:固体废弃物;
   * 12:可再生输出物; 13:待处理输出物)
   */
  relatedInputType?: number;
  /**
   * 上游关联产品名称
   */
  relatedProductName?: string;
  /**
   * 上游关联产品单位
   */
  relatedProductUnit?: string;
  /**
   * 可再生类型：1. 再生；2. 回收(1:再生; 2:回收)
   */
  renewingType?: number;
  /**
   * 支撑材料
   */
  supportMaterials?: UploadFile[];
  /**
   * 技术代表性
   */
  techRepresent?: string;
  /**
   * 时间代表性
   */
  timeRepresent?: number;
  /**
   * 运输里程
   */
  transportMileage?: number;
  /**
   * 单位
   */
  unit?: string;
  /**
   * 单位名称
   */
  unitName?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 上游数据过程id
   */
  upstreamProcessId?: number;
  /**
   * 上游过程产品id
   */
  upstreamProcessProductId?: number;
  /**
   * 上/下游数据
   */
  upstreamProcessProductName?: string;
  [property: string]: any;
}
