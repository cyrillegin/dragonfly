import { mount } from 'enzyme';
import React from 'react';
import TreeView from './TreeView';

describe('TreeView', () => {
  let originalFetch;
  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(
      () => new Promise(res => res({ json: () => new Promise(inner => inner([])) })),
    );
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('should render a snap shot', () => {
    const wrapper = mount(
      <TreeView
        stations={[
          {
            id: 1,
            name: 'test',
            health: 'healthy',
            ip: '123.123.123.123',
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
            ip: '123.123.123.123',
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
    wrapper.find('.station').forEach(station => station.simulate('click'));

    wrapper.find('.sensor').forEach(sensor => sensor.simulate('click'));
  });
});
