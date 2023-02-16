export const CreateGroupSettingsEvent = 'CreateGroupSettingsEvent';
export type CreateGroupSettingsEventType =
  | 'set_public'
  | 'set_invite'
  | 'create_new_group';

export const ContactListEvent = 'ContactListEvent';
export type ContactListEventType =
  | 'toast_'
  | 'alert_'
  | 'sheet_'
  | 'create_group_result'
  | 'create_group_result_fail';
