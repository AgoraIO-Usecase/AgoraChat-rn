import React, { useCallback, useContext, useRef } from 'react';

import ActionMenu from '../components/ActionMenu';
import Alert from '../components/Alert';
import BottomSheet from '../components/BottomSheet';
import Prompt from '../components/Prompt';
import { useUpdate } from '../hooks';
import type { DialogPropsT, DialogTask } from '../types';
import type { DialogContextType } from './types';

const AlertContext = React.createContext<Pick<
  DialogContextType,
  'openAlert'
> | null>(null);
AlertContext.displayName = 'UIKitAlertContext';

const ActionMenuContext = React.createContext<Pick<
  DialogContextType,
  'openMenu'
> | null>(null);
ActionMenuContext.displayName = 'UIKitActionMenuContext';

const PromptContext = React.createContext<Pick<
  DialogContextType,
  'openPrompt'
> | null>(null);
PromptContext.displayName = 'UIKitPromptContext';

const BottomSheetContext = React.createContext<Pick<
  DialogContextType,
  'openSheet'
> | null>(null);
BottomSheetContext.displayName = 'UIKitBottomSheetContext';

type DialogContextProps = React.PropsWithChildren<{
  defaultLabels?: {
    alert?: { ok?: string };
    prompt?: { placeholder?: string; ok?: string; cancel?: string };
  };
}>;
const TIMEOUT = 3000;
export const DialogContextProvider = ({
  defaultLabels,
  children,
}: DialogContextProps) => {
  const waitDismissT = useRef<NodeJS.Timeout>();
  const waitDismissP = useRef<() => void>();
  const completeDismiss = useCallback(() => {
    if (waitDismissT.current) clearTimeout(waitDismissT.current);
    if (waitDismissP.current) waitDismissP.current();
    waitDismissT.current = undefined;
    waitDismissP.current = undefined;
  }, []);
  const waitDismiss = useCallback(
    (resolver: () => void) => {
      waitDismissP.current = resolver;
      waitDismissT.current = setTimeout(completeDismiss, TIMEOUT);
    },
    [completeDismiss]
  );

  const update = useUpdate();

  const taskQueue = useRef<DialogTask[]>([]);
  const workingTask = useRef<DialogTask>();
  const visibleState = useRef(false);

  const isWorking = () => Boolean(workingTask.current);

  const updateToShow = useCallback(() => {
    visibleState.current = true;
    update();
  }, [update]);

  const updateToHide = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      visibleState.current = false;
      update();
      waitDismiss(resolve);
    });
  }, [update, waitDismiss]);

  const shiftTask = useCallback(() => {
    completeDismiss();
    const job = taskQueue.current.shift();
    if (job) {
      workingTask.current = job;
      updateToShow();
    } else {
      workingTask.current = undefined;
    }
  }, [completeDismiss, updateToShow]);

  const createTask =
    <T extends DialogTask['type']>(type: T) =>
    (props: DialogPropsT<T>) => {
      const jobItem = { type, props } as DialogTask;
      if (isWorking()) taskQueue.current.push(jobItem);
      else {
        workingTask.current = jobItem;
        updateToShow();
      }
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openAlert = useCallback(createTask('Alert'), [isWorking, updateToShow]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openMenu = useCallback(createTask('ActionMenu'), [
    isWorking,
    updateToShow,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openPrompt = useCallback(createTask('Prompt'), [
    isWorking,
    updateToShow,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openSheet = useCallback(createTask('BottomSheet'), [
    isWorking,
    updateToShow,
  ]);

  return (
    <AlertContext.Provider value={{ openAlert }}>
      <ActionMenuContext.Provider value={{ openMenu }}>
        <PromptContext.Provider value={{ openPrompt }}>
          <BottomSheetContext.Provider value={{ openSheet }}>
            {children}
            {workingTask.current?.type === 'ActionMenu' && (
              <ActionMenu
                onHide={updateToHide}
                onDismiss={shiftTask}
                visible={visibleState.current}
                title={workingTask.current.props.title}
                menuItems={workingTask.current.props.menuItems}
              />
            )}
            {workingTask.current?.type === 'Alert' && (
              <Alert
                onHide={updateToHide}
                onDismiss={shiftTask}
                visible={visibleState.current}
                title={workingTask.current.props.title}
                message={workingTask.current.props.message}
                buttons={
                  workingTask.current.props.buttons ?? [
                    { text: defaultLabels?.alert?.ok || 'OK' },
                  ]
                }
              />
            )}
            {workingTask.current?.type === 'Prompt' && (
              <Prompt
                onHide={updateToHide}
                onDismiss={shiftTask}
                visible={visibleState.current}
                title={workingTask.current.props.title}
                onSubmit={workingTask.current.props.onSubmit}
                defaultValue={workingTask.current.props.defaultValue}
                submitLabel={
                  workingTask.current.props.submitLabel ??
                  defaultLabels?.prompt?.ok
                }
                cancelLabel={
                  workingTask.current.props.cancelLabel ??
                  defaultLabels?.prompt?.cancel
                }
                placeholder={
                  workingTask.current.props.placeholder ??
                  defaultLabels?.prompt?.placeholder
                }
              />
            )}
            {workingTask.current?.type === 'BottomSheet' && (
              <BottomSheet
                onHide={updateToHide}
                onDismiss={shiftTask}
                visible={visibleState.current}
                sheetItems={workingTask.current.props.sheetItems}
              />
            )}
          </BottomSheetContext.Provider>
        </PromptContext.Provider>
      </ActionMenuContext.Provider>
    </AlertContext.Provider>
  );
};

export const useActionMenu = () => {
  const context = useContext(ActionMenuContext);
  if (!context)
    throw new Error(`${ActionMenuContext.displayName} is not provided`);
  return context;
};
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error(`${AlertContext.displayName} is not provided`);
  return context;
};
export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) throw new Error(`${PromptContext.displayName} is not provided`);
  return context;
};
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context)
    throw new Error(`${BottomSheetContext.displayName} is not provided`);
  return context;
};
