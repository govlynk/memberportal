import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ContactCreateFormInputValues = {
    firstName?: string;
    lastName?: string;
    title?: string;
    department?: string;
    contactEmail?: string;
    contactMobilePhone?: string;
    contactBusinessPhone?: string;
    workAddressStreetLine1?: string;
    workAddressStreetLine2?: string;
    workAddressCity?: string;
    workAddressStateCode?: string;
    workAddressZipCode?: string;
    workAddressCountryCode?: string;
    dateLastContacted?: string;
    notes?: string;
};
export declare type ContactCreateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    department?: ValidationFunction<string>;
    contactEmail?: ValidationFunction<string>;
    contactMobilePhone?: ValidationFunction<string>;
    contactBusinessPhone?: ValidationFunction<string>;
    workAddressStreetLine1?: ValidationFunction<string>;
    workAddressStreetLine2?: ValidationFunction<string>;
    workAddressCity?: ValidationFunction<string>;
    workAddressStateCode?: ValidationFunction<string>;
    workAddressZipCode?: ValidationFunction<string>;
    workAddressCountryCode?: ValidationFunction<string>;
    dateLastContacted?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContactCreateFormOverridesProps = {
    ContactCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    department?: PrimitiveOverrideProps<TextFieldProps>;
    contactEmail?: PrimitiveOverrideProps<TextFieldProps>;
    contactMobilePhone?: PrimitiveOverrideProps<TextFieldProps>;
    contactBusinessPhone?: PrimitiveOverrideProps<TextFieldProps>;
    workAddressStreetLine1?: PrimitiveOverrideProps<TextFieldProps>;
    workAddressStreetLine2?: PrimitiveOverrideProps<TextFieldProps>;
    workAddressCity?: PrimitiveOverrideProps<TextFieldProps>;
    workAddressStateCode?: PrimitiveOverrideProps<TextFieldProps>;
    workAddressZipCode?: PrimitiveOverrideProps<TextFieldProps>;
    workAddressCountryCode?: PrimitiveOverrideProps<TextFieldProps>;
    dateLastContacted?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ContactCreateFormProps = React.PropsWithChildren<{
    overrides?: ContactCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ContactCreateFormInputValues) => ContactCreateFormInputValues;
    onSuccess?: (fields: ContactCreateFormInputValues) => void;
    onError?: (fields: ContactCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContactCreateFormInputValues) => ContactCreateFormInputValues;
    onValidate?: ContactCreateFormValidationValues;
} & React.CSSProperties>;
export default function ContactCreateForm(props: ContactCreateFormProps): React.ReactElement;
