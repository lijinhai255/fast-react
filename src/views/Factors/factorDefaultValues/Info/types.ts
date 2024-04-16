/** 列schema类型 */
export type ColumnsType = {
  properties: { [x: string | number | symbol]: any };
};

/** 表格项类型 */
export type ItemType = { [x: string]: string | number | undefined }[];

/** 表格第一列 */
export type HeadColType = { [key: string]: string };

/** 数据字典返回类型 */
export type EnumsAllType = {
  data: { code: number; msg: string; data: any };
};

/** 枚举值类型 */
export type EnumType = { dictLabel: string; dictValue: string | number };
