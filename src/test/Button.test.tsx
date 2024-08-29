// Button.test.tsx
import Button from '../app/_components/ui/Button';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, vi } from 'vitest';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me!</Button>);
    expect(screen.getByText('Click me!')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click me!</Button>);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies className correctly', () => {
    const { container } = render(<Button className="bg-white">Click me!</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-white');
  });

  it('disables button when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Click me!</Button>);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('sets type attribute correctly', () => {
    const { getByRole } = render(<Button type="submit">Click me!</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders with default type when type prop is not provided', () => {
    const { getByRole } = render(<Button>Click me!</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
