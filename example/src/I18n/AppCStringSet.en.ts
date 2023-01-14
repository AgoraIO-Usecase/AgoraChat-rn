import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { UIKitStringSet2 } from 'react-native-chat-uikit';

export class AppStringSet extends UIKitStringSet2 {
  header: {
    groupInvite: string;
  };
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
  contactInfo: {
    name: (name: string) => string;
    chat: string;
    mute: string;
    block: string;
    blockAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
    delete: string;
    deleteAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
  };
  groupInfo: {
    name: (name: string) => string;
    groupDescription: string;
    chat: string;
    invite: string;
    members: string;
    members_1: {
      owner: string;
      admin: string;
    };
    actionToast: {
      enum: (code: number) => string;
    };
    mute: string;
    leave: string;
    leaveAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
    modify: {
      name: string;
      namePrompt: {
        placeholder: string;
        cancel: string;
        confirm: string;
      };
      description: string;
      descriptionPrompt: {
        placeholder: string;
        cancel: string;
        confirm: string;
      };
      groupId: string;
    };
    inviteAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
  };

  constructor(locate: Locale = en) {
    super(locate);
    this.header = {
      groupInvite: 'Invite',
    };
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
    this.contactInfo = {
      name: (n: string) => n,
      chat: 'Chat',
      mute: 'Mute Notification',
      block: 'Block Contact',
      delete: 'Delete Contact',
      blockAlert: {
        title: 'Block NickName',
        message:
          'When you block this contact, you will not receive any messages from them.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      deleteAlert: {
        title: 'Delete NickName',
        message: 'Delte this contact and associated chat.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
    };
    this.groupInfo = {
      name: (n: string) => n,
      groupDescription: 'Group description',
      chat: 'Chat',
      invite: 'Invite',
      members: 'Members',
      members_1: {
        owner: 'Group Owner',
        admin: 'Group Admin',
      },
      actionToast: {
        enum: (code: number) => code.toString(),
      },
      mute: 'Mute Notification',
      leave: 'Leave Group',
      leaveAlert: {
        title: 'Leave Group',
        message:
          'No prompt for other members and no group messages after you quit this group.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      modify: {
        name: 'Change group name',
        namePrompt: {
          placeholder: 'Group name',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        description: 'Change group description',
        descriptionPrompt: {
          placeholder: 'Group description',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        groupId: 'Copy Group ID',
      },
      inviteAlert: {
        title: 'Send group invitation',
        message:
          'You are about to invite nickname, nickname, nickname to the group that.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
    };
  }
}
