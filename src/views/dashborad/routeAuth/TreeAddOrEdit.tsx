/*
 * @@description: 编辑、新增权限树 - 功能切换到了管理端，不能再使用
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-06 19:33:56
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-03-22 11:06:23
 */

/* @deprecated */
import { Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';

import { PageTypeInfo } from '@/router/utils/enums';
import { Permission } from '@/sdks/systemV2ApiDocs';

import style from './index.module.less';

const { TextArea } = Input;
const { Option } = Select;

export interface TreeAddProps {
  onFinish: (type: 'add' | 'edit' | 'del') => void;
  checkTreeDetail?: Permission;
  addCanCelFn: () => void;
  treeType: PageTypeInfo;
  /** 最顶层节点的id */
  topPid?: number;
}

function TreeAdd(props: TreeAddProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { checkTreeDetail, onFinish, addCanCelFn, treeType, topPid } = props;
  const [form] = Form.useForm<Permission | undefined>();

  // 设置初始值
  useEffect(() => {
    if (treeType === PageTypeInfo.add) {
      form.resetFields();
    } else if (checkTreeDetail) form.setFieldsValue(checkTreeDetail);
    else form.resetFields();
  }, [checkTreeDetail, treeType]);
  return (
    <div className={style.treeAddWrapper}>
      <Form
        form={form}
        className={style.treeForm}
        onFinish={() => {
          // if (!checkTreeDetail && topPid === undefined) return;
          // const newVal = {
          //   ...values,
          //   pid:
          //     treeType === PageTypeInfo.add
          //       ? checkTreeDetail?.id || topPid
          //       : checkTreeDetail?.pid || topPid,
          //   id: treeType === PageTypeInfo.add ? undefined : checkTreeDetail?.id,
          // } as Permission;
          // if (treeType === PageTypeInfo.add) {
          //   POST6bb65876543259f070d9846562fe6eb4({ req: newVal }).then(
          //     // @ts-ignore
          //     ({ data }) => {
          //       if (data?.code === 200) {
          //         Toast('success', '创建成功');
          //         onFinish('add');
          //       }
          //     },
          //   );
          // } else {
          //   POSTe5188a0a665082eb6b971b03476b14e5({ req: newVal }).then(
          //     // @ts-ignore
          //     ({ data }) => {
          //       if (data?.code === 200) {
          //         onFinish('edit');
          //         Toast('success', '更新成功');
          //       }
          //     },
          //   );
          // }
        }}
        disabled={treeType === PageTypeInfo.show}
        labelCol={{ span: 8 }}
      >
        <Form.Item
          label='权限名称'
          name='permissionName'
          rules={[
            { required: true, message: '权限名称不能为空!' },
            { type: 'string', min: 0, max: 50 },
          ]}
        >
          <Input placeholder='请输入权限名称' />
        </Form.Item>
        <Form.Item
          name='menuType'
          label='权限类型'
          rules={[{ required: true }]}
        >
          <Select placeholder='请选择权限类型' allowClear>
            <Option value='M'>目录权限</Option>
            <Option value='C'>菜单权限</Option>
            <Option value='F'>按钮权限</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='权限标识'
          name='perms'
          rules={[
            { required: true, message: '权限标识不能为空' },
            { type: 'string', min: 0, max: 50 },
          ]}
        >
          <Input placeholder='请输入权限标识' />
        </Form.Item>
        <Form.Item
          label='链接地址'
          name='path'
          rules={[{ type: 'string', min: 0, max: 100 }]}
        >
          <Input placeholder='请输入链接地址' />
        </Form.Item>
        {/* <Form.Item
            name='status'
            label='权限状态'
            rules={[{ required: true }]}
          >
            <Select placeholder='请选择权限状态' allowClear>
              <Option value='0'>启用</Option>
              <Option value='1'>禁用</Option>
            </Select>
          </Form.Item> */}
        <Form.Item
          label='顺序'
          name='orderNum'
          rules={[
            { required: true, message: '顺序不能为空' },
            {
              type: 'number',
              transform(val) {
                return Number(val);
              },
            },
          ]}
        >
          <Input placeholder='请输入当前权限的顺序' />
        </Form.Item>
        <Form.Item
          label='备注'
          name='remark'
          rules={[{ type: 'string', min: 0, max: 200 }]}
        >
          <TextArea placeholder='当前权限的备注信息' rows={4} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            className={style.btn}
            htmlType='button'
            onClick={() => {
              addCanCelFn();
              form.setFieldsValue(checkTreeDetail);
            }}
          >
            取消
          </Button>
          <Button type='primary' htmlType='submit' className={style.btn}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default TreeAdd;
