import withRemoteRender from '../../src/components/withRemoteRender';
import Renderer from '../../src/components/Renderer';
import DummyService from '../../src/model/dummy-service';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

interface MessageProps {
  value: string;
}
const Message: React.StatelessComponent<MessageProps> = ({ value }) => (
  <div>{value}</div>
);
const EMessage = withRemoteRender()(Message);

let client: DummyService;
let c: ReactWrapper;

beforeEach(() => {
  client = new DummyService();
  c = mount(<Renderer server={client} components={[EMessage]} />);
});

test('renders on client message', () => {
  const mId = client.mountComponent(EMessage.externalName, {
    value: 'hello World'
  });

  expect(c.find(Message)).toHaveLength(1);
  expect(c.find(Message).html()).toBe('<div>hello World</div>');
});

test('update component on componentUpdate', () => {
  const mId = client.mountComponent(EMessage.externalName, {
    value: 'hello World'
  });
  client.updateComponent(mId, { value: 'Bye Bye' });

  expect(c.find(Message)).toHaveLength(1);
  expect(c.find(Message).html()).toBe('<div>Bye Bye</div>');
});

test('unmounts component on componentUnmount', () => {
  const mId = client.mountComponent(EMessage.externalName, {
    value: 'hello World'
  });
  client.unmountComponent(mId);

  expect(c.find(Message)).toHaveLength(0);
});

test("will do nothing is doesn't recognize the componentId", () => {
  const mId = client.mountComponent(EMessage.externalName, {
    value: 'hello World'
  });

  client.updateComponent(45, { value: 'Bye Bye' });
  client.unmountComponent(33);

  expect(c.html()).toBe('<div><div>hello World</div></div>');
});

test("will render nothing if doesn't recognize the component type", () => {
  const mId = client.mountComponent(EMessage.externalName, {
    value: 'hello World'
  });

  expect(c.html()).toBe('<div><div>hello World</div></div>');

  c.setProps({
    server: client,
    components: []
  });

  expect(c.html()).toBe('<div></div>');
});

test('stack components one after the other', () => {
  const mId = client.mountComponent(EMessage.externalName, {
    value: 'hello World'
  });
  const m2Id = client.mountComponent(EMessage.externalName, {
    value: 'La muerte fue y sera una porqueria'
  });

  expect(c.find(Message)).toHaveLength(2);

  client.unmountComponent(mId);
  expect(c.find(Message)).toHaveLength(1);

  client.unmountComponent(m2Id);
  expect(c.find(Message)).toHaveLength(0);
});

test('unregister from client on unmount', () => {
  c.unmount();
  expect(client.hasHandlers()).toBeFalsy();
});
