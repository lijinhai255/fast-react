/**
 * @description 过程左侧菜单树
 */

import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { uniq } from 'lodash-es';
import React, { useEffect, useState } from 'react';

import CustResizable from '@/components/Resizable';

import style from './index.module.less';
import { SideBarNode } from './type';

const MODULE_TYPE = {
  /** 碳足迹模型 */
  CARBON_FOOT_PRINT_MODEL: 'CarbonFootprintModel',
  /** 过程库 */
  PROCESS_LIBRARY: 'ProcessesLibrary',
} as const;

interface ProcessLeftMenuProps {
  /** 当前菜单展示的宽度 */
  currentWidth?: number;
  /** 当前菜单的选中项 */
  currentSelectedKeys?: React.Key[];
  /** 模块类型 */
  moduleType: string;
  /** 过程id */
  processId?: number;
  /** 当前点击的过程列表的上下游数据所在列的id */
  processColumnId?: number;
  /** 菜单树数据 */
  treeData: SideBarNode[];
  /** 拖拽改变宽度 */
  changeCurrentWidth: (changeWidth: number) => void;
  /** 选中菜单的方法 */
  onSelect: (treeNode: DataNode & SideBarNode) => void;
}

const ProcessLeftMenu = ({
  currentWidth = 300,
  currentSelectedKeys,
  moduleType,
  processId,
  processColumnId,
  treeData,
  changeCurrentWidth,
  onSelect,
}: ProcessLeftMenuProps) => {
  /** 菜单数据 */
  const [treeDataBack, setTreeDataBack] = useState<DataNode[]>();
  /** 展开指定的树节点 */
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();

  /** 获取无层级的菜单列表 */
  const onGetList = (data: (DataNode & SideBarNode)[]) => {
    const result: (DataNode & SideBarNode)[] = [];

    const helper = (node: DataNode & SideBarNode) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        node.children.forEach(children => {
          helper(children);
        });
      }
    };

    data.forEach(item => {
      helper(item);
    });

    return result;
  };

  const onHandleParentIds = (
    dataSource: (DataNode & SideBarNode)[],
    newArr: string[],
    id?: string,
  ) => {
    dataSource.forEach(item => {
      let str = `${id}`;
      if (!id) {
        str = `${item.id}`;
      } else {
        str += `-${item.id}`;
      }
      if (item.children && item.children.length) {
        onHandleParentIds(item.children, newArr, str);
      } else {
        newArr.push(str);
      }
    });
    return newArr || [];
  };

  /** 获取制定id的全部父节点 */
  const findParentIds = (
    tree: (DataNode & SideBarNode)[],
    targetIds: number,
  ) => {
    const arr = onHandleParentIds(tree, []) || [];
    const newArr = arr.map(item => {
      return item.split('-');
    });

    const newFilterArr: string[] = [];
    newArr.forEach(item => {
      if (item.includes(String(targetIds))) {
        for (let index = 0; index < item.length; index++) {
          const child = item[index];
          newFilterArr.push(child);
          if (Number(child) === targetIds) {
            break;
          }
        }
      }
    });
    return newFilterArr;
  };

  /** 点击上下游数据，菜单定位到对应的节点 */
  useEffect(() => {
    if (processColumnId) {
      const list = onGetList(treeDataBack || []);
      const treeNode = list.find(node => node.key === processColumnId);

      if (!treeNode) {
        return;
      }

      /** 获取点击的节点的父级id的集合 */
      const parentIds = findParentIds(
        treeDataBack as (DataNode & SideBarNode)[],
        processColumnId,
      )
        ?.map(v => Number(v))
        ?.filter(v => v !== processColumnId);

      /** 当点击上下游数据时，需要展开它的全部父级 */
      setExpandedKeys(uniq([...(expandedKeys || []), ...parentIds]));

      onSelect({
        ...(treeNode as DataNode & SideBarNode),
      });
    }
  }, [processColumnId]);

  const onHandleChidrenTreeData = (children: SideBarNode[], type?: number) => {
    if (children && children.length) {
      return children.map(item => {
        const { name, id, dataType, pid } = item || {};
        if (item.children && item.children.length) {
          item.children = onHandleChidrenTreeData(item.children, type);
        }
        return {
          ...item,
          title: name,
          key: id,
          topLifeStageType: type,
          disabled:
            moduleType === MODULE_TYPE.CARBON_FOOT_PRINT_MODEL
              ? !dataType && pid !== processId
              : !dataType && id !== 0, // 没有上下游数据类型的，其改节点不是顶层生命周期阶段则禁用，不可以点击
        };
      });
    }
    return [];
  };

  /** 菜单数据处理 */
  const getTreeData = (arr: SideBarNode[]) => {
    return arr.map(node => {
      const { name, id, dataType, pid, lifeStageType, children } = node || {};
      if (children && children.length) {
        node.children = onHandleChidrenTreeData(children, lifeStageType);
      }
      return {
        ...node,
        title: name,
        key: id,
        topLifeStageType: lifeStageType,
        disabled:
          moduleType === MODULE_TYPE.CARBON_FOOT_PRINT_MODEL
            ? !dataType && pid !== processId
            : !dataType && id !== 0, // 没有上下游数据类型的，其改节点不是顶层生命周期阶段则禁用，不可以点击
      };
    });
  };

  /** 获取菜单栏的数据 */
  useEffect(() => {
    if (treeData && treeData.length) {
      setTreeDataBack(getTreeData(treeData) as unknown as DataNode[]);

      /** 当前菜单已经选中就不需要走默认值 */
      if (currentSelectedKeys && currentSelectedKeys.length) {
        return;
      }

      const defaultSelectedTreeNode = getTreeData(treeData)[0];

      /** 默认选中 */
      onSelect({
        ...(defaultSelectedTreeNode as DataNode & SideBarNode),
      });
    }
  }, [treeData, currentSelectedKeys]);

  return (
    <div className={style.lifeCycleMenuWrapper}>
      <div className={style.lifeCycleMenuMain}>
        <CustResizable
          defaultPropsWidth={currentWidth}
          // eslint-disable-next-line react/no-unstable-nested-components
          childRender={() => (
            <div className={style.lifeCycleMenuTreeWrapper}>
              <Tree
                treeData={treeDataBack}
                selectedKeys={currentSelectedKeys}
                expandedKeys={expandedKeys}
                onSelect={(selectedKeys, info) => {
                  if (!selectedKeys || selectedKeys.length === 0) return;
                  /** 选中菜单节点 */
                  onSelect(info.selectedNodes[0] as DataNode & SideBarNode);
                }}
                onExpand={expandedKeysValue => {
                  setExpandedKeys(expandedKeysValue);
                }}
              />
            </div>
          )}
          resizableCurrentSize={({ width }) => {
            changeCurrentWidth(width);
          }}
        />
      </div>
    </div>
  );
};
export default ProcessLeftMenu;
