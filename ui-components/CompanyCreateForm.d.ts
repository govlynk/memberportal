import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type CompanyCreateFormInputValues = {
    legalBusinessName?: string;
    dbaName?: string;
    uei?: string;
    cageCode?: string;
    ein?: string;
    companyEmail?: string;
    companyPhoneNumber?: string;
    companyWebsite?: string;
    status?: string;
};
export declare type CompanyCreateFormValidationValues = {
    legalBusinessName?: ValidationFunction<string>;
    dbaName?: ValidationFunction<string>;
    uei?: ValidationFunction<string>;
    cageCode?: ValidationFunction<string>;
    ein?: ValidationFunction<string>;
    companyEmail?: ValidationFunction<string>;
    companyPhoneNumber?: ValidationFunction<string>;
    companyWebsite?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CompanyCreateFormOverridesProps = {
    CompanyCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    legalBusinessName?: PrimitiveOverrideProps<TextFieldProps>;
    dbaName?: PrimitiveOverrideProps<TextFieldProps>;
    uei?: PrimitiveOverrideProps<TextFieldProps>;
    cageCode?: PrimitiveOverrideProps<TextFieldProps>;
    ein?: PrimitiveOverrideProps<TextFieldProps>;
    companyEmail?: PrimitiveOverrideProps<TextFieldProps>;
    companyPhoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    companyWebsite?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type CompanyCreateFormProps = React.PropsWithChildren<{
    overrides?: CompanyCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CompanyCreateFormInputValues) => CompanyCreateFormInputValues;
    onSuccess?: (fields: CompanyCreateFormInputValues) => void;
    onError?: (fields: CompanyCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CompanyCreateFormInputValues) => CompanyCreateFormInputValues;
    onValidate?: CompanyCreateFormValidationValues;
} & React.CSSProperties>;
export default function CompanyCreateForm(props: CompanyCreateFormProps): React.ReactElement;
