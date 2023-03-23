import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Home } from '../pages';

describe('App', () => {
  it('Renders hello world', () => {
    // arrange
    render(<Home />);
    // act
    // expect
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Hello World');
  });
});
