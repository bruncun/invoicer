import { Form, FormGroup } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";

type CurrencyInputProps = {
  name: string;
  control: any;
  label: string;
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  control,
  label,
}) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <>
          <FormGroup>
            <IMaskInput
              name={name}
              mask="$num"
              blocks={{
                num: {
                  mask: Number,
                  thousandsSeparator: ",",
                  radix: ".",
                },
              }}
              thousandsSeparator={","}
              radix={"."}
              mapToRadix={["."]}
              value={value.toString()}
              autofix={true}
              unmask={true}
              onAccept={(value: string) =>
                onChange(value ? parseFloat(value) : "")
              }
              onBlur={(e) => {
                const value = e.target.value;
                if (value === "$" || !value) onChange(0);
              }}
              inputRef={ref}
              className={`form-control ${error ? "is-invalid" : ""}`}
            />
          </FormGroup>
          <Form.Control.Feedback type="invalid">
            {error?.message}
          </Form.Control.Feedback>
        </>
      )}
    />
  </Form.Group>
);

export default CurrencyInput;
