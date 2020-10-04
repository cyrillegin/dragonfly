import { mount } from 'enzyme';
import React from 'react';
import BulkAdd from './BulkAdd';

describe('BulkAdd', () => {
  it('should render a snap shot', () => {
    global.localStorage = {
      getItem: () => 'test:test',
      setItem: () => {},
    };
    const wrapper = mount(<BulkAdd close={() => {}} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
