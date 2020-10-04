import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
import AddSensor from './AddSensor';

describe('AddSensor', () => {
  let originalFetch;
  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(
      () =>
        new Promise(res => res({ json: () => new Promise(inner => inner(['test-1', 'test-2'])) })),
    );
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('should render a snap shot', async () => {
    await act(async () => {
      const wrapper = mount(<AddSensor close={() => {}} address="123.123.123.123" port="80" />);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should test inputs', async () => {
    await act(async () => {
      const wrapper = mount(<AddSensor close={() => {}} address="123.123.123.123" port="80" />);
      wrapper.find('input').forEach(input => {
        input.simulate('change', { value: 'test' });
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  xit('should test sensor testing', async () => {
    await act(async () => {
      const wrapper = mount(<AddSensor close={() => {}} address="123.123.123.123" port="80" />);
      wrapper.find('input').forEach(input => {
        input.simulate('change', { value: 'test' });
      });

      delete global.window.location.search;
      global.window.location.search = 'test=test-1';
      // wrapper.find('button').simulate('click');
      // expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
