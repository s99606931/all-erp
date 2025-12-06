import { render } from '@testing-library/react';

import UiDesign from './ui-design';

describe('UiDesign', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiDesign />);
    expect(baseElement).toBeTruthy();
  });
});
