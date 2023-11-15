import { initializeBlock } from '@airtable/blocks/ui';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { globalConfig } from '@airtable/blocks';
const APP_KEY = globalConfig.get('apiKey') as string;

function loadDropboxChooserScript() {
  const script = document.createElement('script');
  script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
  script.id = 'dropboxjs';
  script.dataset.appKey = APP_KEY;
  document.head.appendChild(script);
}

initializeBlock(() => {
  loadDropboxChooserScript();

  return <App />;
});