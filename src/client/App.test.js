import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from './App';

jest.mock('./components/Header');
jest.mock('./components/TreeView');
jest.mock('./components/Dashboard');
jest.mock('./components/Actions');

xdescribe('App', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(
      () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  xit('should render a snap shot', () => {
    let wrapper;
    act(() => {
      wrapper = mount(<App />);
    });
    expect(wrapper).toMatchSnapshot();
  });
});
