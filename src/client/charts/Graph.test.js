import { mount } from 'enzyme';
import React from 'react';
import Graph from './Graph';

describe('dashboard', () => {
  it.skip('should render a snap shot', () => {
    global.fetch = jest.fn(
      () =>
        new Promise(res =>
          res({ json: () => new Promise(inner => inner([{ timestamp: new Date(), value: 1 }])) }),
        ),
    );

    const wrapper = mount(
      <Graph station={{ id: 1, name: 'test' }} sensor={{ id: 1, name: 'test' }} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
