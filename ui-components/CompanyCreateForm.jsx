/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, SelectField, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createCompany } from "./graphql/mutations";

const client = generateClient();

export default function CompanyCreateForm(props) {
	const { clearOnSuccess = true, onSuccess, onError, onSubmit, onValidate, onChange, overrides, ...rest } = props;
	const initialValues = {
		legalBusinessName: "",
		dbaName: "",
		uei: "",
		cageCode: "",
		ein: "",
		companyEmail: "",
		companyPhoneNumber: "",
		companyWebsite: "",
		status: "",
	};
	const [legalBusinessName, setLegalBusinessName] = React.useState(initialValues.legalBusinessName);
	const [dbaName, setDbaName] = React.useState(initialValues.dbaName);
	const [uei, setUei] = React.useState(initialValues.uei);
	const [cageCode, setCageCode] = React.useState(initialValues.cageCode);
	const [ein, setEin] = React.useState(initialValues.ein);
	const [companyEmail, setCompanyEmail] = React.useState(initialValues.companyEmail);
	const [companyPhoneNumber, setCompanyPhoneNumber] = React.useState(initialValues.companyPhoneNumber);
	const [companyWebsite, setCompanyWebsite] = React.useState(initialValues.companyWebsite);
	const [status, setStatus] = React.useState(initialValues.status);
	const [errors, setErrors] = React.useState({});

	const resetStateValues = () => {
		setLegalBusinessName(initialValues.legalBusinessName);
		setDbaName(initialValues.dbaName);
		setUei(initialValues.uei);
		setCageCode(initialValues.cageCode);
		setEin(initialValues.ein);
		setCompanyEmail(initialValues.companyEmail);
		setCompanyPhoneNumber(initialValues.companyPhoneNumber);
		setCompanyWebsite(initialValues.companyWebsite);
		setStatus(initialValues.status);
		setErrors({});
	};

	const validations = {
		legalBusinessName: [{ type: "Required" }],
		dbaName: [],
		uei: [{ type: "Required" }],
		cageCode: [],
		ein: [],
		companyEmail: [{ type: "Email" }],
		companyPhoneNumber: [],
		companyWebsite: [{ type: "URL" }],
		status: [],
	};

	const runValidationTasks = async (fieldName, currentValue, getDisplayValue) => {
		const value = currentValue && getDisplayValue ? getDisplayValue(currentValue) : currentValue;
		let validationResponse = validateField(value, validations[fieldName]);
		const customValidator = fetchByPath(onValidate, fieldName);
		if (customValidator) {
			validationResponse = await customValidator(value, validationResponse);
		}
		setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
		return validationResponse;
	};

	return (
		<Grid
			as='form'
			rowGap='15px'
			columnGap='15px'
			padding='20px'
			onSubmit={async (event) => {
				event.preventDefault();
				let modelFields = {
					legalBusinessName,
					dbaName,
					uei,
					cageCode,
					ein,
					companyEmail,
					companyPhoneNumber,
					companyWebsite,
					status,
				};
				const validationResponses = await Promise.all(
					Object.keys(validations).reduce((promises, fieldName) => {
						if (Array.isArray(modelFields[fieldName])) {
							promises.push(...modelFields[fieldName].map((item) => runValidationTasks(fieldName, item)));
							return promises;
						}
						promises.push(runValidationTasks(fieldName, modelFields[fieldName]));
						return promises;
					}, [])
				);
				if (validationResponses.some((r) => r.hasError)) {
					return;
				}
				if (onSubmit) {
					modelFields = onSubmit(modelFields);
				}
				try {
					Object.entries(modelFields).forEach(([key, value]) => {
						if (typeof value === "string" && value === "") {
							modelFields[key] = null;
						}
					});

					await client.graphql({
						query: createCompany.replaceAll("__typename", ""),
						variables: {
							input: {
								...modelFields,
							},
						},
					});
					if (onSuccess) {
						onSuccess(modelFields);
					}
					if (clearOnSuccess) {
						resetStateValues();
					}
				} catch (err) {
					if (onError) {
						const messages = err.errors.map((e) => e.message).join("\n");
						onError(modelFields, messages);
					}
				}
			}}
			{...getOverrideProps(overrides, "CompanyCreateForm")}
			{...rest}
		>
			<TextField
				label='Legal business name'
				isRequired={true}
				isReadOnly={false}
				value={legalBusinessName}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName: value,
							dbaName,
							uei,
							cageCode,
							ein,
							companyEmail,
							companyPhoneNumber,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.legalBusinessName ?? value;
					}
					if (errors.legalBusinessName?.hasError) {
						runValidationTasks("legalBusinessName", value);
					}
					setLegalBusinessName(value);
				}}
				onBlur={() => runValidationTasks("legalBusinessName", legalBusinessName)}
				errorMessage={errors.legalBusinessName?.errorMessage}
				hasError={errors.legalBusinessName?.hasError}
				{...getOverrideProps(overrides, "legalBusinessName")}
			></TextField>
			<TextField
				label='Dba name'
				isRequired={false}
				isReadOnly={false}
				value={dbaName}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName: value,
							uei,
							cageCode,
							ein,
							companyEmail,
							companyPhoneNumber,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.dbaName ?? value;
					}
					if (errors.dbaName?.hasError) {
						runValidationTasks("dbaName", value);
					}
					setDbaName(value);
				}}
				onBlur={() => runValidationTasks("dbaName", dbaName)}
				errorMessage={errors.dbaName?.errorMessage}
				hasError={errors.dbaName?.hasError}
				{...getOverrideProps(overrides, "dbaName")}
			></TextField>
			<TextField
				label='Uei'
				isRequired={true}
				isReadOnly={false}
				value={uei}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei: value,
							cageCode,
							ein,
							companyEmail,
							companyPhoneNumber,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.uei ?? value;
					}
					if (errors.uei?.hasError) {
						runValidationTasks("uei", value);
					}
					setUei(value);
				}}
				onBlur={() => runValidationTasks("uei", uei)}
				errorMessage={errors.uei?.errorMessage}
				hasError={errors.uei?.hasError}
				{...getOverrideProps(overrides, "uei")}
			></TextField>
			<TextField
				label='Cage code'
				isRequired={false}
				isReadOnly={false}
				value={cageCode}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei,
							cageCode: value,
							ein,
							companyEmail,
							companyPhoneNumber,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.cageCode ?? value;
					}
					if (errors.cageCode?.hasError) {
						runValidationTasks("cageCode", value);
					}
					setCageCode(value);
				}}
				onBlur={() => runValidationTasks("cageCode", cageCode)}
				errorMessage={errors.cageCode?.errorMessage}
				hasError={errors.cageCode?.hasError}
				{...getOverrideProps(overrides, "cageCode")}
			></TextField>
			<TextField
				label='Ein'
				isRequired={false}
				isReadOnly={false}
				value={ein}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei,
							cageCode,
							ein: value,
							companyEmail,
							companyPhoneNumber,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.ein ?? value;
					}
					if (errors.ein?.hasError) {
						runValidationTasks("ein", value);
					}
					setEin(value);
				}}
				onBlur={() => runValidationTasks("ein", ein)}
				errorMessage={errors.ein?.errorMessage}
				hasError={errors.ein?.hasError}
				{...getOverrideProps(overrides, "ein")}
			></TextField>
			<TextField
				label='Company email'
				isRequired={false}
				isReadOnly={false}
				value={companyEmail}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei,
							cageCode,
							ein,
							companyEmail: value,
							companyPhoneNumber,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.companyEmail ?? value;
					}
					if (errors.companyEmail?.hasError) {
						runValidationTasks("companyEmail", value);
					}
					setCompanyEmail(value);
				}}
				onBlur={() => runValidationTasks("companyEmail", companyEmail)}
				errorMessage={errors.companyEmail?.errorMessage}
				hasError={errors.companyEmail?.hasError}
				{...getOverrideProps(overrides, "companyEmail")}
			></TextField>
			<TextField
				label='Company phone number'
				isRequired={false}
				isReadOnly={false}
				value={companyPhoneNumber}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei,
							cageCode,
							ein,
							companyEmail,
							companyPhoneNumber: value,
							companyWebsite,
							status,
						};
						const result = onChange(modelFields);
						value = result?.companyPhoneNumber ?? value;
					}
					if (errors.companyPhoneNumber?.hasError) {
						runValidationTasks("companyPhoneNumber", value);
					}
					setCompanyPhoneNumber(value);
				}}
				onBlur={() => runValidationTasks("companyPhoneNumber", companyPhoneNumber)}
				errorMessage={errors.companyPhoneNumber?.errorMessage}
				hasError={errors.companyPhoneNumber?.hasError}
				{...getOverrideProps(overrides, "companyPhoneNumber")}
			></TextField>
			<TextField
				label='Company website'
				isRequired={false}
				isReadOnly={false}
				value={companyWebsite}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei,
							cageCode,
							ein,
							companyEmail,
							companyPhoneNumber,
							companyWebsite: value,
							status,
						};
						const result = onChange(modelFields);
						value = result?.companyWebsite ?? value;
					}
					if (errors.companyWebsite?.hasError) {
						runValidationTasks("companyWebsite", value);
					}
					setCompanyWebsite(value);
				}}
				onBlur={() => runValidationTasks("companyWebsite", companyWebsite)}
				errorMessage={errors.companyWebsite?.errorMessage}
				hasError={errors.companyWebsite?.hasError}
				{...getOverrideProps(overrides, "companyWebsite")}
			></TextField>
			<SelectField
				label='Status'
				placeholder='Please select an option'
				isDisabled={false}
				value={status}
				onChange={(e) => {
					let { value } = e.target;
					if (onChange) {
						const modelFields = {
							legalBusinessName,
							dbaName,
							uei,
							cageCode,
							ein,
							companyEmail,
							companyPhoneNumber,
							companyWebsite,
							status: value,
						};
						const result = onChange(modelFields);
						value = result?.status ?? value;
					}
					if (errors.status?.hasError) {
						runValidationTasks("status", value);
					}
					setStatus(value);
				}}
				onBlur={() => runValidationTasks("status", status)}
				errorMessage={errors.status?.errorMessage}
				hasError={errors.status?.hasError}
				{...getOverrideProps(overrides, "status")}
			>
				<option children='Active' value='ACTIVE' {...getOverrideProps(overrides, "statusoption0")}></option>
				<option children='Inactive' value='INACTIVE' {...getOverrideProps(overrides, "statusoption1")}></option>
				<option children='Pending' value='PENDING' {...getOverrideProps(overrides, "statusoption2")}></option>
			</SelectField>
			<Flex justifyContent='space-between' {...getOverrideProps(overrides, "CTAFlex")}>
				<Button
					children='Clear'
					type='reset'
					onClick={(event) => {
						event.preventDefault();
						resetStateValues();
					}}
					{...getOverrideProps(overrides, "ClearButton")}
				></Button>
				<Flex gap='15px' {...getOverrideProps(overrides, "RightAlignCTASubFlex")}>
					<Button
						children='Submit'
						type='submit'
						variation='primary'
						isDisabled={Object.values(errors).some((e) => e?.hasError)}
						{...getOverrideProps(overrides, "SubmitButton")}
					></Button>
				</Flex>
			</Flex>
		</Grid>
	);
}
