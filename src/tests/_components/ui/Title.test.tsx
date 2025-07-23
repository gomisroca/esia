import { render, screen } from '@testing-library/react';

import Title from '@/app/_components/ui/Title';

describe('Title', () => {
  it('renders the title with the correct text', () => {
    render(<Title>Hello, world!</Title>);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(<Title className="text-red-500">Hello, world!</Title>);
    expect(screen.getByText('Hello, world!')).toHaveClass('text-red-500');
  });
});
