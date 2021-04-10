import { mount } from 'enzyme';
import React from 'react';
import AddGraph from './AddGraph';

describe('AddGraph', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<AddGraph close={() => {}} stations={[]} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
