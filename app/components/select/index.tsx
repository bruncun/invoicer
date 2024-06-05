import { useFormContext } from "react-hook-form";
import { Form, FormControlProps, FormSelectProps } from "react-bootstrap";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  label: string;
  error?: string;
  options: Option[];
} & FormControlProps &
  FormSelectProps;

export function Select({ name, label, error, options, ...rest }: SelectProps) {
  const { register } = useFormContext();

  return (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Select {...register(name as any)} {...rest} isInvalid={!!error}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default Select;
