/**
 * @description 排放数据左侧二级分类菜单
 */

import { Spin, Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { useEffect, useState } from 'react';

import { getEnterprisesystemSysBusinessClassifyQueryByTentId } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import style from './index.module.less';
import { ClassifyProps } from '../../utils/type';

const { DirectoryTree } = Tree;
const { Text } = Typography;

const ClassificationTree = ({
  tentId,
  currentClassifyId,
  onSelect,
}: {
  /** 核算周期的id */
  tentId?: number;
  /** 当前选中的分类的id */
  currentClassifyId?: number;
  /** 点击分类的方法 */
  onSelect: (data?: ClassifyProps) => void;
}) => {
  /** loading加载 */
  const [loading, setLoading] = useState(false);

  /** 分类数据 */
  const [classifyDataSource, setClassifyDataSource] = useState<DataNode[]>();

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();

  /** 获取分类数据 */
  useEffect(() => {
    if (tentId) {
      setLoading(true);
      getEnterprisesystemSysBusinessClassifyQueryByTentId({ tentId }).then(
        ({ data }) => {
          const arr = data?.data?.map(parent => {
            const {
              classifyId,
              classifyName,
              classifyType,
              emissionList,
              emissionSourceId,
              bossModelId,
            } = parent || {};

            /** 分类类型 */
            const classifyTypeValue = Number(classifyType);
            return {
              title: (
                <Text
                  className={style.classifyName}
                  ellipsis={{ tooltip: false }}
                >
                  {classifyName}
                </Text>
              ),
              key: emissionSourceId || classifyId,
              children:
                !emissionSourceId &&
                emissionList?.map(childrenItem => {
                  const { materialName, id } = childrenItem;
                  return {
                    title: (
                      <Text
                        className={style.classifyName}
                        ellipsis={{ tooltip: false }}
                      >
                        {materialName}
                      </Text>
                    ),
                    key: id,
                    selectable: true,
                    classifyId,
                    classifyType,
                    bossModelId,
                    ...childrenItem,
                  };
                }),
              selectable: !!(emissionSourceId || classifyTypeValue === 2), // 分类下只有一个排放源以及支撑材料类型的一级分类可以点击
              cellId: emissionSourceId && emissionList?.[0].cellId,
              bossMaterialId:
                emissionSourceId && emissionList?.[0].bossMaterialId,
              sysBusinessId:
                emissionSourceId && emissionList?.[0].sysBusinessId,
              ...parent,
            };
          });
          /** 默认选中的分类： 如果只有一级就默认选择一级分类，如果有二级分类就默认选中它下面的第一个二级分类 */
          const defaultSelecedItem = arr?.[0]?.selectable
            ? arr?.[0]
            : arr?.[0]?.children && arr?.[0]?.children[0];
          const {
            classifyId,
            classifyType,
            cellId,
            sysBusinessId,
            key,
            bossModelId,
            bossMaterialId,
          } = defaultSelecedItem || {};

          /** 如果是默认选中二级分类，需要展开一级分类 */
          setExpandedKeys(
            arr?.[0]?.selectable ? undefined : [arr?.[0]?.key as React.Key],
          );

          /** 默认选中 */
          onSelect({
            key,
            classifyId,
            classifyType,
            cellId,
            sysBusinessId,
            bossModelId,
            bossMaterialId,
          });
          setClassifyDataSource(arr as DataNode[]);
          setLoading(false);
        },
      );
    }
  }, [tentId]);

  return (
    <div className={style.classifyTreeWrapper}>
      <Spin spinning={loading}>
        <DirectoryTree
          blockNode
          treeData={classifyDataSource}
          expandedKeys={expandedKeys}
          selectedKeys={[currentClassifyId] as React.Key[]}
          onSelect={(_, info) => {
            const {
              classifyId,
              classifyType,
              cellId,
              sysBusinessId,
              key,
              bossModelId,
              bossMaterialId,
            } = (info.node as unknown as ClassifyProps) || {};
            onSelect({
              key,
              classifyId,
              classifyType,
              cellId,
              sysBusinessId,
              bossModelId,
              bossMaterialId,
            });
          }}
          onExpand={expandedKeysBack => {
            setExpandedKeys(expandedKeysBack);
          }}
        />
      </Spin>
    </div>
  );
};
export default ClassificationTree;
