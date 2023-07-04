import * as React from 'react';

import ContentState from '../components/ContentState';
import type { ContentStateProps } from '../types';
import type { VoiceStateContextType } from './types';

const ContentStateContext = React.createContext<VoiceStateContextType | null>(
  null
);
ContentStateContext.displayName = 'IMUIKitContentStateContext';

type ContentStateContextProps = React.PropsWithChildren<{
  content?: ContentStateProps;
}>;

const ContentStateMemo = React.memo(
  ({
    display,
    container,
    pointerEvents,
    children,
  }: ContentStateProps & { display: 'none' | 'flex' | undefined }) => (
    <ContentState
      container={[container, { display }]}
      pointerEvents={pointerEvents}
    >
      {children}
    </ContentState>
  )
);

export function ContentStateContextProvider(props: ContentStateContextProps) {
  const { children } = props;
  // const [opacity, setOpacity] = React.useState(0);
  const [display, setDisplay] = React.useState<'none' | 'flex' | undefined>(
    'none'
  );
  // const [backfaceVisibility, setBackfaceVisibility] = React.useState<
  //   'visible' | 'hidden' | undefined
  // >('hidden');
  const [content, setContent] = React.useState(props.content);

  return (
    <ContentStateContext.Provider
      value={{
        showState: (props) => {
          // setOpacity(1);
          // setBackfaceVisibility('visible');
          setDisplay('flex');
          if (props?.children) {
            setContent(props);
          }
        },
        hideState: () => {
          // setOpacity(0);
          // setBackfaceVisibility('hidden');
          setContent(undefined);
          setDisplay('none');
        },
      }}
    >
      {children}
      <ContentStateMemo
        container={content?.container}
        pointerEvents={content?.pointerEvents}
        display={display}
      >
        {content?.children}
      </ContentStateMemo>
    </ContentStateContext.Provider>
  );
}

/**
 * Show and hide custom components. Showing and hiding of this component is not affected by page responsiveness. Typical application scenarios: recording voice messages and displaying voice components.
 */
export function useContentStateContext(): VoiceStateContextType {
  const context = React.useContext(ContentStateContext);
  if (!context)
    throw new Error(`${ContentStateContext.displayName} is not provided`);
  return context;
}
