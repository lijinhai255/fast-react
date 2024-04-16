/*
 * @@description: 功能切换至管理端 ，不再维护
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-06 19:33:56
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 16:02:35
 */

/* @deprecated */
import { Button, Card, Modal, Spin } from 'antd';
import { EventDataNode } from 'antd/lib/tree';
import { memo, useEffect, useState } from 'react';

// import { Toast } from '@/utils';
import { AntProvider } from '@/components/AntdProvider';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getSystemPermissionId,
  getSystemPermissionTree,
  Permission, // POST0f911e7a4a75d8d502fe9e7aa5c384cd,
  Tree,
} from '@/sdks/systemV2ApiDocs';
import { returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import TreeAdd from './TreeAddOrEdit';
import TreeRoute from './TreeRotue';
import style from './index.module.less';

const MenuButton = memo(
  ({
    onButtonClick,
    className,
    treeInfo,
  }: {
    treeInfo?: Permission;
    className: string;
    onButtonClick: (type: string) => void;
  }) => (
    <div className={className}>
      <Button
        disabled={!treeInfo}
        type='primary'
        style={{ marginRight: '10px' }}
        onClick={() => onButtonClick('remove')}
      >
        删除权限
      </Button>
      <Button
        disabled={!treeInfo}
        style={{ marginRight: '10px' }}
        onClick={() => onButtonClick('edit')}
        type='primary'
      >
        编辑权限
      </Button>
      <Button
        onClick={() => {
          onButtonClick('add');
        }}
        type='primary'
      >
        新增
      </Button>
    </div>
  ),
);

function RouteAuth() {
  // tree 状态
  const [treeType, setTreeType] = useState(PageTypeInfo.show);

  // 选中的节点
  const [selected, setSelected] = useState<EventDataNode<Tree>>();

  // 全局的loading
  const [loading, setLoading] = useState<boolean>(false);
  // tree的数据
  const [treeList, setTreeList] = useState<Tree[]>();

  const [treeInfo, setTreeInfo] = useState<Permission>();
  /** 获取节点详情 */
  const getTreeInfo = (id: number) => {
    setLoading(true);

    getSystemPermissionId({ id })
      .then(({ data }) => {
        setTreeInfo(data?.data);
      })
      .finally(() => setLoading(false));
  };
  /** 获取tree */
  const initList = async () => {
    setLoading(true);
    return getSystemPermissionTree({ roleId: undefined })
      .then(({ data }) => {
        setTreeList(data?.data?.tree);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onRemove = () => {
    Modal.confirm({
      title: '系统提示',
      content: treeInfo
        ? '此操作将永久删除该权限,同时也删除下级权限, 是否继续?'
        : '此操作将永久删除该权限, 是否继续?',
      ...returnNoIconModalStyle,
      ...returnDelModalStyle,
      async onOk() {
        // if (treeInfo?.id)
        //   POST0f911e7a4a75d8d502fe9e7aa5c384cd({
        //     req: { id: treeInfo?.id },
        //   }).then(({ data }) => {
        //     if (data.code === 200) {
        //       setTreeType(PageTypeInfo.show);
        //       setTreeInfo(undefined);
        //       initList();
        //       Toast('success', '删除成功');
        //     }
        //   });
      },
    });
  };

  useEffect(() => {
    initList();
  }, []);
  return (
    <AntProvider>
      <div className={style.wrapper}>
        <div className={style.main}>
          <div className={style.left}>
            <MenuButton
              className={style.actions}
              treeInfo={treeInfo}
              onButtonClick={(type: string) => {
                if (type === 'remove') {
                  onRemove();
                  setTreeType(PageTypeInfo.show);
                } else if (type === 'edit') {
                  setTreeType(PageTypeInfo.edit);
                } else {
                  setTreeType(PageTypeInfo.add);
                }
              }}
            />

            <Card className={style.tree}>
              <Spin spinning={loading}>
                <TreeRoute
                  // @ts-ignore
                  selectedKeys={selected?.selectedNodes?.map(item => item.code)}
                  onSelect={(keys, info) => {
                    if (keys.length) getTreeInfo(Number(keys[0]));
                    setSelected(info as unknown as EventDataNode<Tree>);
                  }}
                  treeList={treeList}
                />
              </Spin>
            </Card>
          </div>
          <div className={style.right}>
            <TreeAdd
              onFinish={type => {
                setTreeType(PageTypeInfo.show);
                if (type === 'edit' && treeInfo?.id) {
                  getTreeInfo(treeInfo.id);
                }
                initList();
              }}
              topPid={treeList?.[0]?.pcode}
              checkTreeDetail={treeInfo}
              treeType={treeType}
              addCanCelFn={() => {
                setTreeType(PageTypeInfo.show);
              }}
            />
          </div>
        </div>
      </div>
    </AntProvider>
  );
}
export default RouteAuth;
