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

export function ContentStateContextProvider(props: ContentStateContextProps) {
  const { children } = props;
  const [opacity, setOpacity] = React.useState(0);
  const [content, setContent] = React.useState(props.content);
  const ContentStateMemo = React.memo((content?: ContentStateProps) => (
    <ContentState container={[content?.container, { opacity: opacity }]}>
      {content?.children}
    </ContentState>
  ));
  return (
    <ContentStateContext.Provider
      value={{
        showState: (props) => {
          console.log('test:444:');
          setOpacity(1);
          if (props?.children) {
            console.log('test:333:');
            setContent(props);
          }
        },
        hideState: () => {
          console.log('test:555:');
          setOpacity(0);
        },
      }}
    >
      {children}
      <ContentStateMemo container={content?.container}>
        {content?.children}
      </ContentStateMemo>
    </ContentStateContext.Provider>
  );
}

export function useContentStateContext(): VoiceStateContextType {
  const context = React.useContext(ContentStateContext);
  if (!context)
    throw new Error(`${ContentStateContext.displayName} is not provided`);
  return context;
}
