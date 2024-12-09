export interface Comment {
  id: number; // 댓글 ID
  quizId: number; // 해당 퀴즈 ID
  writer: {
    id: number;
    name: string;
    profileImageUrl: string;
  };
  parentCommentId: number; // 부모 댓글 ID (0이면 최상위 댓글)
  content: string; // 댓글 내용
  childComments?: Comment[]; // 대댓글 리스트 (없을 수도 있음)
  createdAt: string; // 생성 시간
  updatedAt: string; // 수정 시간
}
