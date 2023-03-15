import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { UIKitStringSet2 } from 'react-native-chat-uikit';

export class AppStringSet extends UIKitStringSet2 {
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
      logo: 'AgoraChat',
      id: 'AgoraId',
      pass: 'Password',
      button: 'Log In',
      tip: 'No account?',
      register: 'Register',
    };
  }
}
