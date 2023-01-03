import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import {
  createStringSetEn,
  createStringSetFEn,
  messageTimestamp,
  seqId,
  timestamp,
  truncateContent,
  truncatedBadgeCount,
  uuid,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

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
    </View>
  );
}
