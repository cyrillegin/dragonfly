import { mount } from 'enzyme';
import React from 'react';
import TreeView from './TreeView';

describe('TreeView', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(
      <TreeView
        stations={[
          {
            id: 1,
            name: 'test',
            health: 'healthy',
            sensors: [
              {
                id: 1,
                name: 'test',
                health: 'healthy',
              },
            ],
          },
        ]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should test functionality', () => {
    const wrapper = mount(
      <TreeView
        stations={[
          {
            id: 1,
            name: 'test',
            health: 'healthy',
            sensors: [
              {
                id: 1,
                name: 'test',
                health: 'healthy',
              },
            ],
          },
        ]}
      />,
    );
    wrapper.find('.station').simulate('click');

    wrapper.find('.sensor').simulate('click');
  });
});
