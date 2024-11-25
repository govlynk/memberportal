import * as React from "react";
import { GridProps, SelectFieldProps } from "@aws-amplify/ui-react";
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
export declare type UserCompanyRoleCreateFormInputValues = {
    status?: string;
};
export declare type UserCompanyRoleCreateFormValidationValues = {
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserCompanyRoleCreateFormOverridesProps = {
    UserCompanyRoleCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type UserCompanyRoleCreateFormProps = React.PropsWithChildren<{
    overrides?: UserCompanyRoleCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserCompanyRoleCreateFormInputValues) => UserCompanyRoleCreateFormInputValues;
    onSuccess?: (fields: UserCompanyRoleCreateFormInputValues) => void;
    onError?: (fields: UserCompanyRoleCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserCompanyRoleCreateFormInputValues) => UserCompanyRoleCreateFormInputValues;
    onValidate?: UserCompanyRoleCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserCompanyRoleCreateForm(props: UserCompanyRoleCreateFormProps): React.ReactElement;
