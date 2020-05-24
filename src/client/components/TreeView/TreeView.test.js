import { mount } from 'enzyme';
import React from 'react';
import TreeView from './TreeView';

describe('TreeView', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<TreeView />);
    expect(wrapper).toMatchSnapshot();
  });
});
