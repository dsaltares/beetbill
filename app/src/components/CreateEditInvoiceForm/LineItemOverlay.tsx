import LineItem, { type LineItemProps } from './LinteItem';

const LineItemOverlay = (props: LineItemProps) => (
  <table className="w-full whitespace-nowrap text-left text-base text-zinc-900 border-separate border-spacing-y-0">
    <thead className="text-sm font-medium">
      <tr>
        <th />
        <th />
        <th />
        <th />
        <th />
        <th />
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      <LineItem {...props} />
    </tbody>
  </table>
);

export default LineItemOverlay;
