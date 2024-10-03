import { add, parseISO, formatDate } from "date-fns";
import { useEffect } from "react";
import {
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

function useSyncPaymentDue(
  watch: UseFormWatch<InferType<typeof invoiceSchema>>,
  setValue: UseFormSetValue<InferType<typeof invoiceSchema>>,
  getValues: UseFormGetValues<InferType<typeof invoiceSchema>>
) {
  const invoiceDate = watch("invoice_date");

  useEffect(() => {
    if (invoiceDate) {
      const payment_due = add(parseISO(invoiceDate), {
        days: parseInt(getValues("payment_terms")),
      });
      const formattedPaymentDue = formatDate(payment_due, "yyyy-MM-dd");

      setValue("payment_due", formattedPaymentDue);
    }
  }, [invoiceDate, watch, getValues, setValue]);
}

export default useSyncPaymentDue;
