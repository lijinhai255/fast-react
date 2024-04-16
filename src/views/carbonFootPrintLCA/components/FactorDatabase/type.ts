export interface FactorResp {
  /**
   * 地域代表性
   */
  areaRepresent?: string;
  /**
   * 地域代表性-详细地址
   */
  areaRepresentDetail?: string;
  /**
   * 数据来源
   */
  dataSource?: string;
  /**
   * 因子名称
   */
  name?: string;
  /**
   * 产品碳足迹
   */
  productCarbonFootprint?: string;
  /**
   * 产品信息
   */
  productInfo?: string;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 产品单位
   */
  productUnit?: string;
  /**
   * 系统边界
   */
  systemBoundary?: string;
  /**
   * 技术代表性
   */
  techRepresent?: string;
  /**
   * 时间代表性
   */
  timeRepresent?: number;
  [property: string]: any;
}
