import { ClipboardServiceImplement } from './ClipboardService';
import { MediaServiceImplement } from './MediaService';
import { NotificationServiceImplement } from './NotificationService';
import type {
  ClipboardService,
  ClipboardServiceOption,
  MediaService,
  MediaServiceOptions,
  NotificationService,
  NotificationServiceOption,
} from './types';

export function createClipboardService(): ClipboardService {
  return {} as any;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Services {
  static cbs: ClipboardService;
  static ms: MediaService;
  static ns: NotificationService;

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
