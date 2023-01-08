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
  register: {
    id: string;
    pass: string;
    confirm: string;
    button: string;
    back: string;
    comment: (code: number) => string;
  };
  search: {
    placeholder: string;
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
    this.register = {
      id: 'Enter a AgoraId',
      pass: 'Enter a Password',
      confirm: 'Confirm Password',
      button: 'Sign Up',
      back: 'Back to Login',
      comment: (code) => {
        switch (code) {
          case 1:
            return 'Password do not match';
          case 2:
            return 'Username has already been taken';
          case 3:
            return 'Change a short one please';
          case 4:
            return 'Latin letters and numbers only';
          case 5:
            return 'Registration Success';
          default:
            return '';
        }
      },
    };
    this.search = {
      placeholder: 'Search',
    };
  }
}
