import { mount } from 'enzyme';
import React from 'react';
import AddStation from './AddStation';

describe('AddStation', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<AddStation />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
