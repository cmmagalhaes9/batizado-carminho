import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'pink' | 'ghost' | 'sage';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: Variant;
  readonly children: ReactNode;
}

/**
 * Button with the four canonical variants used across the app.
 * Falls through to native <button> for everything else (onClick, disabled, etc.).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...rest }, ref) => {
    const classes = [styles.btn, styles[variant], className].filter(Boolean).join(' ');
    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
