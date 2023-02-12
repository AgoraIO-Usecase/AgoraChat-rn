import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';

import HomeHeaderTitle from '../components/HomeHeaderTitle';
import TabBarIcon from '../components/TabBarIcon';
import type { RootParamsList } from '../routes';
import ContactList from './ContactList';
import GroupList from './GroupList';
import RequestList from './RequestList';

const Contact = createMaterialTopTabNavigator<RootParamsList>();

export default function ContactScreen({
  navigation,
}: MaterialBottomTabScreenProps<ParamListBase, 'Contact'>): JSX.Element {
  // console.log('test:ContactScreen:', route, navigation);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        headerBackVisible: false,
        headerRight: undefined,
        headerTitle: () => <HomeHeaderTitle name="Contacts" />,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Contact.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarIndicatorStyle: {backgroundColor: 'red'},
        // tabBarActiveTintColor: 'red',
        // tabBarInactiveTintColor: 'blue',
        // tabBarBounces: false,
        // tabBarIconStyle: {backgroundColor: 'red', borderColor: 'blue'},
        // tabBarContentContainerStyle: { borderColor: 'blue'},
        // tabBarStyle: {shadowColor: 'red'},
        // tabBarIndicatorContainerStyle: {shadowColor: 'blue'}
        tabBarBadge: () => (
          <View style={{ top: 14, right: 20 }}>
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: '#FF14CC',
                borderRadius: 9,
              }}
            />
          </View>
        ),
        // tabBarLabelStyle: { borderColor: 'red' },
        // tabBarItemStyle: { height: 40 },
        // tabBarStyle: { borderColor: 'red', backgroundColor: 'blue' },
      }}
    >
      <Contact.Screen
        name="ContactList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="TopContacts" />
          ),
        }}
        initialParams={{ params: { type: 'contact_list' } }}
        component={ContactList}
      />
      <Contact.Screen
        name="GroupList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="TopGroups" />
          ),
        }}
        component={GroupList}
      />
      <Contact.Screen
        name="RequestList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="TopRequestList" />
          ),
        }}
        component={RequestList}
      />
    </Contact.Navigator>
  );
}
