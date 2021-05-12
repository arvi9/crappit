import React, { useState, useContext } from "react";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import FileFieldForm from "./Forms/FileFieldForm";
import { GlobalContext } from "../context/GlobalState";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 320 * 1024;
const schema = yup.object({
	title: yup.string().required(),
	content: yup.string().required(),
	file: yup
		.mixed()
		.test("fileSize", "File Size is too large", (value) =>
			value === undefined ? true : value.size <= FILE_SIZE
		)
		.test("fileType", "Unsupported File Format", (value) =>
			value === undefined ? true : SUPPORTED_FORMATS.includes(value.type)
		),
});

const AddPost = () => {
	const [open, setOpen] = useState(false);

	const { topic, addPost, user } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { title, content, file } = values;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("content", content);
		addPost(topic.title, formData);
		setOpen(false);
	};

	return user ? (
		<>
			<Button className="mt-4" onClick={() => setOpen(true)}>
				Add Post
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="form-dialog-title">Add a post!</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Formik
							initialValues={{ title: "", content: "", file: "" }}
							onSubmit={handleSubmit}
							validationSchema={schema}
						>
							{({ setFieldValue }) => (
								<Form>
									<Field label="Title" name="title" component={TextFieldForm} />
									<Field
										label="Content"
										name="content"
										multiline
										component={TextFieldForm}
									/>
									<Field
										label="File"
										name="file"
										component={FileFieldForm}
										setFieldValue={setFieldValue}
									/>
									<Button type="submit">Post</Button>
								</Form>
							)}
						</Formik>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	) : null;
};

export default AddPost;
