import '@babel/polyfill';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as emotion from '@emotion/react';
import { createSerializer } from '@emotion/jest';

configure({ adapter: new Adapter() });

expect.addSnapshotSerializer(createSerializer(emotion));

global.console.info = () => {};
