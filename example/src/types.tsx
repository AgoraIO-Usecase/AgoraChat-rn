export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

export type ContactActionType =
  | 'group_invite'
  | 'group_member'
  | 'group_member_modify'
  | 'block_contact';
