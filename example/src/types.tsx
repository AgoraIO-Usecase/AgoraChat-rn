export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

export type GroupActionType =
  | 'group_invite'
  | 'group_member'
  | 'group_member_modify';
