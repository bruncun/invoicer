import { Form, FormControlProps } from "react-bootstrap";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  error: string | undefined;
} & FormControlProps;

const Input = <T extends FieldValues>({
  name,
  label,
  error,
  register,
  ...rest
}: InputProps<T>) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control {...register(name)} {...rest} isInvalid={!!error} />
    {error && (
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    )}
  </Form.Group>
);

export default Input;
