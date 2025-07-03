import type { Task, TaskWithoutEditting } from '@/types/task';

/**
 * localstorage 접근용 객체 (const)
 * - getItem, setItem, clearItem 사용 가능
 */
const myStorage = window.localStorage;

/**
 * setItem - 로컬스토리지에 Task[] (todoList) 저장
 * @param todoList - Task[] 타입의 할 일 목록
 * @return boolean - 저장 성공 여부
 */
export function setItem(todoList: Task[]): boolean {
    // 로컬 스토리지에 저장하기 전에 각 Task 객체에서 'isEditting' 속성을 제거합니다.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const todoListWithoutIsEditting = todoList.map(({ isEditting, ref, ...rest }) => rest);
    myStorage.setItem('todoList', JSON.stringify(todoListWithoutIsEditting));
    return true;
}

/**
 * getItem - 로컬스토리지에서 Task[] (todoList) 가져오기
 * @return Task[] - 로컬스토리지에 저장된 할 일 목록 (없으면 빈 배열)
 */
export function getItem(): Task[] {
    const todoList = myStorage.getItem('todoList');
    if (todoList) {
        const parsedList: TaskWithoutEditting[] = JSON.parse(todoList);
        return parsedList.map(todo => ({ ...todo, isEditting: false, ref: null })) as Task[];
    }
    return [] as Task[];
}

/**
 * 로컬스토리지 아이템 전체 제거
 */
export function clearItem(): boolean {
    myStorage.clear();
    return true;
}