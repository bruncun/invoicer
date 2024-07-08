import { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

const useItemsFieldArray = (
  control: Control<InferType<typeof invoiceSchema>>
) => {
  const itemsFieldArray = useFieldArray<InferType<typeof invoiceSchema>>({
    control,
    name: "items",
  });

  return itemsFieldArray;
};

export default useItemsFieldArray;
