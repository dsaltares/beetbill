import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { faGripVertical, faXmark } from '@fortawesome/free-solid-svg-icons';
import { forwardRef } from 'react';
import type {
  Control,
  FieldArrayWithId,
  UseFormRegister,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import AutocompleteField from '@components/Fields/AutocompleteField';
import TextField from '@components/Fields/TextField';
import IconButton from '@components/IconButton';
import type { Product } from '@server/products/types';
import type { InvoiceFormValues, LineItemFormValue } from './InvoiceFormValues';
import { BodyCell } from './Table';

export type LineItemProps = {
  item: FieldArrayWithId<InvoiceFormValues, 'items', 'id'>;
  watchItem: LineItemFormValue;
  index: number;
  control: Control<InvoiceFormValues>;
  products: Product[];
  disabled: boolean;
  register?: UseFormRegister<InvoiceFormValues>;
  onRemove?: () => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  style?: {
    transform?: string;
    transition?: string;
  };
};

const LineItem = forwardRef<HTMLTableRowElement, LineItemProps>(
  (
    {
      item,
      watchItem,
      index,
      control,
      products,
      disabled,
      register,
      onRemove,
      attributes,
      listeners,
      style,
    },
    ref
  ) => (
    <tr ref={ref} className="bg-zinc-50" {...style}>
      <BodyCell>
        <div className="pl-0.5">
          <IconButton
            aria-label="Drag"
            icon={faGripVertical}
            color="secondary"
            variant="borderless"
            size="sm"
            disabled={disabled}
            draggable
            {...attributes}
            {...listeners}
          />
        </div>
      </BodyCell>
      <BodyCell>
        <div className="min-w-[200px]">
          <Controller
            control={control}
            name={`items.${index}.product`}
            render={({ field: { value, onChange } }) => (
              <AutocompleteField
                id={`${item.id}-product`}
                value={value}
                placeholder="Product..."
                options={products}
                optionToKey={(product) => product.id}
                optionToLabel={(product) => product.name}
                onChange={onChange}
                disabled={disabled}
              />
            )}
          />
        </div>
      </BodyCell>
      <BodyCell>
        <TextField
          id={`${item.id}-date`}
          placeholder="Date..."
          type="date"
          {...(register
            ? register(`items.${index}.date`, { required: true })
            : {})}
          required
          defaultValue={watchItem.date}
          disabled={disabled}
        />
      </BodyCell>
      <BodyCell>
        <div className="w-[115px]">
          <TextField
            id={`${item.id}-quantity`}
            placeholder="Quantity..."
            type="number"
            step="0.01"
            {...(register
              ? register(`items.${index}.quantity`, {
                  required: true,
                })
              : {})}
            required
            defaultValue={watchItem.quantity}
            endAdornment={watchItem.product.unit}
            disabled={disabled}
          />
        </div>
      </BodyCell>
      <BodyCell>{`${item.product.price} ${item.product.currency}`}</BodyCell>
      <BodyCell>{`${item.product.vat}%`}</BodyCell>
      <BodyCell>
        {`${lineItemTotal(watchItem.product, parseFloat(watchItem.quantity))} ${
          watchItem.product.currency
        }`}
      </BodyCell>
      <BodyCell>
        <IconButton
          aria-label="Remove"
          icon={faXmark}
          color="secondary"
          variant="borderless"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
        />
      </BodyCell>
    </tr>
  )
);
LineItem.displayName = 'LineItem';

const lineItemTotal = (product: Product, quantity: number) =>
  product.includesVat
    ? product.price * quantity
    : product.price * quantity * (1 + product.vat / 100);

export default LineItem;
