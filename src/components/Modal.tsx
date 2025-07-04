import { useRef, useState } from "react";
import type { Modal } from "@/types/task";

interface ModalProps{
  content: Modal;
  closeModal: () => void;
}

export default function Modal({ content, closeModal }: ModalProps) {
  const [textVal, setTextVal] = useState(content.text);
  const [detailVal, setDetailVal] = useState(content.detail ?? '');
  const [dateValue, setDateValue] = useState(content.date ?? '');


  const textRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  return (
    <>

        <header className='flex justify-between'>
          <h2>할 일 수정</h2>
          {/* 그냥 닫는 버튼 */}
          <button onClick={() => { closeModal(); }} className='hover:text-blue-500'>close</button>
        </header>

        <ul>
          <li>
            <label className='my-4 flex flex-col items-start gap-2'>
              <h3>할 일 내용</h3>
            <input ref={textRef} className='outline-3 outline-white rounded focus:outline-blue-500 w-full ml-2' value={textVal} onChange={e => setTextVal(e.target.value)} />
            </label>
          </li>
          <li>
            <label className='my-4 flex flex-col items-start gap-2'>
              <h3>상세 내용</h3>
            <input ref={detailRef} className='outline-3 outline-white rounded focus:outline-blue-500 w-full ml-2' value={detailVal} onChange={e => setDetailVal(e.target.value)} />
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
      <button onClick={() => closeModal(content)} className='bg-[var(--primary-color)] rounded px-4 py-2 hover:bg-blue-700'>저장하고 닫기</button>
    </>
  );
}