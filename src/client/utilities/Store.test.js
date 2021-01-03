import Store from './Store';

describe('Store', () => {
  it('should test event emitter', () => {
    const spy = jest.fn();
    Store.listen('test', spy);
    expect(spy).toHaveBeenCalledTimes(0);

    Store.emit('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
