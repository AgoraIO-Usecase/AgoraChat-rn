import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { UIKitStringSet2 } from 'react-native-chat-uikit';

export class AppUIKitStringSet extends UIKitStringSet2 {
  login: {
    logo: string;
    id: string;
    pass: string;
    button: string;
    tip: string;
    register: string;
  };
  constructor(locate: Locale = en) {
    super(locate);
    this.login = {
      logo: 'AograChat',
      id: 'AgoraId',
      pass: 'Password',
      button: 'Log in',
      tip: 'No account?',
      register: 'Register',
    };
  }
}
