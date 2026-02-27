import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb", // blue-600
        tabBarInactiveTintColor: "#9ca3af", // gray-400
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "home" : "home"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user" : "user-o"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
