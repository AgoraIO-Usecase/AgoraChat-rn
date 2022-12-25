import { ClipboardServiceImplement } from './ClipboardService';
import { MediaServiceImplement } from './MediaService';
import { NotificationServiceImplement } from './NotificationService';
import { PermissionServiceImplement } from './PermissionService';
import type {
  ClipboardService,
  ClipboardServiceOption,
  MediaService,
  MediaServiceOptions,
  NotificationService,
  NotificationServiceOption,
  PermissionService,
  PermissionServiceOption,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Services {
  static cbs: ClipboardService;
  static ms: MediaService;
  static ns: NotificationService;
  static ps: PermissionService;

  public static createPermissionService(
    option: PermissionServiceOption
  ): PermissionService {
    if (Services.ps === undefined) {
      Services.ps = new PermissionServiceImplement(option);
    }
    return Services.ps;
  }

  public static createClipboardService(
    option: ClipboardServiceOption
  ): ClipboardService {
    if (Services.cbs === undefined) {
      Services.cbs = new ClipboardServiceImplement(option);
    }
    return Services.cbs;
  }

  public static createMediaService(option: MediaServiceOptions): MediaService {
    if (Services.ms === undefined) {
      Services.ms = new MediaServiceImplement(option);
    }
    return Services.ms;
  }

  public static createNotificationService(
    option: NotificationServiceOption
  ): NotificationService {
    if (Services.ns === undefined) {
      Services.ns = new NotificationServiceImplement(option);
    }
    return Services.ns;
  }
}

export * from './types';
