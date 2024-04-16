/**
 * 产品信息
 */
export interface Product {
  /**
   * 产品编码
   */
  code?: string;
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
   * 产品描述
   */
  description?: string;
  id?: number;
  /**
   * 产品名称
   */
  name?: string;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 规格/型号
   */
  specification?: string;
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

/** 产品信息列表搜索栏部分类型 */
export interface Request {
  /**
   * 名称或编码
   */
  nameOrCode?: string;
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
  [property: string]: any;
}
