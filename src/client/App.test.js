import { mount } from 'enzyme';
import React from 'react';
import App from './App';

describe('App', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});
