/**
 * TaskWithEssentials type
 * - localstorage 저장 시 사용되는 type
 */
export type TaskWithEssentials = {
  id: number;
  text: string;
  detail?: string;
  finished: boolean;
  date?: string; // 날짜 추가를 위한 필드
  tag?: Tag;
  subtask?: Array<SubTask>;
}

/**
 * Task type
 * - 할 일을 기록하는 type
 */
export type Task = TaskWithEssentials & {
  // 저장되지는 않는데 기능을 위해 필요한 필드
  isEditting: boolean; // 기본값 = false
  ref: React.RefObject<HTMLInputElement | null> | null; // input ref 저장용
}

export type Modal = {
  taskId: number;
  text: string;
  detail: string;
  date: string;
}

/**
 * type: SubTask
 * - type 하위 할 일들을 저장
 * - 여기서부턴 단순히 이름, 끝났는지 여부만 저장
 */
export type SubTask = {
  id: number;
  text: string;
  finished: boolean;
}

/**
 * type: Tag
 * - 할 일들을 묶어주는 tag
 * - trim() 후 저장됨.
 * - 단순 string 비교로 일치 판단
 */
export type Tag = {
  name: string;
}