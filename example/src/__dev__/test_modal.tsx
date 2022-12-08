import React, { useState } from 'react';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [changeModalType, setChangeModalType] = useState(false);
  return (
    <View style={styles.centeredView}>
      {changeModalType ? (
        // 动画导致快速点击关闭按钮无响应 将 slide 替换为 none
        <RNModal
          animationType="slide"
          transparent
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
          visible={modalVisible}
          backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
          onClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
