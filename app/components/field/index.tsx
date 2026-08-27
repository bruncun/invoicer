import { Form, FormControlProps } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type BaseFieldProps = {
  name: string;
  label?: string;
} & FormControlProps;

type CheckboxFieldProps = BaseFieldProps & { type: "checkbox" };

type OtherFieldProps = BaseFieldProps & {
  type?: "text" | "password" | "email" | "number" | "hidden";
};

type FieldProps = CheckboxFieldProps | OtherFieldProps;

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

  return (
    <Form.Group>
      {props.type === "checkbox" ? (
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
      ) : (
        <>
          {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
          <Form.Control
            {...register(name)}
            isInvalid={!!errorMessage}
            {...props}
          />
        </>
      )}
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Field;
