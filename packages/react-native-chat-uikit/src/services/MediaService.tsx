import React from 'react';
import { Platform } from 'react-native';
import type {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';

import type { Nullable, PartialNullable } from '../types';
import { generateFileName, getFileExtension, getFileType } from '../utils/file';
import type {
  FileType,
  MediaService,
  MediaServiceOptions,
  OpenCameraOptions,
  OpenMediaLibraryOptions,
  OpenResult,
  PlayAudioOptions,
  RecordAudioOptions,
  SaveFileOptions,
  VideoProps,
  VideoThumbnailOptions,
} from './types';

export class MediaServiceImplement implements MediaService {
  option: MediaServiceOptions;
  constructor(option: MediaServiceOptions) {
    this.option = option;
  }
  async startRecordAudio(option: RecordAudioOptions): Promise<boolean> {
    const recorder = this.option.audioRecorderModule;
    try {
      recorder.addRecordBackListener((e: RecordBackType) => {
        option.onPosition?.(e.currentPosition);
      });
      const uri = await recorder.startRecorder(option.url, option.audio);
      option.onSaved?.(uri.replace(/file:\/\//, ''));
      return true;
    } catch (error) {
      console.warn('startRecordAudio:', error);
      return false;
    }
  }
  async stopRecordAudio(): Promise<void> {
    const recorder = this.option.audioRecorderModule;
    await recorder.stopRecorder();
    recorder.removeRecordBackListener();
  }
  async playAudio(option: PlayAudioOptions): Promise<boolean> {
    const recorder = this.option.audioRecorderModule;
    try {
      recorder.addPlayBackListener((value: PlayBackType) => {
        option.onPlay?.({ ...value });
      });
      const url = await recorder.startPlayer(option.url, option.opt);
      option.onFile?.(url.replace(/file:\/\//, ''));
      return true;
    } catch (error) {
      console.warn('playAudio:', error);
      return false;
    }
  }
  async stopAudio(): Promise<void> {
    const recorder = this.option.audioRecorderModule;
    await recorder.stopPlayer();
    recorder.removePlayBackListener();
  }
  private resultReduction({
    uri,
    size,
    name,
    type,
  }: PartialNullable<FileType>): Nullable<FileType> {
    if (!uri) return null;
    return { uri, size: size ?? 0, name: name ?? '', type: type ?? '' };
  }

  async openMediaLibrary(
    options?: OpenMediaLibraryOptions | undefined
  ): Promise<Nullable<FileType>[]> {
    /**
     * NOTE: options.selectionLimit {@link https://github.com/react-native-image-picker/react-native-image-picker#options}
     * We do not support 0 (any number of files)
     **/
    const hasPermission =
      await this.option.permission.hasMediaLibraryPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestMediaLibraryPermission();
      if (!granted) {
        options?.onOpenFailure?.(new Error('Failed to obtain permission.'));
        return [];
      }
    }

    let selectionLimit = 1;
    if (options !== undefined) {
      selectionLimit = options.selectionLimit ? options.selectionLimit : 1;
    }
    const imagePicker = this.option.imagePickerModule;
    const response = await imagePicker.launchImageLibrary({
      presentationStyle: 'fullScreen',
      selectionLimit: selectionLimit,
      mediaType: (() => {
        switch (options?.mediaType) {
          case 'photo':
            return 'photo';
          case 'video':
            return 'video';
          case 'all':
            return 'mixed';
          default:
            return 'photo';
        }
      })(),
    });
    if (response.didCancel) return [];
    if (response.errorCode === 'camera_unavailable') {
      options?.onOpenFailure?.(new Error(response.errorMessage));
      return [];
    }

    const r: Nullable<FileType>[] = (response.assets || [])
      .slice(0, selectionLimit)
      .map(({ fileName: name, fileSize: size, type, uri }) =>
        this.resultReduction({ uri, size, name, type })
      );
    return r;
  }
  async openCamera(
    options?: OpenCameraOptions | undefined
  ): Promise<Nullable<FileType>> {
    const hasPermission = await this.option.permission.hasCameraPermission();
    if (!hasPermission) {
      const granted = await this.option.permission.requestCameraPermission();
      if (!granted) {
        options?.onOpenFailure?.(new Error('Failed to obtain permission.'));
        return null;
      }
    }

    const imagePicker = this.option.imagePickerModule;
    const response = await imagePicker.launchCamera({
      presentationStyle: 'fullScreen',
      cameraType: options?.cameraType ?? 'back',
      mediaType: (() => {
        switch (options?.mediaType) {
          case 'photo':
            return 'photo';
          case 'video':
            return 'video';
          case 'all':
            return 'mixed';
          default:
            return 'photo';
        }
      })(),
    });
    if (response.didCancel) return null;
    if (response.errorCode === 'camera_unavailable') {
      options?.onOpenFailure?.(new Error('Failed to obtain permission.'));
      return null;
    }

    const {
      fileName: name,
      fileSize: size,
      type,
      uri,
    } = response.assets?.[0] ?? {};
    return this.resultReduction({ uri, size, name, type });
  }
  async openDocument(
    options?: OpenResult | undefined
  ): Promise<Nullable<FileType>> {
    const hasPermission =
      await this.option.permission.hasMediaLibraryPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestMediaLibraryPermission();
      if (!granted) throw new Error('Permission not granted');
    }
    try {
      const { uri, size, name, type } =
        await this.option.documentPickerModule.pickSingle();
      return this.resultReduction({ uri, size, name, type });
    } catch (e) {
      if (
        !this.option.documentPickerModule.isCancel(e) &&
        this.option.documentPickerModule.isInProgress(e)
      ) {
        options?.onOpenFailure?.(new Error('Failed to obtain permission.'));
      }
      return null;
    }
  }
  async save(options: SaveFileOptions): Promise<Nullable<string>> {
    const basePath = Platform.select({
      android: this.option.fsModule.Dirs.CacheDir,
      default: this.option.fsModule.Dirs.DocumentDir,
    });
    let downloadPath = `${basePath}/${options.fileName}`;
    if (!getFileExtension(options.fileName)) {
      const extensionFromUrl = getFileExtension(options.fileUrl);
      if (getFileType(extensionFromUrl).match(/image|video/)) {
        downloadPath += extensionFromUrl;
      }
    }

    await this.option.fsModule.FileSystem.fetch(options.fileUrl, {
      path: downloadPath,
    });
    const fileType = getFileType(getFileExtension(options.fileUrl));

    if (
      Platform.OS === 'ios' &&
      (fileType === 'image' || fileType === 'video')
    ) {
      const type = ({ image: 'photo', video: 'video' } as const)[fileType];
      await this.option.mediaLibraryModule.save(downloadPath, { type });
    } else if (Platform.OS === 'android') {
      const dirType = {
        file: 'downloads',
        audio: 'audio',
        image: 'images',
        video: 'video',
      } as const;
      await this.option.fsModule.FileSystem.cpExternal(
        downloadPath,
        generateFileName(options.fileName, getFileExtension(options.fileUrl)),
        dirType[fileType]
      );
    } else {
      throw new Error('This platform is not supported.');
    }
    return downloadPath;
  }
  private static _hash(str: string) {
    return String(
      Math.abs(
        str.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
      )
    );
  }
  getVideoComponent<Props = {}>({
    source,
    resizeMode,
    onLoad,
    ...props
  }: VideoProps & Props): JSX.Element {
    const VideoComponent = this.option.videoModule;
    return (
      <VideoComponent
        {...props}
        source={source}
        resizeMode={resizeMode}
        onLoad={onLoad}
        controls
      />
    );
  }
  async getVideoThumbnail(
    options: VideoThumbnailOptions
  ): Promise<Nullable<{ path: string }>> {
    try {
      const CreateThumbnail = this.option.videoThumbnail;
      const { path } = await CreateThumbnail.createThumbnail({
        url: options.url,
        format: 'jpeg',
        timeStamp: options.timeMills,
        cacheName: MediaServiceImplement._hash(options.url),
      });
      return { path };
    } catch (e) {
      console.warn(e);
      return null;
    }
  }
}
