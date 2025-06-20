import type { Todo } from '@/types/todo';

/**
 * localstorage 접근용 객체 (const)
 * - getItem, setItem, clearItem 사용 가능
 */
const myStorage = window.localStorage;

/**
 * setItem - 로컬스토리지에 Todo[] (todoList) 저장
 * @param todoList - Todo[] 타입의 할 일 목록
 * @return boolean - 저장 성공 여부
 */
export function setItem(todoList: Todo[]): boolean {
    myStorage.setItem('todoList', JSON.stringify(todoList));
    return true;
}

/**
 * getItem - 로컬스토리지에서 Todo[] (todoList) 가져오기
 * @return Todo[] - 로컬스토리지에 저장된 할 일 목록 (없으면 빈 배열)
 */
export function getItem(): Todo[] {
    const todoList = myStorage.getItem('todoList');
    if (todoList) {
        return JSON.parse(todoList) as Todo[];
    }
    return [];
}

/**
 * 로컬스토리지 아이템 전체 제거
 */
export function clearItem(): boolean {
    myStorage.clear();
    return true;
}