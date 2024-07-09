import { FieldValues, useFormContext, UseFormReturn } from "react-hook-form";

type ConnectFormProps = {
  children: (methods: UseFormReturn<FieldValues>) => React.ReactNode;
};

const ConnectForm = ({ children }: ConnectFormProps) => {
  const methods = useFormContext();
  return <>{children({ ...methods })}</>;
};

export default ConnectForm;
