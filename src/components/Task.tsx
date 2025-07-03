import type { Task } from "@/types/task";

interface TaskProps{
  index: number;
  task: Task;
  toggleFinished: (index: number)=>void;
  taskInputRefList: React.RefObject<Map<number, HTMLInputElement | null>>;
  editTask: (id: number)=>void;
  removeTask: (id: number)=>void;
};

export default function Task({task, index, toggleFinished, taskInputRefList, editTask, removeTask}: TaskProps){
  return (
    <li key={task.id} onDoubleClick={() => toggleFinished(task.id)}
      className={`border-b-1 last:border-none border-gray-300 p-2 flex justify-between items-center ${task.finished ? 'finished' : ''}`}>
      {/* task 내용 */}
      <div className='flex gap-2 items-center'>
        {/* line no */}
        <span className='w-8 px-1 border-r-2'>{index + 1}</span>
        {/* finished checker */}
        <input type="checkbox" checked={task.finished} onChange={() => toggleFinished(index)} tabIndex={-1}
          className='w-5 h-5 accent-blue-500' />
        {task.isEditting ? (
          // 내용 input
          <input type='text' defaultValue={task.text} id={`task-input-${index}`} ref={(el) => { (taskInputRefList.current.set(task.id, el)) }}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                editTask(task.id);
              }
            }}
            className={`border-2 border-gray-400 focus:border-blue-500 focus:border-2 p-2`} />
        ) :
          // 내용 text
          <span className='task-text'>{task.text}</span>
        }
      </div>

      {/* task 수정/삭제 버튼 */}
      <div className='flex gap-4'>
        <button onClick={() => editTask(task.id)} className='border-2 border-green-500 hover:bg-green-500 text-white py-1 px-2 rounded'>
          {!task.isEditting ? '수정' : '수정 완료'}
        </button>
        <button onClick={() => removeTask(task.id)} className='delete'>삭제</button>
      </div>
    </li>
  );
}