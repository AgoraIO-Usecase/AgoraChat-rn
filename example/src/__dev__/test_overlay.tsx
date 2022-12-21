import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, LocalIcon } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

const MutedOverlay = ({ size }: { size: number }) => {
  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'transparent', opacity: 0.9 },
        ]}
      />
      <LocalIcon color="red" name="alert_default" size={size * 0.72} />
    </View>
  );
};

export default function TestIcon() {
  const [icon, setIcon] = React.useState(true);
  const [loadFailure, setLoadFailure] = React.useState(false);
  const url = 'http://pic1.16xx8.com/allimg/170303/jc09967_02.jpg';

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100, backgroundColor: 'green', flex: 1 }}>
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
      <View
        style={{
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LocalIcon name="alert_success" color="orange" size={50} />
        {!loadFailure && (
          <Image
            source={{ uri: url }}
            onLoad={() => {
              console.log('test:onload');
            }}
            onError={() => {
              console.log('test:error');
              setLoadFailure(true);
            }}
            resizeMode="cover"
            style={[StyleSheet.absoluteFill, { borderRadius: 25 }]}
          />
        )}
        <MutedOverlay size={30} />
      </View>
    </View>
  );
}
