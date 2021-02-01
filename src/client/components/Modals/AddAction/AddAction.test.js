import { mount } from 'enzyme';
import React from 'react';
import AddAction from './AddAction';

describe('AddAction', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(
      <AddAction
        cancel={() => {}}
        save={() => {}}
        actionConditions={['test']}
        message="test"
        action={{
          id: 1,
        }}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
