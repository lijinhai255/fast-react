/**
 * IPage«Report»
 */
export interface IPageReport {
  /**
   * list
   */
  list?: Report[];
  /**
   * 页码，从1开始
   */
  pageNum?: number;
  /**
   * 总页数
   */
  pages?: number;
  /**
   * 页面大小
   */
  pageSize?: number;
  /**
   * 当前页的数量
   */
  size?: number;
  /**
   * 总数
   */
  total?: number;
  [property: string]: any;
}

/**
 * 碳足迹报告类型
 */
export interface Report {
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
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 生产周期结束日
   */
  endDate?: Date;
  /**
   * 功能单位
   */
  functionalUnit?: string;
  id?: number;
  /**
   * 模型id
   */
  modelId?: number;
  /**
   * 模型名称
   */
  modelName?: string;
  /**
   * 报告名称
   */
  name?: string;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 产品编码
   */
  productCode?: string;
  /**
   * 生产周期
   */
  productionCycle?: string;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 生产周期起始日
   */
  startDate?: Date;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 碳足迹报告列表搜索栏类型
 */
export interface Request {
  /**
   * 报告名称
   */
  likeName?: string;
  /**
   * 模型名称
   */
  modelName?: string;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 产品名称或编码
   */
  productNameOrCode?: string;
  [property: string]: any;
}
