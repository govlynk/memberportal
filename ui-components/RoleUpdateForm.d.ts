import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Role } from "./graphql/types";
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
export declare type RoleUpdateFormInputValues = {
    name?: string;
    description?: string;
    permissions?: string[];
};
export declare type RoleUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    permissions?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RoleUpdateFormOverridesProps = {
    RoleUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    permissions?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RoleUpdateFormProps = React.PropsWithChildren<{
    overrides?: RoleUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    role?: Role;
    onSubmit?: (fields: RoleUpdateFormInputValues) => RoleUpdateFormInputValues;
    onSuccess?: (fields: RoleUpdateFormInputValues) => void;
    onError?: (fields: RoleUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RoleUpdateFormInputValues) => RoleUpdateFormInputValues;
    onValidate?: RoleUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RoleUpdateForm(props: RoleUpdateFormProps): React.ReactElement;
