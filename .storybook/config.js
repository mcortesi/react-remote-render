import {
  configure
} from '@storybook/react';
import {
  setOptions
} from '@storybook/addon-options';

setOptions({
  name: 'React Remote Render',
  url: '#',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  downPanelInRight: true,
});

function loadStories() {
  require('../stories');
  // You can require as many stories as you need.
}

configure(loadStories, module);
