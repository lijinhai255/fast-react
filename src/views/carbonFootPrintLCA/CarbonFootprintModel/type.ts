/**
 * 模型
 */
export interface Model {
  /**
   * 假设和限制
   */
  assumptionsAndConstraints?: string;
  /**
   * 基准流数量
   */
  baselineFlowCount?: number;
  /**
   * 基准流单位
   */
  baselineFlowUnit?: string;
  /**
   * 基准流单位名称
   */
  baselineFlowUnitName?: string;
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
   * 截止规则
   */
  cutoffRule?: string;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 碳足迹kgCO2e
   */
  emission?: number;
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
   * 模型名称
   */
  name?: string;
  /**
   * 所属组织
   */
  orgId?: number;
  /**
   * 所属组织名称
   */
  orgName?: string;
  /**
   * 产品编码
   */
  productCode?: string;
  /**
   * 产品id
   */
  productId?: number;
  /**
   * 生产周期
   */
  productionCycle?: string;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 产品产地
   */
  productOrigin?: string;
  /**
   * 产品产地详细地址
   */
  productOriginDetail?: string;
  /**
   * 产品产地名称
   */
  productOriginName?: string;
  /**
   * 研究目标
   */
  researchTarget?: string;
  /**
   * 生产周期起始日
   */
  startDate?: Date;
  /**
   * 系统边界
   */
  systemBoundary?: string;
  /**
   * 系统边界描述
   */
  systemBoundaryDesc?: string;
  /**
   * 系统边界图
   */
  systemBoundaryImg?: string;
  /**
   * 生命周期类型: 1 半生命周期; 2 全生命周期; 3 产品生产周期; 4 自定义生命周期(1:半生命周期; 2:全生命周期; 3:产品生产周期; 4:自定义生命周期)
   */
  systemBoundaryType?: number;
  /**
   * 单位产品重量
   */
  unitProductWeight?: number;
  /**
   * 单位产品重量单位
   */
  unitProductWeightUnit?: string;
  /**
   * 基准流单位名称
   */
  unitProductWeightUnitName?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 碳足迹模型列表搜索栏的类型
 */
export interface Request {
  /**
   * 模型名称
   */
  likeName?: string;
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

/**
 * 清单分析-过程描述
 */
export interface Process {
  /**
   * 地域代表性
   */
  areaRepresent?: string;
  /**
   * 地域代表性-详细地址
   */
  areaRepresentDetail?: string;
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
   * 过程描述
   */
  processDesc?: string;
  /**
   * 过程名称
   */
  processName?: string;
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
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 过程管理-列表-请求传参
 */
export interface InputOutputRequest {
  /**
   * 类别:1 输入; 2 输出; 3 产品
   */
  category?: number;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 菜单节点的upstreamProcessId
   */
  processId?: number;
  [property: string]: any;
}

/** 选择输入的搜索 */
export interface ChooseInputRequest {
  /**
   * 输入名称
   */
  inputName?: string;
  /**
   * 模型id
   */
  modelId: number;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 过程名称
   */
  processName?: string;
  [property: string]: any;
}

/**
 * 影响评价返回数据
 */
export interface ImpactAssessmentResp {
  /**
   * 各个阶段的影响评价
   */
  stageImpactAssessments?: StageImpactAssessment[];
  /**
   * 总计
   */
  total?: number;
  [property: string]: any;
}

/**
 * 影响评价
 */
export interface StageImpactAssessment {
  /**
   * 名称
   */
  name?: string;
  /**
   * 百分比
   */
  percentage?: string;
  /**
   * 数值
   */
  value?: number;
  [property: string]: any;
}

/**
 * 贡献度分析
 */
export interface ContributionAnalysisNode {
  /**
   * 子节点
   */
  children?: ContributionAnalysisNode[];
  /**
   * 输入/输出id
   */
  id?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 百分比
   */
  percentage?: number;
  /**
   * 排放量
   */
  value?: number;
  [property: string]: any;
}
