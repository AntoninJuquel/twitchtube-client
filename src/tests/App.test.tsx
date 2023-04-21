import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Twitch } from '../pages';

describe('App', () => {
  it('Renders hello world', () => {
    // arrange
    render(<Twitch />);
    // act
    // expect
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Hello World');
  });
});
