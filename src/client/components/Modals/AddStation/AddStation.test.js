import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
import AddStation from './AddStation';

describe('AddStation', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<AddStation close={() => {}} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  xit('should check form input', async () => {
    const wrapper = mount(<AddStation close={() => {}} />);
    wrapper.find('input').forEach(input => {
      input.simulate('change', {
        target: {
          name: input.instance().name,
          value: 'test',
        },
      });
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should test handleTest', async () => {
    const spy = jest.fn(
      () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
    );
    global.fetch = spy;
    const wrapper = mount(<AddStation close={() => {}} />);

    // fill out no input, shows name error
    wrapper.find('button').simulate('click');

    expect(wrapper.html()).toMatchSnapshot();

    // Fill out name input, shows address error
    wrapper
      .find('input')
      .at(1)
      .simulate('change', {
        target: {
          name: 'name',
          value: 'test',
        },
      });

    await act(async () => {
      wrapper.find('button').simulate('click');
    });
    expect(wrapper.html()).toMatchSnapshot();

    // Fill out address input, calls fetch
    wrapper
      .find('input')
      .at(1)
      .simulate('change', {
        target: {
          name: 'address',
          value: 'test',
        },
      });

    await act(async () => {
      wrapper.find('button').simulate('click');
    });
    expect(wrapper.html()).toMatchSnapshot();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
