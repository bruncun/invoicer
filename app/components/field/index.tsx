import { Form, FormControlProps } from "react-bootstrap";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import DatePicker from "../date-picker";
import CurrencyInput from "../currency-input";
import Select from "../select";

type BaseFieldProps = {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
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

type OtherFieldProps = BaseFieldProps & {
  type?: "text" | "password" | "email" | "number";
};

type FieldProps =
  | DateFieldProps
  | CurrencyFieldProps
  | SelectFieldProps
  | OtherFieldProps;

const Field = ({
  name,
  label,
  register,
  control,
  errors,
  ...props
}: FieldProps) => {
  const isField = name.match(/\w+\.\d+\.\w+/);
  let errorMessage = (errors as any)?.[name]?.message;
  if (isField) {
    const nameSplit = name.split(".");
    const [fieldName, index, prop] = nameSplit;
    errorMessage = (errors as any)?.[fieldName]?.[index]?.[prop]
      ?.message as string;
  }

  if (props.type === "date") {
    return (
      <Form.Group>
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
        <Form.Control.Feedback type="invalid">
          {(errors as any)?.payment_due?.message as string}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  if (props.type === "currency") {
    return (
      <Form.Group>
        <CurrencyInput name={name} control={control} label="Price" />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  if (props.type === "select") {
    const { options, buttonClassName, listboxOptionsStyle } = props;

    return (
      <Form.Group>
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              value={value}
              onChange={onChange}
              options={options}
              buttonClassName={buttonClassName}
              listboxOptionsStyle={listboxOptionsStyle}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <Form.Group>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control
        isInvalid={!!errorMessage}
        id={name}
        {...register(name)}
        {...props}
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Field;