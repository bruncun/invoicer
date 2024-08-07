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
        <span className="text-truncate d-block">
          {item?.name ?? <Skeleton bg="secondary" />}
        </span>
      </td>
      <td className="text-center">
        <span className="text-truncate d-block">
          {item?.quantity ?? <Skeleton bg="secondary" className="w-4" />}
        </span>
      </td>
      <td className="align-top text-end">
        <span className="text-truncate d-block">
          {formattedPrice ?? <Skeleton bg="secondary" className="w-6" />}
        </span>
      </td>
      <td className="align-top text-body-emphasis fw-medium text-end">
        <span className="text-truncate d-block">
          {formattedTotal ?? <Skeleton bg="secondary" className="w-7" />}
        </span>
      </td>
    </tr>
  );
};

export default ItemsRow;
