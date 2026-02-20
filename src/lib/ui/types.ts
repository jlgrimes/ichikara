import type { ReactNode } from 'react';

export interface PageProps {
  children: ReactNode;
  className?: string;
}

export interface NavbarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export interface ListItemProps {
  title: string;
  subtitle?: string;
  media?: ReactNode;
  after?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}
