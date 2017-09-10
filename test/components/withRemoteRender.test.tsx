import withRemoteRender from '../../src/components/withRemoteRender';
import RemoteRenderProvider from '../../src/components/RemoteRenderProvider';
import DummyService from '../../src/model/dummy-service';
import { mount } from 'enzyme';
import * as React from 'react';

interface Props {
  title: string;
  onClick: () => void;
}
const Component: React.StatelessComponent<Props> = ({ title, onClick }) => (
  <div onClick={onClick}>{title}</div>
);

let client: DummyService;
let handler;
beforeEach(() => {
  client = new DummyService();
  handler = {
    onComponentMount: jest.fn(),
    onComponentUnmount: jest.fn(),
    onComponentUpdate: jest.fn()
  };

  client.registerHandler(handler);
});

test('does remote render', () => {
  const EComponent = withRemoteRender<Props>()(Component);

  const onClick = jest.fn();
  const c = mount(<EComponent title="hey jo" onClick={onClick} />, {
    context: { client }
  });

  expect(c.isEmptyRender()).toBeTruthy();
  expect(handler.onComponentMount).toHaveBeenCalledTimes(1);

  c.setProps({ title: 'title changed', onClick: onClick });
  expect(handler.onComponentUpdate).toHaveBeenCalledTimes(1);

  // same props, no update
  c.setProps({ title: 'title changed', onClick: onClick });
  expect(handler.onComponentUpdate).toHaveBeenCalledTimes(1);

  c.unmount();
  expect(handler.onComponentUnmount).toHaveBeenCalledTimes(1);
});

test('uses custom serializers', () => {
  const EComponent = withRemoteRender<Props>({
    customSerializers: {
      title: {
        serialize: str => str.toUpperCase(),
        deserialize: str => str.toLowerCase()
      }
    }
  })(Component);

  const onClick = jest.fn();
  const c = mount(<EComponent title="hey jo" onClick={onClick} />, {
    context: { client }
  });

  expect(handler.onComponentMount.mock.calls[0][2].title).toBe('HEY JO');

  expect(EComponent.deserializeProps({ title: 'Aloha', onClick })).toEqual({
    title: 'aloha',
    onClick
  });
});

test('using RemoteRenderProvider', () => {
  const EComponent = withRemoteRender<Props>()(Component);

  const onClick = jest.fn();
  const c = mount(
    <RemoteRenderProvider client={client}>
      <EComponent title="hey jo" onClick={onClick} />
    </RemoteRenderProvider>
  );

  expect(handler.onComponentMount).toHaveBeenCalledTimes(1);
});
