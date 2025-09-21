import { cn } from '../lib/utils'

export interface CardProps {
  class?: string
  children?: any
}

export default function Card(props: CardProps) {
  return (
    <div class={cn(
      'rounded-xl border bg-card text-card-foreground shadow',
      props.class
    )}>
      {props.children}
    </div>
  )
}

export interface CardHeaderProps {
  class?: string
  children?: any
}

export function CardHeader(props: CardHeaderProps) {
  return (
    <div class={cn('flex flex-col space-y-1.5 p-6', props.class)}>
      {props.children}
    </div>
  )
}

export interface CardTitleProps {
  class?: string
  children?: any
}

export function CardTitle(props: CardTitleProps) {
  return (
    <div class={cn('font-semibold leading-none tracking-tight', props.class)}>
      {props.children}
    </div>
  )
}

export interface CardContentProps {
  class?: string
  children?: any
}

export function CardContent(props: CardContentProps) {
  return (
    <div class={cn('p-6 pt-0', props.class)}>
      {props.children}
    </div>
  )
}