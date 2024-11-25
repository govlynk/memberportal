import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Company } from "./graphql/types";
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
export declare type CompanyUpdateFormInputValues = {
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
export declare type CompanyUpdateFormValidationValues = {
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
export declare type CompanyUpdateFormOverridesProps = {
    CompanyUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
export declare type CompanyUpdateFormProps = React.PropsWithChildren<{
    overrides?: CompanyUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    company?: Company;
    onSubmit?: (fields: CompanyUpdateFormInputValues) => CompanyUpdateFormInputValues;
    onSuccess?: (fields: CompanyUpdateFormInputValues) => void;
    onError?: (fields: CompanyUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CompanyUpdateFormInputValues) => CompanyUpdateFormInputValues;
    onValidate?: CompanyUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CompanyUpdateForm(props: CompanyUpdateFormProps): React.ReactElement;
