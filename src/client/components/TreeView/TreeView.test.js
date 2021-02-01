import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
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

  it('should render a snap shot', async () => {
    await act(async () => {
      const wrapper = mount(
        <TreeView
          stations={[
            {
              id: 1,
              name: 'test',
              health: 'healthy',
              address: '123.123.123.123',
              port: 'test',
              sensors: [
                {
                  id: 1,
                  name: 'test',
                  health: 'healthy',
                },
              ],
            },
          ]}
          dashboards={[
            {
              name: 'test',
              sensors: [
                {
                  id: 1,
                  stationId: 1,
                  position: 1,
                },
              ],
            },
          ]}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  xit('should test functionality', () => {
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
