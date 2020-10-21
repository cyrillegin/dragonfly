import { mount } from 'enzyme';
import React from 'react';
import BulkAdd from './BulkAdd';

describe('BulkAdd', () => {
  it('should render a snap shot', () => {
    global.localStorage = {
      getItem: () => 'test:test',
      setItem: () => {},
    };
    const wrapper = mount(
      <BulkAdd
        close={() => {}}
        stations={[
          {
            it: 'test',
            name: 'test',
            health: 'healthy',
            address: 'test',
            port: 'test',
            sensors: [
              {
                id: 'test',
                name: 'test',
                health: 'healthy',
              },
            ],
          },
        ]}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
