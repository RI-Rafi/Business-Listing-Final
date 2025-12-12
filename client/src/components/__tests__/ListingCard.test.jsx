import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListingCard from '../ListingCard.jsx';

describe('ListingCard', () => {
  const mockListing = {
    _id: '123',
    name: 'Test Business',
    category: 'Haircut',
    location: { city: 'Dhaka', area: 'Gulshan' },
    shortDescription: 'A test business description',
    imageUrl: 'https://example.com/image.jpg',
  };

  it('renders listing information correctly', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('Haircut')).toBeInTheDocument();
    expect(screen.getByText('Dhaka, Gulshan')).toBeInTheDocument();
    expect(screen.getByText('A test business description')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );

    const image = screen.getByAltText('Test Business');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders without image when imageUrl is not provided', () => {
    const listingWithoutImage = { ...mockListing, imageUrl: null };
    render(
      <BrowserRouter>
        <ListingCard listing={listingWithoutImage} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Business')).toBeInTheDocument();
    const images = screen.queryAllByAltText('Test Business');
    expect(images.length).toBe(0);
  });
});

