import React from "react";
import PostCard from "../Post/PostCard";
import CommentCard from "../Comment/CommentCard";
import SkeletonCard from "../Utils/SkeletonCard";
import AlertStatus from "../Utils/AlertStatus";
import usePost from "../../hooks/post-query/usePost";
import useTopic from "../../hooks/topic-query/useTopic";

const Post = ({ match }) => {
	const { isLoading, isError, data, error } = usePost(match.params.id);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

	if (isLoading || topicLoading) return <SkeletonCard />;
	if (isError || topicIsError)
		return <AlertStatus status={error || topicError} />;

	return (
		<>
			<PostCard post={data} topic={topicData.topic} />
			<CommentCard post={data} topic={topicData.topic} />
		</>
	);
};

export default Post;
