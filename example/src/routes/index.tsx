// // import type { RootParamsList } from './list';
// // {

// // }

// export const SCREENS = {
//   SignIn: {
//     option: undefined,
//     params: undefined,
//   },
//   SignUp: {
//     option: undefined,
//     params: undefined,
//   },
//   RequestList: {
//     option: undefined,
//     params: undefined,
//   },
//   MySetting: {
//     option: undefined,
//     params: undefined,
//   },
//   GroupList: {
//     option: undefined,
//     params: undefined,
//   },
//   ConversationList: {
//     option: undefined,
//     params: undefined,
//   },
//   ContactList: {
//     option: undefined,
//     params: undefined,
//   },
//   AddOperation: {
//     option: undefined,
//     params: undefined,
//   },
//   Privacy: {
//     option: undefined,
//     params: undefined,
//   },
//   Notification: {
//     option: undefined,
//     params: undefined,
//   },
//   General: {
//     option: undefined,
//     params: undefined,
//   },
//   About: {
//     option: undefined,
//     params: undefined,
//   },
//   GroupInfo: {
//     option: undefined,
//     params: undefined,
//   },
//   ContactInfo: {
//     option: undefined,
//     params: undefined,
//   },
//   Chat: {
//     option: undefined,
//     params: undefined,
//   },
//   JoinGroup: {
//     option: undefined,
//     params: undefined,
//   },
//   CreateGroup: {
//     option: undefined,
//     params: undefined,
//   },
//   AddContact: {
//     option: undefined,
//     params: undefined,
//   },
//   Home: {
//     option: undefined,
//     params: undefined,
//   },
//   Contact: {
//     option: undefined,
//     params: undefined,
//   },
//   Login: {
//     option: undefined,
//     params: undefined,
//   },
// };
// export const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];
// export type RootParamsList2 = {
//   SignIn: {
//     option: undefined;
//     params: undefined;
//   };
//   SignUp: {
//     option: undefined;
//     params: undefined;
//   };
//   RequestList: {
//     option: undefined;
//     params: undefined;
//   };
//   MySetting: {
//     option: undefined;
//     params: undefined;
//   };
//   GroupList: {
//     option: undefined;
//     params: undefined;
//   };
//   ConversationList: {
//     option: undefined;
//     params: undefined;
//   };
//   ContactList: {
//     option: undefined;
//     params: undefined;
//   };
//   AddOperation: {
//     option: undefined;
//     params: undefined;
//   };
//   Privacy: {
//     option: undefined;
//     params: undefined;
//   };
//   Notification: {
//     option: undefined;
//     params: undefined;
//   };
//   General: {
//     option: undefined;
//     params: undefined;
//   };
//   About: {
//     option: undefined;
//     params: undefined;
//   };
//   GroupInfo: {
//     option: undefined;
//     params: undefined;
//   };
//   ContactInfo: {
//     option: undefined;
//     params: undefined;
//   };
//   Chat: {
//     option: undefined;
//     params: undefined;
//   };
//   JoinGroup: {
//     option: undefined;
//     params: undefined;
//   };
//   CreateGroup: {
//     option: undefined;
//     params: undefined;
//   };
//   AddContact: {
//     option: undefined;
//     params: undefined;
//   };
//   Home: {
//     option: undefined;
//     params: undefined;
//   };
//   Contact: {
//     option: undefined;
//     params: undefined;
//   };
//   Login: {
//     option: undefined;
//     params: undefined;
//   };
// };
// type RootParamsList = typeof SCREENS;
// type Keyof<T extends {}> = Extract<keyof T, string>;
// export type RouteNames = Keyof<RootParamsList2>[];
// export type RouteNames2 = Extract<keyof RootParamsList2, string>;
// let s: RouteNames2[] = SCREEN_NAMES;
// console.log('test: s: ', s);
// export type ScreenParamsList<
//   T extends RootParamsList = RootParamsList,
//   U extends string = 'option'
// > = {
//   [P in keyof T as T[P] extends { params?: undefined } ? P : never]: Omit<
//     T[P],
//     U
//   >;
// };
// export type ScreenParamsList2<
//   T extends RootParamsList2 = RootParamsList2,
//   U extends string = 'option'
// > = {
//   [P in keyof T as T[P] extends { params?: undefined } ? P : never]: Omit<
//     T[P],
//     U
//   >;
// };
// let s2: ScreenParamsList2 = {
//   Login: {
//     params: undefined,
//   },
// };
// console.log(s2);

// {
//   type S = {
//     XX: {
//       option: undefined;
//       params?: {} | undefined;
//     };
//   };
//   const s: S = {
//     XX: {
//       option: undefined,
//       params: {},
//     },
//   };
//   console.log(s);
//   type SS = {
//     [P in keyof S]: Omit<S[P], 'option'>;
//   };
//   const ss: SS = {
//     XX: {},
//   };
//   console.log(ss);
//   const ss2: SS = {
//     XX: {},
//   };
//   console.log(ss2);
// }

/**
 * type RootParamsList = {
 *   SignIn: {
 *     option?: {} | undefined;
 *     params?: {} | undefined;
 *   };
 *   SignUp: {
 *     option?: {} | undefined;
 *     params?: {} | undefined;
 *   };
 * };
 *
 * type RootParamsName = Extract<keyof RootParamsList, string>;
 * type RootParamsNameList = RootParamsName[];
 * type ScreenParamsList<
 *   T extends {} = RootParamsList,
 *   U extends string = 'option'
 * > = {
 *   [K in keyof T]: Omit<T[K], U>;
 * };
 *
 * const s1: RootParamsNameList = ['SignIn', 'SignUp'];
 * const s1: RootParamsNameList = ['SignIn'];
 * const s2: RootParamsNameList = ['SignIn', 'SignUp', 'xxx'];
 * console.log(s1);
 *
 * const s2: ScreenParamsList = {
 *   SignIn: {
 *     params: {
 *       name: 'zs',
 *     },
 *   },
 *   SignUp: {},
 * };
 * console.log(s2);
 */
export type {
  RootParamsList,
  RootParamsName,
  RootParamsNameList,
  ScreenParamsList,
} from './list';
export { SCREEN_LIST, SCREEN_NAME_LIST } from './list';
