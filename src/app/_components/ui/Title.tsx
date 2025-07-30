/**
 * A title component.
 *
 * @param {string} [className] - Optional class names for the title.
 * @param {React.ReactNode} children - The content of the title.
 *
 * @example
 * import Title from './Title';
 * const MyTitle = () => <Title>Hello, world!</Title>;
 */

import { twMerge } from 'tailwind-merge';

interface TitleProps {
  className?: string;
  children: React.ReactNode;
}

function Title({ className, children }: TitleProps) {
  return <h1 className={twMerge('text-center text-3xl font-bold', className)}>{children}</h1>;
}

export default Title;
