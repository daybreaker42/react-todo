import type { Task } from "@/types/task";
import Unfinished from '@/assets/icons/unfinished.svg?react';
import Finished from '@/assets/icons/finished.svg?react';


interface TaskProps{
  task: Task;
  index: number;
  toggleFinished: (index: number) => void;
  editTask: (id: number)=>void;
  removeTask: (id: number)=>void;
};
// 체크 icon size
const CHECK_ICON_SIZE = 25;

export default function Task({ task, index, toggleFinished, editTask, removeTask }: TaskProps) {
  return (
    <>
      <div className='flex gap-2 items-center'>
        {/* line no */}
        <span className='w-8 px-1 border-r-2'>{index + 1}</span>
        {/* finished checker */}
        <label>
          {task.finished ? <Finished width={CHECK_ICON_SIZE} height={CHECK_ICON_SIZE} /> :
            <Unfinished width={CHECK_ICON_SIZE} height={CHECK_ICON_SIZE} />}
          <input type="checkbox" checked={task.finished} onChange={() => toggleFinished(task.id)} tabIndex={-1}
            className='w-5 h-5 accent-blue-500' />
        </label>
        <div className="flex flex-col">
          <span className='task-text'>{task.text}</span>
          {task.detail ? <span className="text-gray-500">{task.detail}</span> : null}
        </div>
      </div>

      {/* task 수정/삭제 버튼 */}
      <div className='flex gap-4'>
        <button onClick={() => editTask(task.id)} className='border-2 border-green-500 hover:bg-green-500 text-white py-1 px-2 rounded'>
          수정
        </button>
        <button onClick={() => removeTask(task.id)} className='delete'>삭제</button>
      </div>
    </>
  );
}