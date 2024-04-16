import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { QuestionnaireQuestionResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

import QuestionCard from '../QuestionCard';

export function SortableItem(props: {
  id: number;
  questionItem: QuestionnaireQuestionResp;
  index: number;
  getQuestionArr: () => void;
  actionQuestion: (drawerType: boolean, questionId?: number) => void;
}) {
  const { id, questionItem, index, getQuestionArr, actionQuestion } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <QuestionCard
        questionItem={questionItem}
        index={index}
        getQuestionArr={getQuestionArr}
        actionQuestion={actionQuestion}
      />
    </div>
  );
}
