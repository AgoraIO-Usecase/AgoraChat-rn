import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { ParamListBase } from '@react-navigation/native';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import type { RootParamsList } from '../routes';
import ContactList from './ContactList';
import GroupList from './GroupList';
import RequestList from './RequestList';

const Contact = createMaterialTopTabNavigator<RootParamsList>();

export default function ContactScreen({
  navigation,
  route,
}: MaterialBottomTabScreenProps<ParamListBase, 'Contact'>): JSX.Element {
  console.log('test:ContactScreen:', route, navigation);
  return (
    <Contact.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarLabelStyle: { fontSize: 12 },
        // tabBarItemStyle: { height: 40 },
        // tabBarStyle: { backgroundColor: 'powderblue' },
      }}
    >
      <Contact.Screen
        name="ContactList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="TopContacts" />
          ),
        }}
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
