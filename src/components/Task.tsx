import type { Task } from "@/types/task";
import Unfinished from '@/assets/icons/unfinished.svg?react'; // SVG를 기본 모듈로 가져오기
import Finished from '@/assets/icons/finished.svg?react'; // SVG를 기본 모듈로 가져오기


interface TaskProps{
  task: Task;
  index: number;
  toggleFinished: (index: number) => void;
  editTask: (id: number)=>void;
  removeTask: (id: number)=>void;
};

export default function Task({ task, index, toggleFinished, editTask, removeTask }: TaskProps) {
  return (
    <>
      <div className='flex gap-2 items-center'>
        {/* line no */}
        <span className='w-8 px-1 border-r-2'>{index + 1}</span>
        {/* finished checker */}
        <label>
          {task.finished ? <Finished width={30} height={30} /> :
            <Unfinished width={30} height={30} />}

          <input type="checkbox" checked={task.finished} onChange={() => toggleFinished(task.id)} tabIndex={-1}
            className='w-5 h-5 accent-blue-500' />
        </label>
        {/* {task.isEditting ? (
          // 내용 input
          <input type='text' defaultValue={task.text} id={`task-input-${index}`} ref={task.ref}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                editTask(task.id);
              }
            }}
            className={`border-2 border-gray-400 focus:border-blue-500 focus:border-2 p-2`} />
        ) :
          // 내용 text
          <span className='task-text'>{task.text}</span>
          } */}
        <span className='task-text'>{task.text}</span>
      </div>

      {/* task 수정/삭제 버튼 */}
      <div className='flex gap-4'>
        <button onClick={() => editTask(task.id)} className='border-2 border-green-500 hover:bg-green-500 text-white py-1 px-2 rounded'>
          {!task.isEditting ? '수정' : '수정 완료'}
        </button>
        <button onClick={() => removeTask(task.id)} className='delete'>삭제</button>
      </div>
    </>
  );
}