import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const baseStyles =
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-primary text-white border-primary/30 hover:bg-primary-hover hover:border-primary/50 hover:shadow-md focus:ring-primary active:bg-primary-hover active:scale-95',
  secondary:
    'bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300 hover:border-gray-400 hover:shadow-md focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500 active:scale-95',
  danger:
    'bg-red-600 text-white border-red-700/50 hover:bg-red-700 hover:border-red-800 hover:shadow-md focus:ring-red-500 active:bg-red-800 active:scale-95',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}

