import { Form, FormControlProps } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "~/components/date-picker";
import CurrencyInput from "~/components/currency-input";
import Select from "~/components/select";

type BaseInvoiceFormFieldProps = {
  name: string;
  label?: string;
} & FormControlProps;

type DateFieldProps = BaseInvoiceFormFieldProps & { type: "date" };
type CurrencyFieldProps = BaseInvoiceFormFieldProps & { type: "currency" };
type SelectFieldProps = BaseInvoiceFormFieldProps & {
  type: "select";
  options: { value: string; label: string }[];
  buttonClassName?: string;
  listboxOptionsStyle?: React.CSSProperties;
};

type InvoiceFormFieldProps =
  | DateFieldProps
  | CurrencyFieldProps
  | SelectFieldProps;

const InvoiceFormField = ({
  name,
  label,
  ...props
}: InvoiceFormFieldProps) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const isField = name.match(/\w+\.\d+\.\w+/);
  let errorMessage = (errors as any)?.[name]?.message;

  if (isField) {
    const [fieldName, index, prop] = name.split(".");
    errorMessage = (errors as any)?.[fieldName]?.[index]?.[prop]
      ?.message as string;
  }

  let field: JSX.Element;

  switch (props.type) {
    case "date":
      field = (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={label ?? ""}
              {...props}
              onChange={onChange}
              selected={value}
            />
          )}
        />
      );
      break;
    case "currency":
      field = (
        <CurrencyInput name={name} control={control} label={label ?? ""} />
      );
      break;
    case "select":
      field = (
        <>
          <Form.Label htmlFor={name}>{label}</Form.Label>
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onChange={onChange}
                options={props.options}
                buttonClassName={props.buttonClassName}
                listboxOptionsStyle={props.listboxOptionsStyle}
              />
            )}
          />
        </>
      );
      break;
  }

  return (
    <Form.Group>
      {field}
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default InvoiceFormField;
