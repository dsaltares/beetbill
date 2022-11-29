import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback, useMemo, useState } from 'react';
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';
import startOfDay from 'date-fns/startOfDay';
import AutocompleteField from '@components/Fields/AutocompleteField';
import type { Product } from '@server/products/types';
import { datePickerFormat } from '@lib/formatDate';
import LineItemOverlay from './LineItemOverlay';
import SortableLineItem from './SortableLineItem';
import Table, { Body, BodyCell, Head, HeaderCell } from './Table';
import type { InvoiceFormValues, LineItemFormValue } from './InvoiceFormValues';

type LineItemsTableProps = {
  itemFields: FieldArrayWithId<InvoiceFormValues, 'items', 'id'>[];
  watchItems: LineItemFormValue[];
  isSent: boolean;
  control: Control<InvoiceFormValues>;
  register?: UseFormRegister<InvoiceFormValues>;
  moveItem: UseFieldArrayMove;
  removeItem: UseFieldArrayRemove;
  appendItem: UseFieldArrayAppend<InvoiceFormValues, 'items'>;
  products: Product[];
};

const LineItemsTable = ({
  itemFields,
  watchItems,
  isSent,
  control,
  register,
  moveItem,
  removeItem,
  appendItem,
  products,
}: LineItemsTableProps) => {
  const today = useMemo(() => datePickerFormat(startOfDay(new Date())), []);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [dragActiveId, setDragActiveId] = useState<UniqueIdentifier>();
  const draggedItem = useMemo(() => {
    if (!dragActiveId) {
      return;
    }
    const index = itemFields.findIndex((item) => item.id === dragActiveId);
    return {
      item: itemFields[index],
      watchItem: watchItems[index],
      index,
    };
  }, [itemFields, watchItems, dragActiveId]);
  const handleDragStart = useCallback(
    (event: DragStartEvent) => setDragActiveId(event.active.id),
    [setDragActiveId]
  );
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over?.id) {
        const oldIndex = itemFields.findIndex((item) => item.id === active.id);
        const newIndex = itemFields.findIndex((item) => item.id === over.id);
        return moveItem(oldIndex, newIndex);
      }
    },
    [moveItem, itemFields]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemFields}
        strategy={verticalListSortingStrategy}
      >
        <Table>
          <Head>
            <tr>
              <HeaderCell></HeaderCell>
              <HeaderCell>Product</HeaderCell>
              <HeaderCell>Date</HeaderCell>
              <HeaderCell>Quantity</HeaderCell>
              <HeaderCell>Price</HeaderCell>
              <HeaderCell>VAT</HeaderCell>
              <HeaderCell>Total</HeaderCell>
              <HeaderCell></HeaderCell>
            </tr>
          </Head>
          <Body>
            {itemFields.map((item, index) => (
              <SortableLineItem
                key={item.id}
                item={item}
                index={index}
                watchItem={watchItems[index]}
                control={control}
                register={register}
                disabled={isSent}
                onRemove={() => removeItem(index)}
                products={products}
              />
            ))}
            {!isSent && (
              <tr>
                <BodyCell />
                <BodyCell>
                  <div className="min-w-[200px]">
                    <AutocompleteField
                      id="lineitem-add-product"
                      placeholder="Product..."
                      options={products}
                      optionToKey={(product) => product.id}
                      optionToLabel={(product) => product.name}
                      onChange={(product) => {
                        if (product) {
                          appendItem({ product, date: today, quantity: '1' });
                        }
                      }}
                    />
                  </div>
                </BodyCell>
                <BodyCell />
                <BodyCell />
                <BodyCell />
                <BodyCell />
                <BodyCell />
                <BodyCell />
              </tr>
            )}
          </Body>
        </Table>
      </SortableContext>
      <DragOverlay>
        {draggedItem ? (
          <LineItemOverlay
            control={control}
            index={draggedItem.index}
            watchItem={draggedItem.watchItem}
            item={draggedItem.item}
            products={products}
            disabled
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default LineItemsTable;
