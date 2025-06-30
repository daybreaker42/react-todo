/**
 * Task type
 * - 할 일을 기록하는 type
 */
export type Task = {
  id: number;
  text: string;
  finished: boolean;
  isEditting?: boolean; // 기본값 = false
  date?: string; // 날짜 추가를 위한 필드
  tag?: Tag;
  subtask?: Array<SubTask>;
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