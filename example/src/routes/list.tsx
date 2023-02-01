import type {
  ContactActionType,
  SearchActionType,
  Undefinable,
} from '../types';

export type TopTabParamsList = {
  ContactList: {
    option?: {} | undefined;
    params?: { type?: Undefinable<ContactActionType> } | undefined;
  };
  GroupList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  RequestList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
};
export type BottomTabParamsList = TopTabParamsList & {
  ConversationList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Contact: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  MySetting: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
};
export type RootParamsList = BottomTabParamsList & {
  SignIn: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  SignUp: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  AddOperation: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Privacy: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Notification: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  General: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  About: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  GroupInfo: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  ContactInfo: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Chat: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  JoinGroup: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  CreateGroup: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  AddContact: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Home: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Login: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Add: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Search: {
    option?: {} | undefined;
    params?: { type?: Undefinable<SearchActionType> } | undefined;
  };
};
export type RootParamsName = Extract<keyof RootParamsList, string>;
export type RootParamsNameList = RootParamsName[];
export type TopTabScreenParamsList<
  T extends {} = TopTabParamsList,
  U extends string = 'option'
> = {
  [K in keyof T]: Omit<T[K], U>;
};
export type BottomTabScreenParamsList<
  T extends {} = BottomTabParamsList,
  U extends string = 'option'
> = {
  [K in keyof T]: Omit<T[K], U>;
};
export type RootScreenParamsList<
  T extends {} = RootParamsList,
  U extends string = 'option'
> = {
  [K in keyof T]: Omit<T[K], U>;
};

export const SCREEN_LIST: RootParamsList = {
  SignIn: {
    option: undefined,
    params: undefined,
  },
  SignUp: {
    option: undefined,
    params: undefined,
  },
  RequestList: {
    option: undefined,
    params: undefined,
  },
  MySetting: {
    option: undefined,
    params: undefined,
  },
  GroupList: {
    option: undefined,
    params: undefined,
  },
  ConversationList: {
    option: undefined,
    params: undefined,
  },
  ContactList: {
    option: undefined,
    params: undefined,
  },
  AddOperation: {
    option: undefined,
    params: undefined,
  },
  Privacy: {
    option: undefined,
    params: undefined,
  },
  Notification: {
    option: undefined,
    params: undefined,
  },
  General: {
    option: undefined,
    params: undefined,
  },
  About: {
    option: undefined,
    params: undefined,
  },
  GroupInfo: {
    option: undefined,
    params: undefined,
  },
  ContactInfo: {
    option: undefined,
    params: undefined,
  },
  Chat: {
    option: undefined,
    params: undefined,
  },
  JoinGroup: {
    option: undefined,
    params: undefined,
  },
  CreateGroup: {
    option: undefined,
    params: undefined,
  },
  AddContact: {
    option: undefined,
    params: undefined,
  },
  Home: {
    option: undefined,
    params: undefined,
  },
  Contact: {
    option: undefined,
    params: undefined,
  },
  Login: {
    option: undefined,
    params: undefined,
  },
  Add: {
    option: undefined,
    params: undefined,
  },
  Search: {
    option: undefined,
    params: undefined,
  },
};
export const SCREEN_NAME_LIST: RootParamsNameList = Object.keys(
  SCREEN_LIST
) as (keyof RootParamsList)[];
