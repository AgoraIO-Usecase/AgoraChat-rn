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
