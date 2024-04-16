/**
 * 低碳问卷 新增/编辑-设计问卷 题目展示-拖拽排序
 */
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import { QuestionnaireQuestionResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

import { SortableItem } from './SortableItem';

export default function QuestionsShow(props: {
  questionArr: QuestionnaireQuestionResp[];
  getQuestionArr: () => void;
  actionQuestion: (drawerType: boolean, questionId?: number) => void;
  getCurrentOrderArr: (orderArr: number[]) => void;
}) {
  const { questionArr, getQuestionArr, actionQuestion, getCurrentOrderArr } =
    props;

  const [items, setItems] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      /** 解决点击事件不生效问题 拖动距离>5拖拽生效 */
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setItems(item => {
        const oldIndex = item.findIndex(
          (val: QuestionnaireQuestionResp) => val.id === active?.id,
        );
        const newIndex = item.findIndex(
          (val: QuestionnaireQuestionResp) => val.id === over?.id,
        );
        return arrayMove(item, oldIndex, newIndex);
      });
    }
  };

  /** 排序数组 */
  useEffect(() => {
    const currentOrder = items?.map((item: { id: number }) => item.id);
    getCurrentOrderArr(currentOrder);
  }, [items]);

  useEffect(() => {
    setItems(questionArr);
  }, [questionArr]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items?.map((item: QuestionnaireQuestionResp, index) => (
          <SortableItem
            key={item?.id}
            id={Number(item?.id)}
            questionItem={item}
            index={index}
            getQuestionArr={getQuestionArr}
            actionQuestion={actionQuestion}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
