import { mount } from 'enzyme';
import React from 'react';
import App from './App';

describe.skip('App', () => {
  it('should render a snap shot', () => {
    global.fetch = jest.fn(
      () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
    );
    const wrapper = mount(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});
