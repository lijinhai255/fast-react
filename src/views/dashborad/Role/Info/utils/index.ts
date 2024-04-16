/*
 * @@description:
 */

export interface Tree {
  children?: Tree[];
  code?: number;
  name?: string;
  pcode?: number;
}
export const findParentCodes = (tree: Tree[], checkedList: number[]) => {
  const parentCodes = new Set(); // 使用集合来避免重复
  const traverse = (nodes: Tree[]) => {
    nodes?.forEach(node => {
      if (checkedList?.includes(Number(node?.code))) {
        parentCodes.add(node?.pcode);
      }
      if (node?.children) {
        traverse(node?.children);
      }
    });
  };
  traverse(tree);
  return Array.from(parentCodes); // 转换为数组
};
