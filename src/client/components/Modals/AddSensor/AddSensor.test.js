import { mount } from 'enzyme';
import React from 'react';
import AddSensor from './AddSensor';

describe('AddSensor', () => {
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
    const wrapper = mount(<AddSensor close={() => {}} stationIp="123.123.123.123" />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
