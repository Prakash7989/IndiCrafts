import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'

export type PasswordFieldProps = React.ComponentProps<typeof Input> & {
    containerClassName?: string
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ className, containerClassName, ...props }, ref) => {
        const [show, setShow] = React.useState(false)

        return (
            <div className={cn('relative', containerClassName)}>
                <Input
                    ref={ref}
                    type={show ? 'text' : 'password'}
                    className={cn('pr-10', className)}
                    {...props}
                />
                <button
                    type="button"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        )
    }
)

PasswordField.displayName = 'PasswordField'
