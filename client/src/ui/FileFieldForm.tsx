import React from "react";
import { getIn } from "formik";

type Props = {
	field: any,
	form: any,
	setFieldValue: any,
	label: string,
};

export const FileFieldForm = ({ field, form, setFieldValue, label, ...props }: Props) => {
	const error = getIn(form.errors, field.name);
	return (
		<>
			<div className="font-medium">{label}</div>
			<input
				{...props}
				type="file"
				onChange={(e) => setFieldValue("file", e.currentTarget.files ? e.currentTarget.files[0] : null)}
				className="mt-2"
			/>
			<small className="text-red-500">{error}</small>
		</>
	);
};
