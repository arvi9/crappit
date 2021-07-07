import React from "react";
import { IconButton, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { useUser } from "../../context/UserState";
import Link from "next/link";
import useCommentVoting from "../../hooks/comment-query/useCommentVoting";
import { Comment } from "src/types/entities/comment";

type Props = {
	comment: Comment;
};

const CommentVoting = ({ comment }: Props) => {
	const { user } = useUser();
	const { mutate } = useCommentVoting(comment);
	const bg = useColorModeValue(`gray.100`, `whiteAlpha.200`);

	const handleUpvote = () => {
		mutate({
			commentId: comment.id,
			vote: "like",
		});
	};

	const handleDownvote = () => {
		mutate({
			commentId: comment.id,
			vote: "dislike",
		});
	};

	return (
		<HStack>
			{user ? (
				<IconButton
					aria-label="Upvote"
					onClick={handleUpvote}
					size="xs"
					icon={<TriangleUpIcon />}
					variant="ghost"
					color={comment.user_vote === 1 ? "orange.400" : ""}
					_hover={{ color: "orange.400", backgroundColor: bg }}
				/>
			) : (
				<Link href="/login" passHref>
					<IconButton
						aria-label="Upvote"
						size="xs"
						icon={<TriangleUpIcon />}
						variant="ghost"
						_hover={{ color: "orange.400", backgroundColor: bg }}
					/>
				</Link>
			)}
			<Text
				color={
					user
						? comment.user_vote === 1
							? "orange.400"
							: comment.user_vote === -1
								? "blue.600"
								: ""
						: ""
				}
				fontWeight="500"
			>
				{comment.vote}
			</Text>
			{user ? (
				<IconButton
					aria-label="Downvote"
					onClick={handleDownvote}
					size="xs"
					icon={<TriangleDownIcon />}
					variant="ghost"
					color={comment.user_vote === -1 ? "blue.600" : ""}
					_hover={{ color: "blue.600", backgroundColor: bg }}
				/>
			) : (
				<Link passHref href="/login">
					<IconButton
						aria-label="Downvote"
						as="a"
						size="xs"
						icon={<TriangleDownIcon />}
						variant="ghost"
						_hover={{ color: "blue.600", backgroundColor: bg }}
					/>
				</Link>
			)}
		</HStack>
	);
};

export default CommentVoting;
