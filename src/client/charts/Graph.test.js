import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Graph from './Graph';

describe('dashboard', () => {
  it('should render a snap shot', async () => {
    global.fetch = jest.fn(
      () =>
        new Promise(res =>
          res({ json: () => new Promise(inner => inner([{ timestamp: new Date(), value: 1 }])) }),
        ),
    );

    let wrapper;
    await act(async () => {
      wrapper = await mount(
        <Graph name="test" sensor={{ id: 1, name: 'test' }} renderTrigger={new Date()} />,
      );
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
