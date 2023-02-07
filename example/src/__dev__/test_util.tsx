import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import {
  createStringSetEn,
  createStringSetFEn,
  messageTimestamp,
  once,
  onceEx,
  seqId,
  timestamp,
  truncateContent,
  truncatedBadgeCount,
  uuid,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

function test1(): void {
  const map: Record<string, string> = {
    'ios.permission.MEDIA_LIBRARY': 'unavailable',
    'ios.permission.PHOTO_LIBRARY': 'granted',
  };
  // Object.values(map).every((value) => {
  //   console.log('test:1:', value);
  //   return true;
  // });

  Object.values(map).every((value, index, arr) => {
    let r = false;
    console.log('test:r:', value, map, index, arr);
    // if (value === 'granted') return true;
    // if (value === 'limited') {
    //   r = true;
    // }
    return r;
  });
}

let count1 = 0;
const o = once(function (c: number) {
  console.log('test:once:', c);
}, ++count1);
const o3 = onceEx((c: number) => {
  console.log('test:once:', c);
});
let count2 = 0;
const o2 = (c: number) => {
  console.log('test:once:', c);
};
function test2(): void {
  o();
}
function test3(): void {
  o2(++count2);
}
function test4(): void {
  o3(++count1);
}

export default function TestUtil() {
  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            const s2 = createStringSetFEn<{ xxx: { yyy: string } }>({
              xxx: { yyy: 'ls' },
            });
            console.log('test:createStringSetFEn:', s2);
            const s3 = createStringSetEn<{ zz: { name: string } }>({
              zz: { name: 'zs' },
            });
            console.log('test:createStringSetFEn:', s3);
          }}
        >
          createStringSetFEn
        </Button>
      </View>
      <View>
        <RNButton
          title="messageTimestamp"
          onPress={() => {
            console.log('test:messageTimestamp:', messageTimestamp(new Date()));
          }}
        >
          messageTimestamp
        </RNButton>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            console.log('test:truncatedBadgeCount:', truncatedBadgeCount(567));
          }}
        >
          truncatedBadgeCount
        </Button>
      </View>
      <View>
        <RNButton
          title="truncateContent"
          onPress={() => {
            console.log(
              'test:truncateContent:',
              truncateContent({
                content:
                  'jsldifjslekjfsoiejf;lseijf;soeifjs;elfijas;efiljas;elfijase;lfiasje;fliasjefl;asijefse;fijse;lfseijf;lisejf;laseifja;lseifj;asleifj',
              })
            );
          }}
        >
          truncateContent
        </RNButton>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            console.log('test:timestamp:', timestamp());
          }}
        >
          timestamp
        </Button>
      </View>
      <View>
        <RNButton
          title="seqId"
          onPress={() => {
            console.log('test:seqId:', seqId());
          }}
        >
          seqId
        </RNButton>
      </View>
      <View>
        <RNButton
          title="seqId:my"
          onPress={() => {
            console.log('test:seqId:my:', seqId('my'));
          }}
        >
          seqId
        </RNButton>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            console.log('test:uuid:', uuid());
          }}
        >
          uuid
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test1();
          }}
        >
          test1
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test2();
          }}
        >
          test_once
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test3();
          }}
        >
          test_once
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test4();
          }}
        >
          test_once
        </Button>
      </View>
    </View>
  );
}
