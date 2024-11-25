import * as React from "react";
import { GridProps, SelectFieldProps } from "@aws-amplify/ui-react";
import { UserCompanyRole } from "./graphql/types";
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
export declare type UserCompanyRoleUpdateFormInputValues = {
    status?: string;
};
export declare type UserCompanyRoleUpdateFormValidationValues = {
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserCompanyRoleUpdateFormOverridesProps = {
    UserCompanyRoleUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type UserCompanyRoleUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserCompanyRoleUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userCompanyRole?: UserCompanyRole;
    onSubmit?: (fields: UserCompanyRoleUpdateFormInputValues) => UserCompanyRoleUpdateFormInputValues;
    onSuccess?: (fields: UserCompanyRoleUpdateFormInputValues) => void;
    onError?: (fields: UserCompanyRoleUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserCompanyRoleUpdateFormInputValues) => UserCompanyRoleUpdateFormInputValues;
    onValidate?: UserCompanyRoleUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserCompanyRoleUpdateForm(props: UserCompanyRoleUpdateFormProps): React.ReactElement;
