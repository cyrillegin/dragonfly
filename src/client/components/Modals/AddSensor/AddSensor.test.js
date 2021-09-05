import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
import AddSensor from './AddSensor';

jest.mock('../../../Api', () => ({
  listSensors: () => new Promise(res => res([])),
}));

describe('AddSensor', () => {
  it('should render a snap shot', async () => {
    let wrapper;
    await act(async () => {
      wrapper = await mount(<AddSensor close={() => {}} address="123.123.123.123" port="80" />);
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should test inputs', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<AddSensor close={() => {}} address="123.123.123.123" port="80" />);
      wrapper.find('input').forEach(input => {
        input.simulate('change', { value: 'test' });
      });
    });
    expect(wrapper.html()).toMatchSnapshot();
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
