import { formatCurrency } from "~/utility/formatters";
import Skeleton from "~/components/skeleton";
import { InferType } from "yup";
import { itemSchema } from "~/constants";

interface ItemsRowProps {
  item?: InferType<typeof itemSchema>;
}

export const ItemsRow = ({ item }: ItemsRowProps) => {
  let formattedTotal, formattedPrice;

  if (item) {
    formattedPrice = formatCurrency(item.price);
    formattedTotal = formatCurrency(item.quantity * item.price);
  }

  return (
    <tr>
      <td className="align-top text-body-emphasis fw-medium">
        {<span className="text-truncate d-block">{item?.name}</span> ?? (
          <Skeleton bg="secondary" />
        )}
      </td>
      <td className="text-center">
        {<span className="text-truncate d-block">{item?.quantity}</span> ?? (
          <Skeleton bg="secondary" className="w-3" />
        )}
      </td>
      <td className="align-top text-end">
        {<span className="text-truncate d-block">{formattedPrice}</span> ?? (
          <Skeleton bg="secondary" className="w-6" />
        )}
      </td>
      <td className="align-top text-body-emphasis fw-medium text-end">
        {<span className="text-truncate d-block">{formattedTotal}</span> ?? (
          <Skeleton bg="secondary" className="w-7" />
        )}
      </td>
    </tr>
  );
};

export default ItemsRow;
