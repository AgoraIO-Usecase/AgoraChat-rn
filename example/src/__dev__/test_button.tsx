import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import {
  Button as UIButton,
  Loading,
  LoadingButton,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestButton() {
  const [icon, setIcon] = React.useState(true);
  const [content, setContent] = React.useState('');
  const [buttonState, setButtonState] = React.useState<'loading' | 'stop'>(
    'stop'
  );

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <RNButton
          title="change icon"
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        />
      </View>
      <View>
        <UIButton
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </UIButton>
      </View>
      <View>
        <UIButton
          style={{
            width: 200,
            height: 50,
            borderRadius: 25,
          }}
          icon={content.length === 0 ? 'loading' : undefined}
          onPress={() => {
            console.log(icon);
            setContent(content.length === 0 ? 'content' : '');
          }}
          children={content}
        />
      </View>
      <View>
        <UIButton
          style={{
            width: 200,
            height: 50,
            borderRadius: 25,
          }}
          onPress={() => {
            console.log(icon);
            setContent(content.length === 0 ? 'content' : '');
          }}
          children={content}
        />
        {content.length === 0 ? (
          <Loading
            style={{
              position: 'absolute',
              left: 50,
              top: 25,
            }}
            color="white"
          />
        ) : null}
      </View>
      <View style={{ width: 200 }}>
        <LoadingButton
          style={{ height: 48, borderRadius: 24 }}
          content="Login"
          state={buttonState}
          onChangeState={(state) => {
            setButtonState(state === 'loading' ? 'stop' : 'loading');
            setTimeout(() => {
              setButtonState('stop');
            }, 3000);
          }}
        />
      </View>
    </View>
  );
}
