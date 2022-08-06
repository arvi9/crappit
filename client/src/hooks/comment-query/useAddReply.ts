import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutateResponse extends Response {
  comment: Comment;
}

interface MutationParams {
  commentId: number,
  reply: {
    content: string,
    postId: number
  }
}

async function addReply({ commentId, reply }: MutationParams) {
  try {
    const res = await axios.post(`/api/comment/${commentId}/reply`, reply);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddReply(comment: Comment) {
  return useMutation<MutateResponse, Error, MutationParams>(addReply, {
    onSuccess: (res) => {
      comment.children = [res.comment, ...comment.children];
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
