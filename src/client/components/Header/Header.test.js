import { mount } from 'enzyme';
import React from 'react';
import Header from './Header';

describe('Header', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<Header />);
    expect(wrapper).toMatchSnapshot();
  });
});
