import { Redirect } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import * as ScreenCapture from "expo-screen-capture";

export default function Index() {
  LogBox.ignoreAllLogs();

  useEffect(() => {
    (async () => {
      await ScreenCapture.allowScreenCaptureAsync();
    })();
  }, []);
  return <Redirect href="/(auth)/welcome" />;
}
