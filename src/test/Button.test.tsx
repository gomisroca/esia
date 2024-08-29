// Button.test.tsx
import Button from '../app/_components/ui/Button';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, vi } from 'vitest';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me!</Button>);
    screen.getByText('Click me!');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click me!</Button>);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
