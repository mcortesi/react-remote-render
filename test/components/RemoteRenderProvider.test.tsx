import RemoteRenderProvider from '../../src/components/RemoteRenderProvider';
import DummyService from '../../src/model/dummy-service';
import Transport from '../../src/model/dummy-transport';
import { mount } from 'enzyme';
import * as React from 'react';

// silent console.error
const errorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {
  /* do nothing */
});

test('fails if neither transport or client is passed', () => {
  expect(() =>
    mount(
      <RemoteRenderProvider>
        <div />
      </RemoteRenderProvider>
    )
  ).toThrow();
});

test('accepts a transport instead of client', () => {
  mount(
    <RemoteRenderProvider transport={new Transport()}>
      <div />
    </RemoteRenderProvider>
  );
});
