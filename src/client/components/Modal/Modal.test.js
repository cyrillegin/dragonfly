import { mount } from 'enzyme';
import React from 'react';
import Modal from './Modal';

describe('Modal', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<Modal />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
