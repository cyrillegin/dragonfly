import { mount } from 'enzyme';
import React from 'react';
import Actions from './Actions';

describe('Actions', () => {
  it('should render a snapshot', () => {
    const wrapper = mount(
      <Actions
        stations={[
          {
            name: 'test',
            address: 'test',
            port: 'test',
            sensors: [{ name: 'test', actions: [{ id: 'test' }] }],
          },
        ]}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
