import {
  searchToObject,
  addOrUpdateHash,
  removeFromHash,
  objectToString,
  windowEmitter,
} from './Window';

describe('Window', () => {
  beforeEach(() => {
    delete global.window.location;
    global.window.location = {};
  });

  it('should test the event emitter', () => {
    const spy = jest.fn();
    expect(spy).toHaveBeenCalledTimes(0);
    windowEmitter.listen('test', spy);
    expect(spy).toHaveBeenCalledTimes(0);
    windowEmitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should test search to object function', () => {
    global.window.location.search = '';
    expect(searchToObject()).toEqual({});

    global.window.location.search = '?test=test&other=other';
    expect(searchToObject()).toEqual({ test: 'test', other: 'other' });
  });

  it('should test object to string function', () => {
    const obj = { test: 'test', other: 'other' };
    expect(objectToString(obj)).toEqual('test=test&other=other');

    global.window.location.search = `?${objectToString(obj)}`;
    expect(searchToObject()).toEqual(obj);
  });

  xit('should test adding, updating, and deleting from the hash', () => {
    global.window.location.search = '';
    const spy = jest.fn();

    windowEmitter.listen('change', () => {
      spy();
    });
    expect(spy).toHaveBeenCalledTimes(0);

    addOrUpdateHash('test', 'test');
    expect(spy).toHaveBeenCalledTimes(1);

    removeFromHash('test');
  });
});
