// Dropdown.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';
import Dropdown from '../app/_components/ui/Dropdown';

describe('Dropdown component', () => {
  it('renders the dropdown button with the correct name', () => {
    render(<Dropdown button={{ text: 'Select an option' }}>Options</Dropdown>);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('toggles the dropdown menu when the button is clicked', () => {
    render(
      <Dropdown button={{ text: 'Select an option' }}>
        <li>Option 1</li>
        <li>Option 2</li>
      </Dropdown>
    );

    const button = screen.getByText('Select an option');

    // Initially, the dropdown menu should not be visible
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    // Click to open the dropdown menu
    fireEvent.click(button);
    expect(screen.getByRole('list')).toBeInTheDocument();

    // Click again to close the dropdown menu
    fireEvent.click(button);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('closes the dropdown menu when clicking outside', () => {
    render(
      <div>
        <Dropdown button={{ text: 'Select an option' }}>
          <li>Option 1</li>
          <li>Option 2</li>
        </Dropdown>
        <button>Outside Button</button>
      </div>
    );

    const button = screen.getByText('Select an option');

    // Open the dropdown menu
    fireEvent.click(button);
    expect(screen.getByRole('list')).toBeInTheDocument();

    // Click outside the dropdown
    const outsideButton = screen.getByText('Outside Button');
    fireEvent.click(outsideButton);

    // The dropdown menu should close
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('closes the dropdown menu when a child item is clicked', () => {
    render(
      <Dropdown button={{ text: 'Select an option' }}>
        <li>Option 1</li>
        <li>Option 2</li>
      </Dropdown>
    );

    const button = screen.getByText('Select an option');

    // Open the dropdown menu
    fireEvent.click(button);
    expect(screen.getByRole('list')).toBeInTheDocument();

    // Click on a dropdown item
    fireEvent.click(screen.getByText('Option 1'));

    // The dropdown menu should close
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('applies className correctly to the dropdown menu', () => {
    render(
      <Dropdown button={{ text: 'Select an option' }} className="custom-class">
        <li>Option 1</li>
        <li>Option 2</li>
      </Dropdown>
    );

    const button = screen.getByText('Select an option');

    // Open the dropdown menu
    fireEvent.click(button);

    // Check if the dropdown menu has the custom class
    const dropdownMenu = screen.getByRole('list').parentElement;
    expect(dropdownMenu).toHaveClass('custom-class');
  });

  it('applies btnClassName correctly to the dropdown button', () => {
    render(
      <Dropdown button={{ text: 'Select an option', className: 'btn-custom-class' }}>
        <li>Option 1</li>
        <li>Option 2</li>
      </Dropdown>
    );

    // Check if the button has the custom class
    const button = screen.getByText('Select an option');
    expect(button).toHaveClass('btn-custom-class');
  });
});
