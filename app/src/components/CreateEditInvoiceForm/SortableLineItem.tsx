import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LineItem, { type LineItemProps } from './LinteItem';

const SortableLineItem = ({ item, disabled, ...props }: LineItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <LineItem
      ref={setNodeRef}
      item={item}
      {...props}
      attributes={attributes}
      listeners={listeners}
      style={style}
      disabled={disabled || isDragging}
    />
  );
};

export default SortableLineItem;
