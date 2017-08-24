import addons from '@storybook/addons';
import { CHANNEL_ID } from './constants';

export const messageLogger = (kind) => (msg) => {
  const channel = addons.getChannel();
  channel.emit(CHANNEL_ID, msg);
}