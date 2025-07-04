import { useRef, useState } from "react";
import type { Task } from "@/types/task";

interface ModalProps{
  modalRef:React.RefObject<HTMLDialogElement | null>;
  closeModal: () => void;
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function Modal({modalRef, closeModal, taskList, setTaskList} : ModalProps){
  const currentTask = taskList.filter(task => task.isEditting)[0];
  // if(!currentTask) return;
  const [textVal, setTextVal] = useState(currentTask?.text);
  const [detailVal, setDetailVal] = useState(currentTask?.detail ?? '');
  const [dateValue, setDateValue] = useState(currentTask?.date ?? '');


  const textRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  return (
    <>
    <dialog ref={modalRef} className='mx-auto my-auto w-100 h-100 rounded bg-gray-900 outline-3 outline-[var(--primary-color)] text-white text-center p-4'>
        <header className='flex justify-between'>
          <h2>할 일 수정</h2>
          {/* 그냥 닫는 버튼 */}
          <button onClick={() => { closeModal(); }} className='hover:text-blue-500'>close</button>
        </header>

        <ul>
          <li>
            <label className='my-4 flex flex-col items-start gap-2'>
              <h3>할 일 내용</h3>
              <input ref={textRef} className='outline-3 outline-white rounded focus:outline-blue-500 w-full ml-2' value={textVal} />
            </label>
          </li>
          <li>
            <label className='my-4 flex flex-col items-start gap-2'>
              <h3>상세 내용</h3>
              <input ref={detailRef} className='outline-3 outline-white rounded focus:outline-blue-500 w-full ml-2' value={detailVal} />
            </label>
          </li>
          <li>
            <label className='my-4 flex flex-col items-start gap-2'>
              <h3>D-day 설정</h3>
              <input type='date' ref={dateRef} className='outline-3 outline-white rounded focus:outline-blue-500 ml-2' value={dateValue} 
                onFocus={e => {
                  if (e.target.showPicker) e.target.showPicker();
                }}
                onChange={e => setDateValue(e.target.value)}
                />
            </label>
          </li>
        </ul>
        {/* 저장하고 닫는 버튼 */}
        <button onClick={() => closeModal()} className='bg-[var(--primary-color)] rounded px-4 py-2 hover:bg-blue-700'>저장하고 닫기</button>
      </dialog>
    </>
  );
}