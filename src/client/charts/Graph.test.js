import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Graph from './Graph';

jest.mock('../Api', () => ({
  getReadings: () => new Promise(res => res([])),
}));

describe('dashboard', () => {
  it('should render a snap shot', async () => {
    let wrapper;
    await act(async () => {
      wrapper = await mount(
        <Graph name="test" sensor={{ id: 1, name: 'test' }} renderTrigger={new Date()} />,
      );
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
