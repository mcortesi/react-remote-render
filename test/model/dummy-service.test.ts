import DummyService from '../../src/model/dummy-service';

const errorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {
  /* do nothing */
});

test('calls handler', () => {
  const srv = new DummyService();
  const handler = {
    onComponentMount: jest.fn(),
    onComponentUnmount: jest.fn(),
    onComponentUpdate: jest.fn()
  };
  srv.registerHandler(handler);

  const id = srv.mountComponent('A', { a: 1, b: 2 });
  srv.updateComponent(id, { a: 2, b: 2 });
  srv.updateComponent(id, { a: 3, b: 2 });
  srv.unmountComponent(id);

  expect(handler.onComponentMount).toHaveBeenCalledTimes(1);
  expect(handler.onComponentMount).toHaveBeenCalledWith(0, 'A', { a: 1, b: 2 });

  expect(handler.onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(handler.onComponentUpdate).toHaveBeenCalledWith(0, { a: 2, b: 2 });
  expect(handler.onComponentUpdate).toHaveBeenCalledWith(0, { a: 3, b: 2 });

  expect(handler.onComponentUnmount).toHaveBeenCalledTimes(1);
  expect(handler.onComponentUnmount).toHaveBeenCalledWith(0);
});

test('calls ALL handlers', () => {
  const srv = new DummyService();
  const createHandler = () => ({
    onComponentMount: jest.fn(),
    onComponentUnmount: jest.fn(),
    onComponentUpdate: jest.fn()
  });

  const h1 = createHandler();
  const h2 = createHandler();
  srv.registerHandler(h1);
  srv.registerHandler(h2);

  const id = srv.mountComponent('A', { a: 1, b: 2 });
  srv.updateComponent(id, { a: 2, b: 2 });
  srv.unmountComponent(id);

  expect(h1.onComponentMount).toHaveBeenCalledTimes(1);
  expect(h1.onComponentUpdate).toHaveBeenCalledTimes(1);
  expect(h1.onComponentUnmount).toHaveBeenCalledTimes(1);
  expect(h2.onComponentMount).toHaveBeenCalledTimes(1);
  expect(h2.onComponentUpdate).toHaveBeenCalledTimes(1);
  expect(h2.onComponentUnmount).toHaveBeenCalledTimes(1);
});

test('continues after handler error', () => {
  const srv = new DummyService();
  const failingHandler = {
    onComponentMount: jest.fn(() => {
      throw new Error('induced error');
    }),
    onComponentUnmount: jest.fn(() => {
      throw new Error('induced error');
    }),
    onComponentUpdate: jest.fn(() => {
      throw new Error('induced error');
    })
  };
  const normalHandler = {
    onComponentMount: jest.fn(),
    onComponentUnmount: jest.fn(),
    onComponentUpdate: jest.fn()
  };

  srv.registerHandler(failingHandler);
  srv.registerHandler(normalHandler);

  const id = srv.mountComponent('A', { a: 1, b: 2 });
  srv.updateComponent(id, { a: 2, b: 2 });
  srv.unmountComponent(id);

  expect(errorSpy).toHaveBeenCalledTimes(3);
});
