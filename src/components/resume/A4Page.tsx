import type React from 'react'
import { twJoin } from 'tailwind-merge'

const A4Page = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={twJoin(
        'a4-page mx-auto my-5 print:my-0 shadow-xl print:shadow-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default A4Page
