import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/shadcn/ui/drawer';
import Icon from '@eolluga/eolluga-ui/icon/Icon';
import CommentSection from '../comments/CommentSection';
import { useEffect, useState } from 'react';
import CommentInput from '../comments/CommentInput';
import useFetchComments from '@/api/comments/fetchComments';
import useAddComment from '@/api/comments/addComments';
import useDeleteComment from '@/api/comments/deleteComments';
import ToastMessage from './ToastMessage';

interface BottomSheetProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  quizId: number;
}

export default function BottomSheet({ isOpen, setOpen, quizId }: BottomSheetProps) {
  const { comments, loading, fetchComments } = useFetchComments(quizId);
  const addCommentMutation = useAddComment(quizId);
  const deleteCommentMutation = useDeleteComment(quizId);
  const [inputPlaceholder, setInputPlaceholder] = useState('댓글을 입력하세요...');
  const [parentCommentId, setParentCommentId] = useState<number>(0);

  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState<'check' | 'warning'>('check');
  const [isToastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log(`fetchComments 호출 ${quizId}`);
      fetchComments()
        .then(() => console.log('댓글 데이터 로드 완료'))
        .catch((err) => console.error('댓글 데이터 로드 실패:', err));
    }
  }, [isOpen, fetchComments]);

  const handleAddComment = (content: string) => {
    addCommentMutation.mutate(
      { parentCommentId, content },
      {
        onSuccess: () => {
          setParentCommentId(0);
          setInputPlaceholder('댓글을 입력하세요...');
          fetchComments();

          setToastMessage('댓글이 등록되었습니다.');
          setToastIcon('check');
          setToastOpen(true);
        },
        onError: () => {
          setToastMessage('댓글 등록에 실패했습니다.');
          setToastIcon('warning');
          setToastOpen(true);
        },
      },
    );
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        fetchComments();

        setToastMessage('댓글이 삭제되었습니다.');
        setToastIcon('check');
        setToastOpen(true);
      },
      onError: () => {
        setToastMessage('댓글 삭제에 실패했습니다.');
        setToastIcon('warning');
        setToastOpen(true);
      },
    });
  };

  const handleReply = (replyParentId: number) => {
    setParentCommentId(replyParentId);
    setInputPlaceholder('답글을 입력하세요...');
    console.log(replyParentId);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setOpen}>
        <DrawerContent
          className="min-h-[80dvh] max-h-[80dvh] w-full bg-white border-t-2 flex flex-col"
          aria-describedby="set-positions"
        >
          <DrawerHeader className="relative flex-shrink-0">
            <DrawerTitle>댓글</DrawerTitle>
            <DrawerDescription />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="absolute top-5 right-7"
                onClick={() => setOpen(!isOpen)}
              >
                <Icon icon="close" />
              </button>
            </div>
          </DrawerHeader>
          <CommentInput onSubmit={handleAddComment} placeholder={inputPlaceholder} />
          <CommentSection
            comments={comments}
            loading={loading}
            onDelete={handleDeleteComment}
            onReply={handleReply}
          />
          <ToastMessage
            message={toastMessage}
            icon={toastIcon}
            open={isToastOpen}
            setOpen={setToastOpen}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
