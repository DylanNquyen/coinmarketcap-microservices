import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

import styles from './PageContainer.module.css';

type PageContainerProps = PropsWithChildren<
  ComponentPropsWithoutRef<'div'>
>;

export function PageContainer({
  children,
  className = '',
  ...props
}: PageContainerProps) {
  const containerClassName = [
    styles.container,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName} {...props}>
      {children}
    </div>
  );
}