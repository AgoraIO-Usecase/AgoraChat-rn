import { ChatLog } from 'react-native-chat-sdk';

export const RootParamsList: Record<string, object | undefined> = {
  Main: {},
  Chat: {},
};
export let appKey = '';
export let defaultId = '';
export let defaultToken = ''; // https://console.agora.io/projects
export const autoLogin = false;
export const debugModel = true;
export let defaultTargetId = '';

try {
  appKey = require('./env').appKey;
  defaultId = require('./env').id;
  defaultToken = require('./env').token;
  defaultTargetId = require('./env').targetId;
} catch (error) {
  console.error(error);
}

export const dlog = new ChatLog();
dlog.tag = 'demo';
