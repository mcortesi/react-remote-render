import {
  DefaultRemoteRenderClient,
  DefaultRemoteRenderServer
} from '../../src/model/default-service';
import DummyTransport from '../../src/model/dummy-transport';
import { RemoteRenderHandler } from '../../src/types/service';

const errorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {
  /* do nothing */
});

let client: DefaultRemoteRenderClient;
let server: DefaultRemoteRenderServer;
let handler: {
  onComponentMount: jest.Mock<{}>;
  onComponentUnmount: jest.Mock<{}>;
  onComponentUpdate: jest.Mock<{}>;
};

beforeEach(() => {
  errorSpy.mockClear();

  const transport = new DummyTransport();
  client = new DefaultRemoteRenderClient(transport);
  server = new DefaultRemoteRenderServer(transport);

  handler = {
    onComponentMount: jest.fn(),
    onComponentUnmount: jest.fn(),
    onComponentUpdate: jest.fn()
  };

  server.registerHandler(handler);
});

test('it pass along simple props', () => {
  const id = client.mountComponent('A', {
    num: 1,
    str: 'hola',
    arr: [1, 2],
    obj: { a: 2, b: [3, 4] }
  });
  client.updateComponent(id, { b: 5, c: 10 });
  client.unmountComponent(id);

  expect(handler.onComponentMount).toHaveBeenCalledTimes(1);
  expect(handler.onComponentMount).toBeCalledWith(id, 'A', {
    num: 1,
    str: 'hola',
    arr: [1, 2],
    obj: { a: 2, b: [3, 4] }
  });
  expect(handler.onComponentUpdate).toBeCalledWith(id, { b: 5, c: 10 });
  expect(handler.onComponentUnmount).toBeCalledWith(id);
});

test('prop functions can be called over the wire', () => {
  const f = jest.fn();

  client.mountComponent('A', { f });

  const passedF = handler.onComponentMount.mock.calls[0][2].f;

  expect(passedF).not.toBe(f);

  passedF('a', 1, [2, 3]);
  expect(f).toHaveBeenLastCalledWith('a', 1, [2, 3]);

  passedF({ a: 3, b: 5 });
  expect(f).toHaveBeenLastCalledWith({ a: 3, b: 5 });
});

test("nested function props won't work", () => {
  const f = jest.fn();

  client.mountComponent('A', { nested: { f } });

  const passedF = handler.onComponentMount.mock.calls[0][2].nested.f;

  expect(typeof passedF).not.toBe('function');
});

test('continues after handler error', () => {
  const failingHandler = {
    onComponentMount: jest.fn(() => {
      throw new Error('induced error');
    }),
    onUnmountComponent: jest.fn(() => {
      throw new Error('induced error');
    }),
    onUpdateComponent: jest.fn(() => {
      throw new Error('induced error');
    })
  };
  server.registerHandler(failingHandler);

  const id = client.mountComponent('A', { a: 1, b: 2 });
  client.updateComponent(id, { a: 2, b: 2 });
  client.unmountComponent(id);

  expect(errorSpy).toHaveBeenCalledTimes(3);
});

test('handle & log when trying to call old prop functions', () => {
  const f = jest.fn();
  const id = client.mountComponent('A', { f });
  const passedF = handler.onComponentMount.mock.calls[0][2].f;

  passedF('a', 1, [2, 3]);
  expect(f).toHaveBeenCalledTimes(1);

  client.updateComponent(id, { x: 'something else' });

  passedF('aa');
  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(f).toHaveBeenCalledTimes(1);
});

test('handler unregisters', () => {
  client.mountComponent('A', { a: 1 });
  expect(handler.onComponentMount).toHaveBeenCalledTimes(1);
  server.unregisterHandler(handler);

  client.mountComponent('B', { a: 1 });
  expect(handler.onComponentMount).toHaveBeenCalledTimes(1);
});
