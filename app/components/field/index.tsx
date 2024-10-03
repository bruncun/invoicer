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
          {(errors as any)?.[name]?.message as string}
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

  if (props.type === "checkbox") {
    return (
      <Form.Group>
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
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  if (props.type === "hidden") {
    return <Form.Control type="hidden" {...register(name)} {...props} />;
  }

  return (
    <Form.Group>
      {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
      <Form.Control {...register(name)} {...props} />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Field;
