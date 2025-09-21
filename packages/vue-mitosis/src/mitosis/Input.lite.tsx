import { cn } from '../lib/utils'

export interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  class?: string
  onChange?: (event: any) => void
}

export default function Input(props: InputProps) {
  return (
    <input
      type={props.type || 'text'}
      class={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        props.class
      )}
      placeholder={props.placeholder}
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  )
}