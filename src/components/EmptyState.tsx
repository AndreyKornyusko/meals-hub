import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  message?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  message,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {message && (
        <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

