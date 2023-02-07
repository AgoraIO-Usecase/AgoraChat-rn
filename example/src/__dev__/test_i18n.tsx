import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';
import * as React from 'react';
import { View } from 'react-native';
import {
  createStringSetEn2,
  createStringSetFEn2,
  UIKitStringSet2,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

// class s implements StringSetContextType {
//   xxx: { yyy: string; zzz: (a: Date) => string; sss: string };
//   ttt: { yyy: string };
//   uuu: { sss: string };
//   constructor(locate: Locale) {
//     this.xxx = {
//       yyy: 'zs',
//       zzz: (a) => messageTimestamp(a, locate),
//       sss: 'hh',
//     };
//     this.ttt = {
//       yyy: 'ls',
//     };
//     this.uuu = {
//       sss: 'll',
//     };
//   }
// }
class s2 extends UIKitStringSet2 {
  uuu: { sss: string };
  constructor(locate: Locale) {
    super(locate);
    this.uuu = {
      sss: 'll',
    };
  }
}

export default function TestI18n() {
  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            const s2 = createStringSetFEn2(new UIKitStringSet2(en));
            console.log('test:createStringSetFEn:', s2);
            const s3 = createStringSetEn2(new UIKitStringSet2(en));
            console.log('test:createStringSetFEn:', s3);
          }}
        >
          createStringSetFEn
        </Button>
      </View>
      {/* <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            const s2 = createStringSetFEn2(new s(en));
            console.log('test:createStringSetFEn:', s2);
            const s3 = createStringSetEn2(new s(en));
            console.log('test:createStringSetFEn:', s3);
          }}
        >
          createStringSetFEn2
        </Button>
      </View> */}
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            const s = createStringSetFEn2(new s2(en));
            console.log('test:createStringSetFEn:', s);
            const s3 = createStringSetEn2(new s2(en));
            console.log('test:createStringSetFEn:', s3);
          }}
        >
          createStringSetFEn2
        </Button>
      </View>
    </View>
  );
}
