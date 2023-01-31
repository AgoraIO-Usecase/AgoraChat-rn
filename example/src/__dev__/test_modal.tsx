import * as React from 'react';
import {
  Alert,
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Modal } from 'react-native-chat-uikit';

const App = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [changeModalType, setChangeModalType] = React.useState(false);
  const [transparent, setTransparent] = React.useState(false);
  const [disableBackgroundClose, setDisableBackgroundClose] =
    React.useState(false);
  return (
    <View style={styles.centeredView}>
      {changeModalType ? (
        // 动画导致快速点击关闭按钮无响应 将 slide 替换为 none
        <RNModal
          animationType="slide"
          transparent={transparent}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </RNModal>
      ) : (
        <Modal
          type="slide"
          transparent={transparent}
          backdropColor="rgba(100, 10, 200, 0.5)"
          visible={modalVisible}
          backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
          onRequestClose={(): Promise<void> => {
            console.log('test:onRequestClose:');
            return new Promise((resolve) => {
              console.log('test:setModalVisible:', resolve);
              setModalVisible(false);
              resolve();
            });
          }}
          disableBackgroundClose={disableBackgroundClose}
        >
          <FadeView fadeOpacity={0} />
          <View style={styles.modalView}>
            <Text style={styles.modalText}>My Modal</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      )}

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
          console.log('modalVisible', modalVisible);
        }}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton2}
        onPress={() => {
          setChangeModalType(!changeModalType);
          setModalVisible(false);
          console.log('changeModalType:', !changeModalType);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton3}
        onPress={() => {
          setTransparent(!transparent);
          console.log('setTransparent:', !transparent);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton4}
        onPress={() => {
          setDisableBackgroundClose(!disableBackgroundClose);
          console.log('disableBackgroundClose:', !disableBackgroundClose);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton2}
        onPress={() => {
          setChangeModalType(!changeModalType);
          setModalVisible(false);
          console.log('changeModalType:', !changeModalType);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton2}
        onPress={() => {
          setChangeModalType(!changeModalType);
          setModalVisible(false);
          console.log('changeModalType:', !changeModalType);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton2}
        onPress={() => {
          setChangeModalType(!changeModalType);
          setModalVisible(false);
          console.log('changeModalType:', !changeModalType);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.openButton2}
        onPress={() => {
          setChangeModalType(!changeModalType);
          setModalVisible(false);
          console.log('changeModalType:', !changeModalType);
        }}
      >
        <Text style={styles.textStyle}>Change Modal type</Text>
      </TouchableHighlight>
    </View>
  );
};

const FadeView: React.ComponentType<{ fadeOpacity: number }> = ({
  fadeOpacity,
}): JSX.Element => {
  return (
    <View
      style={{
        backgroundColor: 'rgba(233, 23, 23, 0.7)',
        opacity: fadeOpacity,
      }}
      pointerEvents="none"
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(233, 233, 23, 0.7)',
    // backgroundColor: '#a9a9a9',
    // opacity: 0.8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(255, 25, 255, 1)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // opacity: 1,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  openButton2: {
    backgroundColor: '#0194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  openButton4: {
    backgroundColor: '#01942F',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  openButton3: {
    backgroundColor: '#f234FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
