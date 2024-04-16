/**
 * @description: 默认题目弹窗
 */

import { Button, Checkbox, Modal, Table } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import {
  getSupplychainQuestionDefaultList,
  postSupplychainQuestionDefaultChoose,
  QuestionnaireQuestion,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumsNoText } from '@/utils';

import style from './index.module.less';
import { columns } from './utils/columns';

export const DefaultQuestionModal = ({
  open,
  questionModalOpenFn,
  id,
  getQuestionArr,
}: {
  open: boolean;
  questionModalOpenFn: (isOpen: boolean) => void;
  id: number;
  getQuestionArr: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  /** 表头 */
  const column = changeTableColumsNoText(columns(), '-');

  /** 表格数据 */
  const [dataSource, setDataSource] = useState<QuestionnaireQuestion[]>();

  /** 所有的题目ID数组 */
  const [allQuestionIdArr, setAllQuestionIdArr] = useState<number[]>([]);

  /** 选中的题目ID数组 */
  const [selectedQuestion, setSelectedQuestion] = useState<React.Key[]>([]);

  /** 全选按钮是否是半选 */
  const [indeterminate, setIndeterminate] = useState(false);
  /** 是否是全选 */
  const [checkAll, setCheckAll] = useState(false);
  /** 点击全选按钮 */
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    setIndeterminate(false);
    setCheckAll(checked);
    if (checked) {
      setSelectedQuestion(allQuestionIdArr);
    } else {
      setSelectedQuestion([]);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      const selectedNum = selectedRowKeys?.length;
      const total = allQuestionIdArr?.length;
      setSelectedQuestion(selectedRowKeys);
      /** 控制全选按钮状态反显 */
      setCheckAll(selectedNum > 0 && selectedNum === total);
      setIndeterminate(selectedNum > 0 && selectedNum !== total);
    },
    selectedRowKeys: selectedQuestion,
  };

  /** 默认题目弹窗-确认选择 */
  const defaultQuestionOkFn = async () => {
    setLoading(true);
    await postSupplychainQuestionDefaultChoose({
      req: {
        questionIdList: selectedQuestion as number[],
        questionnaireId: id,
      },
    }).then(() => {
      questionModalOpenFn(false);
      setLoading(false);
      /** 刷新题目列表 */
      getQuestionArr();
    });
    setLoading(false);
  };

  /** 获取默认题目列表 */
  useEffect(() => {
    getSupplychainQuestionDefaultList({}).then(({ data }) => {
      setDataSource(data?.data);
      /** 获得所有题目的ID数组 */
      const allQuestionId = compact(
        data?.data?.map(item => {
          return item.id;
        }),
      );
      setAllQuestionIdArr(allQuestionId);
    });
    setSelectedQuestion([]);
    setIndeterminate(false);
    setCheckAll(false);
  }, [open]);

  return (
    <Modal
      title='选择题目'
      open={open}
      width={836}
      maskClosable={false}
      onCancel={() => questionModalOpenFn(false)}
      footer={[
        <span className={style.selectedNumber}>
          已选择{selectedQuestion.length}条数据
        </span>,
        <Button onClick={() => questionModalOpenFn(false)}>取消</Button>,
        <Button
          type='primary'
          onClick={() => {
            defaultQuestionOkFn();
          }}
          loading={loading}
        >
          确认选择
        </Button>,
      ]}
    >
      <div className={style.allCheck}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      </div>

      <Table
        columns={column}
        dataSource={dataSource}
        showHeader={false}
        rowKey='id'
        rowSelection={{
          ...rowSelection,
        }}
        className={style.tableBorder}
      />
    </Modal>
  );
};
