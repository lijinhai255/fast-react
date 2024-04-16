/**
 * 选择过程的请求参数
 */
export interface ChooseProcessLibraryRequest {
  /**
   * 过程名称
   */
  likeProcessName?: string;
  /**
   * 剔除的过程id
   */
  notProcessId?: number;
  /**
   * 产出产品名称
   */
  outputProductName?: string;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  [property: string]: any;
}

export interface ChooseProcessLibrary {
  /**
   * 地域代表性
   */
  areaRepresent?: string;
  /**
   * 地域代表性-详细地址
   */
  areaRepresentDetail?: string;
  /**
   * 租户id
   */
  companyId?: number;
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
   * 数据类型: 1 实景数据; 2 背景数据(1:实景数据; 2:背景数据)
   */
  dataType?: number;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  id?: number;
  /**
   * 多输出分配(1:无; 2:物理分配; 3:经济分配; 4:其他方法)
   */
  multiOutput?: number;
  /**
   * 所属组织
   */
  orgId?: number;
  /**
   * 所属组织名称
   */
  orgName?: string;
  /**
   * 产出产品名称
   */
  outputProductName?: string;
  /**
   * 过程描述
   */
  processDesc?: string;
  /**
   * 过程名称
   */
  processName?: string;
  /**
   * 产品单位
   */
  productUnit?: string;
  /**
   * 产品单位名称
   */
  productUnitName?: string;
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
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新者名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}
