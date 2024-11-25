import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Todo } from "./graphql/types";
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
export declare type TodoUpdateFormInputValues = {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    estimatedEffort?: number;
    actualEffort?: number;
    tags?: string[];
    position?: number;
};
export declare type TodoUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    priority?: ValidationFunction<string>;
    dueDate?: ValidationFunction<string>;
    estimatedEffort?: ValidationFunction<number>;
    actualEffort?: ValidationFunction<number>;
    tags?: ValidationFunction<string>;
    position?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TodoUpdateFormOverridesProps = {
    TodoUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
    priority?: PrimitiveOverrideProps<SelectFieldProps>;
    dueDate?: PrimitiveOverrideProps<TextFieldProps>;
    estimatedEffort?: PrimitiveOverrideProps<TextFieldProps>;
    actualEffort?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    position?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TodoUpdateFormProps = React.PropsWithChildren<{
    overrides?: TodoUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    todo?: Todo;
    onSubmit?: (fields: TodoUpdateFormInputValues) => TodoUpdateFormInputValues;
    onSuccess?: (fields: TodoUpdateFormInputValues) => void;
    onError?: (fields: TodoUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TodoUpdateFormInputValues) => TodoUpdateFormInputValues;
    onValidate?: TodoUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TodoUpdateForm(props: TodoUpdateFormProps): React.ReactElement;
