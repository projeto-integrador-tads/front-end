import { Tabs } from "expo-router";
import { colors } from "@/styles/shared/colors/colors";
import {
  IconHome,
  IconCar,
  IconMap,
  IconMessage,
  IconUser,
} from "@tabler/icons-react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary.normal.default,
        tabBarInactiveTintColor: colors.neutral.gray2,
        tabBarStyle: {
          backgroundColor: colors.neutral.white,
          borderTopColor: "transparent",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: colors.neutral.black,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <IconHome size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="offer/index"
        options={{
          title: "Oferecer",
          tabBarIcon: ({ color, size }) => <IconCar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips/index"
        options={{
          title: "Viagens",
          tabBarIcon: ({ color, size }) => <IconMap size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats/index"
        options={{
          title: "Conversas",
          tabBarIcon: ({ color, size }) => (
            <IconMessage size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <IconUser size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
