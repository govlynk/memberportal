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
export declare type RoleCreateFormInputValues = {
    name?: string;
    description?: string;
    permissions?: string[];
};
export declare type RoleCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    permissions?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RoleCreateFormOverridesProps = {
    RoleCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    permissions?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RoleCreateFormProps = React.PropsWithChildren<{
    overrides?: RoleCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RoleCreateFormInputValues) => RoleCreateFormInputValues;
    onSuccess?: (fields: RoleCreateFormInputValues) => void;
    onError?: (fields: RoleCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RoleCreateFormInputValues) => RoleCreateFormInputValues;
    onValidate?: RoleCreateFormValidationValues;
} & React.CSSProperties>;
export default function RoleCreateForm(props: RoleCreateFormProps): React.ReactElement;
