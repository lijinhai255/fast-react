/**
 * @description:低碳问卷题目卡片
 */
import deleteIcon from '@src/image/icon-delete.svg';
import dndIcon from '@src/image/icon-dnd.svg';
import editIcon from '@src/image/icon-edit.svg';
import { Button, Card, Checkbox, Input, Radio, Tooltip } from 'antd';

import {
  postSupplychainQuestionDelete,
  QuestionnaireQuestionResp,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { questionTypes } from '@/views/supplyChainCarbonManagement/utils';

import style from './index.module.less';

const { RadioQuestion, CheckboxQuestion, DetermineQuestion, FillQuestion } =
  questionTypes;

const QuestionCard = (porps: {
  questionItem: QuestionnaireQuestionResp;
  index: number;
  showOnly?: boolean;
  getQuestionArr?: () => void;
  actionQuestion?: (drawerType: boolean, questionId?: number) => void;
}) => {
  const { questionItem, index, showOnly, getQuestionArr, actionQuestion } =
    porps;
  const { required, title, tips, questionType, id, optionList } = questionItem;

  /** 不同题型返回内容 */
  const questionTypeRender = (type: number) => {
    switch (type) {
      case RadioQuestion:
        return (
          <Radio.Group>
            {optionList?.map(item => {
              return (
                <>
                  <Radio
                    className={style.options}
                    key={item.optionId}
                    value={item.optionId}
                  >
                    <Tooltip title={item?.content}>
                      <p className={style.optionTextOverflow}>
                        {item.blankRequired && (
                          <span className={style.requiredStar}>*</span>
                        )}
                        {item?.content}
                      </p>
                    </Tooltip>
                    {item?.description && (
                      <Tooltip
                        title={item?.description}
                        className={style.optionsTip}
                      >
                        <p>{item?.description}</p>
                      </Tooltip>
                    )}
                    {(item.allowFillBlanks || item.blankRequired) && (
                      <Input
                        placeholder='请输入内容'
                        className={style.fillBlank}
                      />
                    )}
                  </Radio>
                  <br />
                </>
              );
            })}
          </Radio.Group>
        );
      case CheckboxQuestion:
        return (
          <Checkbox.Group>
            {optionList?.map(item => {
              return (
                <>
                  <Checkbox
                    className={style.options}
                    key={item.optionId}
                    value={item.optionId}
                  >
                    <Tooltip title={item?.content}>
                      <p className={style.optionTextOverflow}>
                        {item.blankRequired && (
                          <span className={style.requiredStar}>*</span>
                        )}
                        {item?.content}
                      </p>
                    </Tooltip>
                    {item?.description && (
                      <Tooltip
                        title={item?.description}
                        className={style.optionsTip}
                      >
                        <p>{item?.description}</p>
                      </Tooltip>
                    )}
                    {(item.allowFillBlanks || item.blankRequired) && (
                      <Input
                        placeholder='请输入内容'
                        className={style.fillBlank}
                      />
                    )}
                  </Checkbox>
                  <br />
                </>
              );
            })}
          </Checkbox.Group>
        );
      case DetermineQuestion:
        return (
          <Radio.Group>
            <Radio value className={style.labelText}>
              是
            </Radio>
            <Radio value={false} className={style.labelText}>
              否
            </Radio>
          </Radio.Group>
        );
      case FillQuestion:
        return <Input placeholder='请输入' />;
      default:
        return '';
    }
  };

  /** 删除 */
  const delFn = async () => {
    if (id) {
      await postSupplychainQuestionDelete({ req: { id } }).then(() => {
        /** 更新题目列表 */
        getQuestionArr?.();
      });
    }
  };

  return (
    <Card
      className={showOnly ? style.showOnly : style.questionCard}
      bordered={false}
    >
      <Tooltip title={title}>
        <h3 className={style.textOverflow}>
          {required && <span className={style.requiredStar}>*</span>}
          {index + 1}.{title}
        </h3>
      </Tooltip>

      <Tooltip title={tips}>
        <p className={style.textOverflowTips}>{tips}</p>
      </Tooltip>

      {questionTypeRender(Number(questionType))}

      {showOnly || (
        <div>
          <img src={dndIcon} alt='' className={style.dndIcon} />

          <div className={style.actionBtn}>
            <Button
              type='link'
              onClick={() => {
                actionQuestion?.(false, id);
              }}
            >
              <span>
                <img src={editIcon} alt='' /> 编辑
              </span>
            </Button>
            <Button
              type='link'
              onClick={() => {
                delFn();
              }}
            >
              <span>
                <img src={deleteIcon} alt='' /> 删除
              </span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
