import { useEffect, useState } from "react";
import type { Modal } from "@/types/task";

interface ModalProps{
  content: Modal;
  closeModal: (content?: Modal) => void;
}

export default function Modal({ content, closeModal }: ModalProps) {
  // 수정: 로컬 상태로 관리
  const [textVal, setTextVal] = useState(content.text);
  const [detailVal, setDetailVal] = useState(content.detail ?? '');
  const [dateValue, setDateValue] = useState(content.date ?? '');

  useEffect(() => {
    console.log(`content - ${JSON.stringify(content)}`);
    console.log(`textVal - ${JSON.stringify(textVal)}`);
    console.log(`detailVal - ${JSON.stringify(detailVal)}`);
    console.log(`dateValue - ${JSON.stringify(dateValue)}`);
  }, []);

  useEffect(() => {
    setTextVal(content.text);
    setDetailVal(content.detail ?? '');
    setDateValue(content.date ?? '');
  }, [content]);

  // 주석: input의 value와 onChange를 로컬 상태로 연결
  return (
    <>
      <header className='flex justify-between'>
        <h2>할 일 수정</h2>
        <button onClick={() => { closeModal(); }} className='hover:text-blue-500'>close</button>
      </header>
      <ul>
        <li>
          <label className='my-4 flex flex-col items-start gap-2'>
            <h3>할 일 내용</h3>
            <input
              className='outline-3 outline-white rounded focus:outline-blue-500 w-full ml-2'
              value={textVal}
              onChange={e => setTextVal(e.target.value)} // 주석: 로컬 상태로 관리
            />
          </label>
        </li>
        <li>
          <label className='my-4 flex flex-col items-start gap-2'>
            <h3>상세 내용</h3>
            <input
              className='outline-3 outline-white rounded focus:outline-blue-500 w-full ml-2'
              value={detailVal}
              onChange={e => setDetailVal(e.target.value)} // 주석: 로컬 상태로 관리
            />
          </label>
        </li>
        <li>
          {/* NOTE: 여기서 htmlFor 설정 안하면 button까지 label이 적용되어버림 */}
          <label className='my-4 flex flex-col items-start gap-2' htmlFor='modal-date'>
            <div className="flex justify-between w-full">
              <h3>D-day 설정</h3>
              {/* clear 버튼 누르면 date 지워짐 */}
              <button className="hover:text-blue-500" onClick={() => { setDateValue('') }}>clear</button>
            </div>
            <input
              id='modal-date'
              type='date'
              className='outline-3 outline-white rounded focus:outline-blue-500 ml-2'
              value={dateValue}
              onFocus={e => { if (e.target.showPicker) e.target.showPicker(); }}
              onChange={e => setDateValue(e.target.value)} // 주석: 로컬 상태로 관리
            />
          </label>
        </li>
      </ul>
      {/* 저장하고 닫는 버튼 */}
      <button
        onClick={() => closeModal({
          ...content,
          text: textVal,
          detail: detailVal,
          date: dateValue
        })}
        className='bg-[var(--primary-color)] rounded px-4 py-2 hover:bg-blue-700'
      >
        저장하고 닫기
      </button>
    </>
  );
}