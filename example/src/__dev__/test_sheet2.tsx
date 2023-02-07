import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { useBottomSheet, useManualCloseDialog } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TestSheet() {
  const [icon, setIcon] = React.useState(false);
  const { manualClose } = useManualCloseDialog();
  const sheet = useBottomSheet();

  React.useEffect(() => {}, []);

  return (
    <SafeAreaProvider>
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
            title="test open sheet"
            onPress={() => {
              sheet.openSheet({
                sheetItems: [
                  {
                    key: '1',
                    Custom: (
                      <Button
                        onPress={() => {
                          manualClose();
                          // DeviceEventEmitter.emit(CustomEvents.closeDialog.key);
                        }}
                      >
                        click me
                      </Button>
                    ),
                  },
                ],
              });
            }}
          >
            test open sheet
          </RNButton>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
