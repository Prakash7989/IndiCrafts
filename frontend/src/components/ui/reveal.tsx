import * as React from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
    as?: keyof JSX.IntrinsicElements
    className?: string
    children: React.ReactNode
    /** delay in ms */
    delay?: number
    /** Optional animation utility classes to use when revealing */
    revealClassName?: string
}

export const Reveal: React.FC<RevealProps> = ({
    as = 'div',
    className,
    children,
    delay = 0,
    revealClassName = 'animate-in fade-in slide-in-from-bottom-6 duration-700'
}) => {
    const ref = React.useRef<HTMLElement | null>(null)
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        if (!ref.current) return
        const node = ref.current
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (delay) {
                            const t = setTimeout(() => setVisible(true), delay)
                            return () => clearTimeout(t)
                        } else {
                            setVisible(true)
                        }
                    }
                })
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [delay])

    const Component: any = as
    return (
        <Component
            ref={ref as any}
            className={cn(
                'will-change-[transform,opacity]',
                visible ? revealClassName : 'opacity-0 translate-y-6',
                className
            )}
        >
            {children}
        </Component>
    )
}

export default Reveal


