import React from 'react'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const _layout = () => {
  const [fontsLoaded] = useFonts({
    reg: require('../assets/fonts/DMSans-Regular.ttf'),
    med: require('../assets/fonts/DMSans-Medium.ttf'),
    bold: require('../assets/fonts/DMSans-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='login/index' options={{ headerShown: false }} />
          <Stack.Screen name='image' options={{ headerShown: false, presentation: 'transparentModal', animation:'fade' }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default _layout