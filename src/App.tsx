import { useState, useEffect, useRef } from 'react';
import type { Todo } from './types/todo';
import { getItem, setItem } from '@/utils/storage';

function App() {
  const addInputRef = useRef<HTMLInputElement>(null);
  // const editButtonRef = useRef<HTMLButtonElement>(null);
  // const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  // todo 정보 저장하는 리스트
  const [todoList, setTodoList] = useState<Todo[]>(() => {
    return getItem();
  });
  // 해당 todo 수정중인지 여부 리스트
  const [isEdittingList, setIsEdittingList] = useState<boolean[]>(() => {
    return todoList.map(() => false);
  });
  // todo input ref list
  const todoInputRefList = useRef<Array<HTMLInputElement | null>>([]);
  // const todoRefList = useRef

  /**
   * 할 일 추가 함수
   * - 입력 필드에서 텍스트를 가져와서 trim 후, 새로운 Todo 객체를 생성하고 todoList 상태에 추가
   * - 빈 문자열인 경우 에러 처리
   * @returns void
   * @example
   * addTodo(); // 사용자가 입력한 할 일을 todoList에 추가
   */
  const addTodo = () => {
    const inputRef = addInputRef.current;
    if (!inputRef) return;

    const text = inputRef.value.trim();
    if (!text) {
      inputRef.focus();
      inputRef.classList.add('error');
      return;
    }

    inputRef.classList.remove('error');
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      finished: false
    }
    setTodoList(prevList => [...prevList, newTodo]);  // todolist 업데이트
    inputRef.value = '';
    inputRef.focus();
  }

  /**
   * editTodo - 할 일 수정 함수
   */
  const editTodo = (index: number) => {

    if (isEdittingList[index]) {
      // 할 일 수정중이었다면 -> 수정 완료
      const currentInput = getCurrentInput(index);
      if (!currentInput) return;

      // 해당 input 안의 value
      const newValue: string = currentInput.value;
      if (!newValue) {
        // 칸이 비어있다면 error상태로 바꿈
        console.error(`editTodo() - no value in currentInput: `, newValue);
        currentInput.classList.add('error');
        return;
      }

      toggleEditList(index);
      // 문제없다면 todoList 갱신
      setTodoList(prevList => {
        const newList = [...prevList];
        newList[index].text = newValue;
        return newList;
      })
    } else {
      // 할 일 수정 시작
      // 먼저 editlist를 toggle해야 currentInput이 생겨서 toggle먼저 하고 나머지 처리
      toggleEditList(index);
      setTimeout(() => {
        const currentInput = getCurrentInput(index);
        if (!currentInput) return;
        currentInput.focus();
      }, 0);
    }
  }

  /**
   * todoInputRefList에서 index에 해당하는 ref가 있으면 return, 없으면 error출력 후 null 반환
   */
  const getCurrentInput = (index: number): HTMLInputElement | null => {
    const currentInput = todoInputRefList.current[index];
    if (!currentInput) {
      // 없으면 error 출력 후 return
      console.error(`editTodo() - no currentInput`);
      return null;
    }
    return currentInput;
  }
  /**
   * isEdittingList에서 주어진 index toggle
   */
  const toggleEditList = (index: number) => {
    setIsEdittingList(prev => {
      const newList = [...prev];
      newList[index] = !newList[index];  // 현재 todo의 수정 상태를 토글
      return newList;
    });

  }

  /**
   * removeTodo - 할 일 삭제 함수
   */
  const removeTodo = (index: number) => {
    setTodoList(prev => {
      const newTodo: Todo[] = prev.filter((_, todoIndex) => index !== todoIndex);
      return newTodo;
    });
  }

  /**
   * clearTodo - 할 일 전체 삭제 함수
   */
  const clearTodo = () => {
    const confirmResult = confirm('할 일을 모두 지우시겠습니까?');
    if (confirmResult) {
      setTodoList([]);
    }
  }

  /**
   * 해당 todo의 finished를 toggle하는 함수
   */
  const toggleFinished = (index: number) => {
    setTodoList(prev => {
      const newList = prev.map((todo, todoIndex) => {
        if (index == todoIndex) {
          return {
            ...todo,
            finished: !todo.finished
          };
        } else {
          return todo;
        }
      });
      return newList;
    })
  }

  // 키보드 이벤트 핸들러
  // - Enter 키를 누르면 addTodo 함수 호출
  const addKeyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  // todoList가 변경될 때마다 storage에 저장하는 로직
  useEffect(() => {
    setItem(todoList);
  }, [todoList]);

  return (
    <>
      {/* wrapper div */}
      <div className="container mx-auto max-w-3xl">
        {/* 제목 부분 */}
        <h1>To-do List</h1>
        {/* <h2>할 일 추가</h2> */}
        {/* 할 일 추가 부분 */}
        <div className='mt-8 flex justify-between items-center gap-4'>
          <input type="text" placeholder='할 일을 입력하세요' ref={addInputRef} onKeyDown={addKeyHandler}
            className='h-10 w-full border-2 border-gray-400 focus:border-blue-500 focus:border-2 p-2' />
          <button onClick={addTodo} ref={addButtonRef} className='w-36 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'>추가하기</button>
        </div>

        {/* 할 일 목록 */}
        <div className='flex justify-between items-center mt-8'>
          <h2>할 일 목록</h2>
          <button onClick={clearTodo} className='delete'>전체 삭제</button>
        </div>
        <ul id="content" className='mt-2 p-4'>
          {todoList.map((todo, index) => {
            return (
              <li key={todo.id} onDoubleClick={() => toggleFinished(index)}
                className={`border-b-1 last:border-none border-gray-300 p-2 flex justify-between items-center ${todo.finished ? 'finished' : ''}`}>
              {/* todo 내용 */}
              <div className='flex gap-2 items-center'>
                  {/* line no */}
                  <span className='w-8 px-1 border-r-2'>{index + 1}</span>
                  {/* finished checker */}
                  <input type="checkbox" checked={todo.finished} onChange={() => toggleFinished(index)} tabIndex={-1}
                    className='w-5 h-5 accent-blue-500' />
                {isEdittingList[index] ? (
                    // 내용 input
                    <input type='text' defaultValue={todo.text} id={`todo-input-${index}`} ref={(el) => { (todoInputRefList.current[index] = el) }}
                      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') {
                          editTodo(index);
                        }
                      }}
                      className={`border-2 border-gray-400 focus:border-blue-500 focus:border-2 p-2`} />
                  ) :
                    // 내용 text
                    <span className='todo-text'>{todo.text}</span>
                  }
              </div>

              {/* todo 수정/삭제 버튼 */}
              <div className='flex gap-4'>
                <button onClick={() => editTodo(index)} className='border-2 border-green-500 hover:bg-green-500 text-white py-1 px-2 rounded'>
                  {!isEdittingList[index] ? '수정' : '수정 완료'}
                </button>
                <button onClick={() => removeTodo(index)} className='delete'>삭제</button>
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
