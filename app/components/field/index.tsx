import { Form, FormControlProps } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "../date-picker";
import CurrencyInput from "../currency-input";
import Select from "../select";

type BaseFieldProps = {
  name: string;
  label?: string;
} & FormControlProps;

type DateFieldProps = BaseFieldProps & {
  type: "date";
};

type CurrencyFieldProps = BaseFieldProps & {
  type: "currency";
};

type SelectFieldProps = BaseFieldProps & {
  type: "select";
  options: { value: string; label: string }[];
  buttonClassName?: string;
  listboxOptionsStyle?: React.CSSProperties;
};

type CheckboxFieldProps = BaseFieldProps & {
  type: "checkbox";
};

type OtherFieldProps = BaseFieldProps & {
  type?: "text" | "password" | "email" | "number" | "hidden";
};

type FieldProps =
  | DateFieldProps
  | CurrencyFieldProps
  | SelectFieldProps
  | CheckboxFieldProps
  | OtherFieldProps;

const Field = ({ name, label, ...props }: FieldProps) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const isField = name.match(/\w+\.\d+\.\w+/);
  let errorMessage = (errors as any)?.[name]?.message;

  if (isField) {
    const nameSplit = name.split(".");
    const [fieldName, index, prop] = nameSplit;
    errorMessage = (errors as any)?.[fieldName]?.[index]?.[prop]
      ?.message as string;
  }

  const fieldComponents: { [key: string]: JSX.Element } = {
    date: (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            label={label}
            {...props}
            onChange={onChange}
            selected={value}
          />
        )}
      />
    ),
    currency: (
      <>
        <CurrencyInput name={name} control={control} label="Price" />
      </>
    ),
    select: (
      <>
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              value={value}
              onChange={onChange}
              options={(props as SelectFieldProps).options}
              buttonClassName={(props as SelectFieldProps).buttonClassName}
              listboxOptionsStyle={
                (props as SelectFieldProps).listboxOptionsStyle
              }
            />
          )}
        />
      </>
    ),
    checkbox: (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Form.Check
            type="checkbox"
            label={label}
            checked={value}
            onChange={onChange}
          />
        )}
      />
    ),
    default: (
      <>
        {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
        <Form.Control
          {...register(name)}
          isInvalid={!!errorMessage}
          {...props}
        />
      </>
    ),
  };

  return (
    <Form.Group>
      {fieldComponents[props.type as keyof typeof fieldComponents] ||
        fieldComponents.default}
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Field;
