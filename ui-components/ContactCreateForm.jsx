/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createContact } from "./graphql/mutations";
const client = generateClient();
export default function ContactCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    firstName: "",
    lastName: "",
    title: "",
    department: "",
    contactEmail: "",
    contactMobilePhone: "",
    contactBusinessPhone: "",
    workAddressStreetLine1: "",
    workAddressStreetLine2: "",
    workAddressCity: "",
    workAddressStateCode: "",
    workAddressZipCode: "",
    workAddressCountryCode: "",
    dateLastContacted: "",
    notes: "",
  };
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [title, setTitle] = React.useState(initialValues.title);
  const [department, setDepartment] = React.useState(initialValues.department);
  const [contactEmail, setContactEmail] = React.useState(
    initialValues.contactEmail
  );
  const [contactMobilePhone, setContactMobilePhone] = React.useState(
    initialValues.contactMobilePhone
  );
  const [contactBusinessPhone, setContactBusinessPhone] = React.useState(
    initialValues.contactBusinessPhone
  );
  const [workAddressStreetLine1, setWorkAddressStreetLine1] = React.useState(
    initialValues.workAddressStreetLine1
  );
  const [workAddressStreetLine2, setWorkAddressStreetLine2] = React.useState(
    initialValues.workAddressStreetLine2
  );
  const [workAddressCity, setWorkAddressCity] = React.useState(
    initialValues.workAddressCity
  );
  const [workAddressStateCode, setWorkAddressStateCode] = React.useState(
    initialValues.workAddressStateCode
  );
  const [workAddressZipCode, setWorkAddressZipCode] = React.useState(
    initialValues.workAddressZipCode
  );
  const [workAddressCountryCode, setWorkAddressCountryCode] = React.useState(
    initialValues.workAddressCountryCode
  );
  const [dateLastContacted, setDateLastContacted] = React.useState(
    initialValues.dateLastContacted
  );
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setTitle(initialValues.title);
    setDepartment(initialValues.department);
    setContactEmail(initialValues.contactEmail);
    setContactMobilePhone(initialValues.contactMobilePhone);
    setContactBusinessPhone(initialValues.contactBusinessPhone);
    setWorkAddressStreetLine1(initialValues.workAddressStreetLine1);
    setWorkAddressStreetLine2(initialValues.workAddressStreetLine2);
    setWorkAddressCity(initialValues.workAddressCity);
    setWorkAddressStateCode(initialValues.workAddressStateCode);
    setWorkAddressZipCode(initialValues.workAddressZipCode);
    setWorkAddressCountryCode(initialValues.workAddressCountryCode);
    setDateLastContacted(initialValues.dateLastContacted);
    setNotes(initialValues.notes);
    setErrors({});
  };
  const validations = {
    firstName: [{ type: "Required" }],
    lastName: [{ type: "Required" }],
    title: [],
    department: [],
    contactEmail: [{ type: "Email" }],
    contactMobilePhone: [],
    contactBusinessPhone: [],
    workAddressStreetLine1: [],
    workAddressStreetLine2: [],
    workAddressCity: [],
    workAddressStateCode: [],
    workAddressZipCode: [],
    workAddressCountryCode: [],
    dateLastContacted: [],
    notes: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          firstName,
          lastName,
          title,
          department,
          contactEmail,
          contactMobilePhone,
          contactBusinessPhone,
          workAddressStreetLine1,
          workAddressStreetLine2,
          workAddressCity,
          workAddressStateCode,
          workAddressZipCode,
          workAddressCountryCode,
          dateLastContacted,
          notes,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
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
            query: createContact.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ContactCreateForm")}
      {...rest}
    >
      <TextField
        label="First name"
        isRequired={true}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName: value,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={true}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName: value,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title: value,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Department"
        isRequired={false}
        isReadOnly={false}
        value={department}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department: value,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.department ?? value;
          }
          if (errors.department?.hasError) {
            runValidationTasks("department", value);
          }
          setDepartment(value);
        }}
        onBlur={() => runValidationTasks("department", department)}
        errorMessage={errors.department?.errorMessage}
        hasError={errors.department?.hasError}
        {...getOverrideProps(overrides, "department")}
      ></TextField>
      <TextField
        label="Contact email"
        isRequired={false}
        isReadOnly={false}
        value={contactEmail}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail: value,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.contactEmail ?? value;
          }
          if (errors.contactEmail?.hasError) {
            runValidationTasks("contactEmail", value);
          }
          setContactEmail(value);
        }}
        onBlur={() => runValidationTasks("contactEmail", contactEmail)}
        errorMessage={errors.contactEmail?.errorMessage}
        hasError={errors.contactEmail?.hasError}
        {...getOverrideProps(overrides, "contactEmail")}
      ></TextField>
      <TextField
        label="Contact mobile phone"
        isRequired={false}
        isReadOnly={false}
        value={contactMobilePhone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone: value,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.contactMobilePhone ?? value;
          }
          if (errors.contactMobilePhone?.hasError) {
            runValidationTasks("contactMobilePhone", value);
          }
          setContactMobilePhone(value);
        }}
        onBlur={() =>
          runValidationTasks("contactMobilePhone", contactMobilePhone)
        }
        errorMessage={errors.contactMobilePhone?.errorMessage}
        hasError={errors.contactMobilePhone?.hasError}
        {...getOverrideProps(overrides, "contactMobilePhone")}
      ></TextField>
      <TextField
        label="Contact business phone"
        isRequired={false}
        isReadOnly={false}
        value={contactBusinessPhone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone: value,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.contactBusinessPhone ?? value;
          }
          if (errors.contactBusinessPhone?.hasError) {
            runValidationTasks("contactBusinessPhone", value);
          }
          setContactBusinessPhone(value);
        }}
        onBlur={() =>
          runValidationTasks("contactBusinessPhone", contactBusinessPhone)
        }
        errorMessage={errors.contactBusinessPhone?.errorMessage}
        hasError={errors.contactBusinessPhone?.hasError}
        {...getOverrideProps(overrides, "contactBusinessPhone")}
      ></TextField>
      <TextField
        label="Work address street line1"
        isRequired={false}
        isReadOnly={false}
        value={workAddressStreetLine1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1: value,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.workAddressStreetLine1 ?? value;
          }
          if (errors.workAddressStreetLine1?.hasError) {
            runValidationTasks("workAddressStreetLine1", value);
          }
          setWorkAddressStreetLine1(value);
        }}
        onBlur={() =>
          runValidationTasks("workAddressStreetLine1", workAddressStreetLine1)
        }
        errorMessage={errors.workAddressStreetLine1?.errorMessage}
        hasError={errors.workAddressStreetLine1?.hasError}
        {...getOverrideProps(overrides, "workAddressStreetLine1")}
      ></TextField>
      <TextField
        label="Work address street line2"
        isRequired={false}
        isReadOnly={false}
        value={workAddressStreetLine2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2: value,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.workAddressStreetLine2 ?? value;
          }
          if (errors.workAddressStreetLine2?.hasError) {
            runValidationTasks("workAddressStreetLine2", value);
          }
          setWorkAddressStreetLine2(value);
        }}
        onBlur={() =>
          runValidationTasks("workAddressStreetLine2", workAddressStreetLine2)
        }
        errorMessage={errors.workAddressStreetLine2?.errorMessage}
        hasError={errors.workAddressStreetLine2?.hasError}
        {...getOverrideProps(overrides, "workAddressStreetLine2")}
      ></TextField>
      <TextField
        label="Work address city"
        isRequired={false}
        isReadOnly={false}
        value={workAddressCity}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity: value,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.workAddressCity ?? value;
          }
          if (errors.workAddressCity?.hasError) {
            runValidationTasks("workAddressCity", value);
          }
          setWorkAddressCity(value);
        }}
        onBlur={() => runValidationTasks("workAddressCity", workAddressCity)}
        errorMessage={errors.workAddressCity?.errorMessage}
        hasError={errors.workAddressCity?.hasError}
        {...getOverrideProps(overrides, "workAddressCity")}
      ></TextField>
      <TextField
        label="Work address state code"
        isRequired={false}
        isReadOnly={false}
        value={workAddressStateCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode: value,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.workAddressStateCode ?? value;
          }
          if (errors.workAddressStateCode?.hasError) {
            runValidationTasks("workAddressStateCode", value);
          }
          setWorkAddressStateCode(value);
        }}
        onBlur={() =>
          runValidationTasks("workAddressStateCode", workAddressStateCode)
        }
        errorMessage={errors.workAddressStateCode?.errorMessage}
        hasError={errors.workAddressStateCode?.hasError}
        {...getOverrideProps(overrides, "workAddressStateCode")}
      ></TextField>
      <TextField
        label="Work address zip code"
        isRequired={false}
        isReadOnly={false}
        value={workAddressZipCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode: value,
              workAddressCountryCode,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.workAddressZipCode ?? value;
          }
          if (errors.workAddressZipCode?.hasError) {
            runValidationTasks("workAddressZipCode", value);
          }
          setWorkAddressZipCode(value);
        }}
        onBlur={() =>
          runValidationTasks("workAddressZipCode", workAddressZipCode)
        }
        errorMessage={errors.workAddressZipCode?.errorMessage}
        hasError={errors.workAddressZipCode?.hasError}
        {...getOverrideProps(overrides, "workAddressZipCode")}
      ></TextField>
      <TextField
        label="Work address country code"
        isRequired={false}
        isReadOnly={false}
        value={workAddressCountryCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode: value,
              dateLastContacted,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.workAddressCountryCode ?? value;
          }
          if (errors.workAddressCountryCode?.hasError) {
            runValidationTasks("workAddressCountryCode", value);
          }
          setWorkAddressCountryCode(value);
        }}
        onBlur={() =>
          runValidationTasks("workAddressCountryCode", workAddressCountryCode)
        }
        errorMessage={errors.workAddressCountryCode?.errorMessage}
        hasError={errors.workAddressCountryCode?.hasError}
        {...getOverrideProps(overrides, "workAddressCountryCode")}
      ></TextField>
      <TextField
        label="Date last contacted"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={dateLastContacted && convertToLocal(new Date(dateLastContacted))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted: value,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.dateLastContacted ?? value;
          }
          if (errors.dateLastContacted?.hasError) {
            runValidationTasks("dateLastContacted", value);
          }
          setDateLastContacted(value);
        }}
        onBlur={() =>
          runValidationTasks("dateLastContacted", dateLastContacted)
        }
        errorMessage={errors.dateLastContacted?.errorMessage}
        hasError={errors.dateLastContacted?.hasError}
        {...getOverrideProps(overrides, "dateLastContacted")}
      ></TextField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              title,
              department,
              contactEmail,
              contactMobilePhone,
              contactBusinessPhone,
              workAddressStreetLine1,
              workAddressStreetLine2,
              workAddressCity,
              workAddressStateCode,
              workAddressZipCode,
              workAddressCountryCode,
              dateLastContacted,
              notes: value,
            };
            const result = onChange(modelFields);
            value = result?.notes ?? value;
          }
          if (errors.notes?.hasError) {
            runValidationTasks("notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("notes", notes)}
        errorMessage={errors.notes?.errorMessage}
        hasError={errors.notes?.hasError}
        {...getOverrideProps(overrides, "notes")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
