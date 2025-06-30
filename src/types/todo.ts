export type Task = {
  id: number;
  text: string;
  finished: boolean;
  isEditting?: boolean; // 기본값 = false
  date?: string; // 날짜 추가를 위한 필드
}