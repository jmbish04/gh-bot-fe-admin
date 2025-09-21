import { cn } from '../lib/utils'

export interface TableProps {
  class?: string
  children?: any
}

export default function Table(props: TableProps) {
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn('w-full caption-bottom text-sm', props.class)}>
        {props.children}
      </table>
    </div>
  )
}

export interface TableHeaderProps {
  class?: string
  children?: any
}

export function TableHeader(props: TableHeaderProps) {
  return (
    <thead class={cn('[&_tr]:border-b', props.class)}>
      {props.children}
    </thead>
  )
}

export interface TableBodyProps {
  class?: string
  children?: any
}

export function TableBody(props: TableBodyProps) {
  return (
    <tbody class={cn('[&_tr:last-child]:border-0', props.class)}>
      {props.children}
    </tbody>
  )
}

export interface TableRowProps {
  class?: string
  children?: any
}

export function TableRow(props: TableRowProps) {
  return (
    <tr class={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      props.class
    )}>
      {props.children}
    </tr>
  )
}

export interface TableHeadProps {
  class?: string
  children?: any
}

export function TableHead(props: TableHeadProps) {
  return (
    <th class={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      props.class
    )}>
      {props.children}
    </th>
  )
}

export interface TableCellProps {
  class?: string
  children?: any
}

export function TableCell(props: TableCellProps) {
  return (
    <td class={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      props.class
    )}>
      {props.children}
    </td>
  )
}