import React, { useContext, useState } from "react";
import {
	Box,
	Text,
	HStack,
	VStack,
	Button,
	Flex,
	useColorModeValue,
} from "@chakra-ui/react";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../context/UserState";
import DeleteCommentModerator from "./DeleteCommentModerator";

const CommentItem = ({ comment, topic }) => {
	const { user } = useContext(UserContext);
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);
	const color = useColorModeValue("gray.300", "gray.600");
	const colorHover = useColorModeValue("gray.500", "gray.300");
	const location = useLocation();

	console.log(comment, topic);

	return (
		<>
			<Box mt="5">
				<VStack align="left">
					<Text fontSize="xs">
						{comment.author ? (
							<Link to={`/user/${comment.authorId}`}>{comment.author}</Link>
						) : (
							"[deleted]"
						)}
						{" | "}
						{moment(comment.created_at).fromNow()}
						{comment.updated_at && (
							<>
								{" | "}
								<i>edited {moment(comment.updated_at).fromNow()}</i>
							</>
						)}
					</Text>
					{openEdit ? (
						<UpdateComment
							comment={comment}
							openEdit={openEdit}
							setOpenEdit={setOpenEdit}
						/>
					) : (
						<>
							<Text>{comment.content ? comment.content : "[deleted]"}</Text>
							{comment.content ? (
								<HStack>
									<CommentVoting comment={comment} />
									{user !== null ? (
										<>
											<Button
												size="xs"
												onClick={() => setOpenReply(!openReply)}
												variant="ghost"
											>
												Reply
											</Button>
											{user.id === comment.author_id && (
												<>
													<DeleteComment comment={comment} />
													<Button
														size="xs"
														onClick={() => setOpenEdit(!openEdit)}
														variant="ghost"
													>
														Edit
													</Button>
												</>
											)}
											{topic &&
												user.id !== comment.author_id &&
												topic.user_moderator_id && (
													<DeleteCommentModerator comment={comment} />
												)}
										</>
									) : (
										<Button
											size="xs"
											as={Link}
											to={{
												pathname: "/login",
												state: {
													status: {
														text: "Login to reply to comments",
														severity: "error",
													},
													from: location.pathname,
												},
											}}
											variant="ghost"
										>
											Reply
										</Button>
									)}
								</HStack>
							) : null}
						</>
					)}
				</VStack>
			</Box>
			{openReply && (
				<Flex>
					<Box width="10px" borderLeft="2px" borderLeftColor={color}></Box>
					<div style={{ marginLeft: "2rem", width: "100%" }}>
						<AddReply
							comment={comment}
							openReply={openReply}
							setOpenReply={setOpenReply}
						/>
					</div>
				</Flex>
			)}
			{!hideComments ? (
				<Flex>
					<Box
						width="10px"
						borderLeft="2px"
						borderLeftColor={color}
						cursor="pointer"
						_hover={{ borderLeftColor: colorHover }}
						onClick={() => setHideComments(true)}
					></Box>
					<div style={{ marginLeft: "2rem", width: "100%" }}>
						{comment.children
							? comment.children.map((comment) => (
									<CommentItem
										comment={comment}
										topic={topic}
										key={comment.id}
									/>
							  ))
							: null}
					</div>
				</Flex>
			) : (
				<Button onClick={() => setHideComments(false)} size="xs" variant="link">
					Show Comments({comment.children.length})
				</Button>
			)}
		</>
	);
};

export default CommentItem;
