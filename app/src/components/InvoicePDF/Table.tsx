import { View, Text } from '@react-pdf/renderer';
import type { PropsWithChildren } from 'react';
import { colors, fontSizes, sizes } from './styles';

export const Table = ({ children }: PropsWithChildren) => (
  <View style={{ width: '100%', flexDirection: 'column' }}>{children}</View>
);

export const TableHeader = ({ children }: PropsWithChildren) => (
  <View
    style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      color: colors.white,
      fontWeight: 'bold',
      padding: sizes[1],
    }}
  >
    {children}
  </View>
);

export const TableRow = ({ children }: PropsWithChildren) => (
  <View
    style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: sizes[1],
      paddingVertical: sizes['0.5'],
      fontSize: fontSizes.sm,
      borderBottom: `1px solid ${colors.secondary}`,
    }}
  >
    {children}
  </View>
);

type TableCellProps = PropsWithChildren<{
  weight?: number;
  textAlign?: 'center' | 'left' | 'right' | 'justify';
}>;

export const TableCell = ({
  weight = 1,
  textAlign = 'left',
  children,
}: TableCellProps) => (
  <View
    style={{
      flex: weight,
      textAlign,
    }}
  >
    <Text>{children}</Text>
  </View>
);
