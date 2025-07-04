import { useState, useEffect, useRef, createRef } from 'react';
import type { Task, Modal } from '@/types/task';
import { getItem, setItem } from '@/utils/storage';
import ModalC from '@/components/Modal';
import TaskC from '@/components/Task';

// svg icons
import Icon from '@/assets/icons/icon.svg?react';

function App() {
  const addInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null); // 모달 ref 타입 지정

  // task 정보 저장하는 리스트
  const [taskList, setTaskList] = useState<Task[]>(() => {
    return getItem();
  });
  // task input ref list
  // {task id, ref 저장}
  // const taskInputRefList = useRef<Map<number, HTMLInputElement | null>>(new Map());

  // modal 정보 설정
  const [modalContent, setModalContent] = useState<Modal>({ taskId: -1, text: '', detail: '', date: '' });

  // taskList에서 edit등으로 상태 바뀐게 있으면 modal에 해당 값 넣기
  useEffect(() => {
    const currTask = taskList.find(task => task.isEditting);
    if (currTask) {
      // 수정중인 task가 있을 때
      setModalContent({
        taskId: currTask.id,
        text: currTask.text,
        detail: currTask.detail ?? '',
        date: currTask.date ?? ''
      });
    }
  }, [taskList]);

  // 위에서 modalcontent가 변경되었을 때 - 수정중이면 openModal 실행
  useEffect(() => {
    if (modalContent.taskId !== -1) {
      // console.log(`currTask - ${JSON.stringify(currTask)}`);
      console.log(`modalContent - ${JSON.stringify(modalContent)}`);

      openModal();
    }
  }, [modalContent]);

  /**
   * 할 일 추가 함수
   * - 입력 필드에서 텍스트를 가져와서 trim 후, 새로운 Task 객체를 생성하고 taskList 상태에 추가
   * - 빈 문자열인 경우 에러 처리
   * @returns void
   * @example
   * MARK: addTask(); // 사용자가 입력한 할 일을 taskList에 추가
   */
  const addTask = () => {
    const inputRef = addInputRef.current;
    if (!inputRef) return;

    const text = inputRef.value.trim();
    if (!text) {
      // 텍스트 없을 때 - error state로 input창 바꾸고 return
      inputRef.focus();
      inputRef.classList.add('error');
      return;
    }

    inputRef.classList.remove('error');
    const newTask: Task = {
      id: Date.now(),
      text: text,
      finished: false,
      isEditting: false,
      ref: null,
    }
    setTaskList(prevList => [...prevList, newTask]);  // tasklist 업데이트
    inputRef.value = '';
    inputRef.focus();
  }

  /**
   * MARK: editTask - 할 일 수정 함수
   */
  const editTask = (id: number) => {
    toggleTaskEdit(id);

    // const currTask = taskList.find(task => task.id === id);
    // if (!currTask) {
    //   console.error(`error - editTask() | no task found by ${id}`);
    //   return;
    // }
    // setModalContent({
    //   taskId: currTask.id,
    //   text: currTask.text,
    //   detail: currTask.detail ?? '',
    //   date: currTask.date ?? ''
    // });
    // // toggleTaskEdit(id); // 해당 task 수정중으로 변경
    // setTimeout(() => {
    // //   console.log(`currTask - ${JSON.stringify(currTask)}`);
    // //   console.log(`modalContent - ${JSON.stringify(modalContent)}`);
    //   toggleTaskEdit(id);
    //   //   openModal();
    // }, 0);
  }

  /**
   * toggleTaskEdit
   * - 해당 id의 task의 isEditting을 toggle
   */
  const toggleTaskEdit = (id: number) => {
    setTaskList(prevList =>
      prevList.map(task => {
        if (task.id !== id) return task;
        if (task.isEditting) {
          const currentInput = task.ref?.current;
          if (!currentInput) {
            console.error(`error - currentInput is null | id : ${id}`);
            return task;
          }
          return { ...task, isEditting: false, text: currentInput.value };
        } else {
          return { ...task, isEditting: true, ref: createRef<HTMLInputElement>() };
        }
      }));
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
  const toggleFinished = (id: number) => {
    setTaskList(prev => prev.map((task) => {
      if (id == task.id) {
          return {
            ...task,
            finished: !task.finished
          };
        } else {
          return task;
        }
    }));
  }

  /**
   * modal open
   */
  const openModal = () => {
    modalRef.current?.showModal();
  }

  /**
   * modal close
   */
  const closeModal = (content?: Modal) => {
    if (content) {
      setTaskList(prev => prev.map(task =>
        task.id !== content.taskId
          ? task :
          {
            ...task,
            text: content.text,
            detail: content.detail,
            date: content.date,
            isEditting: false,
          }
      ));
    } else {
      setTaskList(prev => prev.map(task =>
        task.id !== modalContent.taskId
          ? task :
          {
            ...task,
            isEditting: false,
          }
      ));
    }

    setModalContent({
      taskId: -1,
      text: '',
      detail: '',
      date: ''
    });
    modalRef.current?.close();
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

  // MARK: 앱 시작
  return (
    <>
      <dialog ref={modalRef} className='mx-auto my-auto w-100 h-100 rounded bg-gray-900 outline-3 outline-[var(--primary-color)] text-white text-center p-4'>
        <ModalC content={modalContent} closeModal={closeModal} />
      </dialog>
      {/* wrapper div */}
      <div className="container mx-auto max-w-3xl p-2">
        {/* title image */}
        <Icon width={100} height={100} className='mx-auto' />
        {/* 제목 부분 */}
        <h1 className='text-2xl font-bold text-center'>To-do List</h1>
        {/* <h2>할 일 추가</h2> */}
        {/* 할 일 추가 부분 */}
        <div className='mt-8 flex justify-between items-center gap-4'>
          <input type="text" placeholder='할 일을 입력하세요' ref={addInputRef} onKeyDown={addKeyHandler}
            className='h-10 w-full border-2 border-gray-400 focus:border-blue-500 focus:border-2 p-2 rounded outline-none' />
          <button onClick={addTask} ref={addButtonRef} className='w-36 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'>추가하기</button>
        </div>

        {/* 할 일 목록 */}
        <div className='flex justify-between items-center mt-8'>
          <h2>할 일 목록</h2>
          <button onClick={clearTask} className='delete'>전체 삭제</button>
        </div>
        <ul id="ongoing-content" className='mt-2 p-4'>
          {taskList.filter(task => !task.finished).map((task, index) => {
            return (
              <li key={task.id} className={`border-b-1 last:border-none border-gray-300 p-2 flex justify-between items-center`}>
                <TaskC index={index} task={task} toggleFinished={toggleFinished} editTask={editTask} removeTask={removeTask} />
              </li>
            );
          })}
        </ul>

        {/* 완료된 할 일 보기 */}
        <div className='flex justify-between items-center mt-8'>
          <h2>완료된 할 일 목록</h2>
          {/* <button onClick={clearTask} className='delete'>전체 삭제</button> */}
        </div>
        <ul id="finished-content" className='mt-2 p-4'>
          {taskList.filter(task => task.finished).map((task, index) => {
            return (
              <li key={task.id} className={`border-b-1 last:border-none border-gray-300 p-2 flex justify-between items-center finished`}>
                <TaskC index={index} task={task} toggleFinished={toggleFinished} editTask={editTask} removeTask={removeTask} />
              </li>
            );
          })}
        </ul>

      </div>
    </>
  )
}

export default App
