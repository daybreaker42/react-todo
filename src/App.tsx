import { useState, useEffect, useRef } from 'react';
import type { Task } from './types/task';
import { getItem, setItem } from '@/utils/storage';

function App() {
  const addInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  // task 정보 저장하는 리스트
  const [taskList, setTaskList] = useState<Task[]>(() => {
    return getItem();
  });
  // task input ref list
  // {task id, ref 저장}
  const taskInputRefList = useRef<Map<number, HTMLInputElement | null>>(new Map());

  /**
   * 할 일 추가 함수
   * - 입력 필드에서 텍스트를 가져와서 trim 후, 새로운 Task 객체를 생성하고 taskList 상태에 추가
   * - 빈 문자열인 경우 에러 처리
   * @returns void
   * @example
   * addTask(); // 사용자가 입력한 할 일을 taskList에 추가
   */
  const addTask = () => {
    const inputRef = addInputRef.current;
    if (!inputRef) return;

    const text = inputRef.value.trim();
    if (!text) {
      inputRef.focus();
      inputRef.classList.add('error');
      return;
    }

    inputRef.classList.remove('error');
    const newTask: Task = {
      id: Date.now(),
      text: text,
      finished: false
    }
    setTaskList(prevList => [...prevList, newTask]);  // tasklist 업데이트
    inputRef.value = '';
    inputRef.focus();
  }

  /**
   * editTask - 할 일 수정 함수
   */
  const editTask = (id: number) => {
    taskList.forEach((task) => {
      if (task.id === id) {
        if (task.isEditting) {
  // 할 일 수정중이었다면 -> 수정 완료
          const currentInput = getCurrentInput(id);
          if (!currentInput) return;

          // 해당 input 안의 value
          const newValue: string = currentInput.value;
          if (!newValue) {
            // 칸이 비어있다면 error상태로 바꿈
            console.error(`editTask() - no value in currentInput: `, newValue);
            currentInput.classList.add('error');
            return;
          }

          toggleEditList(id);
          // 문제없다면 taskList 갱신
          setTaskList(prevList => {
            const newList = [...prevList];
            newList[id].text = newValue;
            return newList;
          })
        } else {
          // 할 일 수정 시작
          // 먼저 editlist를 toggle해야 currentInput이 생겨서 toggle먼저 하고 나머지 처리
          toggleEditList(id);
          setTimeout(() => {
            const currentInput = getCurrentInput(id);
            if (!currentInput) return;
            currentInput.focus();
          }, 0);
        }
      }
    });
  }

  /**
   * taskInputRefList에서 index에 해당하는 ref가 있으면 return, 없으면 error출력 후 null 반환
   */
  const getCurrentInput = (index: number): HTMLInputElement | null => {
    const currentInput = taskInputRefList.current.get(index);
    if (!currentInput) {
      // 없으면 error 출력 후 return
      console.error(`editTask() - no currentInput`);
      return null;
    }
    return currentInput;
  }
  /**
   * isEdittingList에서 주어진 index toggle
   */
  const toggleEditList = (id: number) => {
    setTaskList(tasks => {
      const newList = tasks.filter(task => task.id !== id);
      return newList;
    });
  }

  /**
   * removeTask - 할 일 삭제 함수
   */
  const removeTask = (id: number) => {
    setTaskList(prev => {
      const newTask: Task[] = prev.filter(task => task.id !== id);
      return newTask;
    });
  }

  /**
   * clearTask - 할 일 전체 삭제 함수
   */
  const clearTask = () => {
    const confirmResult = confirm('할 일을 모두 지우시겠습니까?');
    if (confirmResult) {
      setTaskList([]);
    }
  }

  /**
   * 해당 task의 finished를 toggle하는 함수
   */
  const toggleFinished = (index: number) => {
    setTaskList(prev => {
      const newList = prev.map((task, taskIndex) => {
        if (index == taskIndex) {
          return {
            ...task,
            finished: !task.finished
          };
        } else {
          return task;
        }
      });
      return newList;
    })
  }

  // 키보드 이벤트 핸들러
  // - Enter 키를 누르면 addTask 함수 호출
  const addKeyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTask();
    }
  }

  // taskList가 변경될 때마다 storage에 저장하는 로직
  useEffect(() => {
    setItem(taskList);
  }, [taskList]);

  return (
    <>
      {/* wrapper div */}
      <div className="container mx-auto max-w-3xl px-2">
        {/* 제목 부분 */}
        <h1>To-do List</h1>
        {/* <h2>할 일 추가</h2> */}
        {/* 할 일 추가 부분 */}
        <div className='mt-8 flex justify-between items-center gap-4'>
          <input type="text" placeholder='할 일을 입력하세요' ref={addInputRef} onKeyDown={addKeyHandler}
            className='h-10 w-full border-2 border-gray-400 focus:border-blue-500 focus:border-2 p-2' />
          <button onClick={addTask} ref={addButtonRef} className='w-36 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'>추가하기</button>
        </div>

        {/* 할 일 목록 */}
        <div className='flex justify-between items-center mt-8'>
          <h2>할 일 목록</h2>
          <button onClick={clearTask} className='delete'>전체 삭제</button>
        </div>
        <ul id="content" className='mt-2 p-4'>
          {taskList.filter(task => !task.finished).map((task, index) => {
            return (
              <li key={task.id} onDoubleClick={() => toggleFinished(index)}
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
                    <input type='text' defaultValue={task.text} id={`task-input-${index}`} ref={(el) => { (taskInputRefList.current.set(index, el)) }}
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
          })}
        </ul>

        {/* 완료된 할 일 보기 */}
        <div className='flex justify-between items-center mt-8'>
          <h2>완료된 할 일 목록</h2>
          {/* <button onClick={clearTask} className='delete'>전체 삭제</button> */}
        </div>
        <ul id="content" className='mt-2 p-4'>
          {taskList.filter(task => task.finished).map((task, index) => {
            return (
              <li key={task.id} onDoubleClick={() => toggleFinished(index)}
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
                    <input type='text' defaultValue={task.text} id={`task-input-${index}`} ref={(el) => { (taskInputRefList.current.set(index, el)) }}
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
                  {/* <button onClick={() => editTask(index)} className='border-2 border-green-500 hover:bg-green-500 text-white py-1 px-2 rounded'>
                  {!task.isEditting ? '수정' : '수정 완료'}
                </button> */}
                  <button onClick={() => removeTask(task.id)} className='delete'>삭제</button>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </>
  )
}

export default App
