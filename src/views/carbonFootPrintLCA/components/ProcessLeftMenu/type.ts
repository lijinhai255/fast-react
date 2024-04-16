export interface SideBarNode {
  /**
   * 子节点
   */
  children?: SideBarNode[];
  /**
   * 数据类型: 1 过程数据; 2 因子(1:过程数据; 2:因子)
   */
  dataType?: number;
  /**
   * 输入/输出id
   */
  id?: number;
  /**
   * 生命周期类别(1:原材料获取及预加工; 2:生产制造; 3:分销和存储; 4:产品使用; 5:废弃处置)
   */
  lifeStageType?: number;
  /**
   * 顶层菜单节点的生命周期阶段
   */
  topLifeStageType?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 上游过程id
   */
  pid?: number;
  /**
   * 可再生类型：1. 再生；2. 回收(1:再生; 2:回收)
   */
  renewingType?: number;
  /**
   * 关联过程id
   */
  upstreamProcessId?: number;
  [property: string]: any;
}
