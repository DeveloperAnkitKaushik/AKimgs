import { View, Text, Button, Platform, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import { hp, wp } from '../utils/Helper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../utils/Colors'
import Animated, { FadeInDown } from 'react-native-reanimated'
import * as FileSystem from 'expo-file-system';
import * as ExpoSharing from 'expo-sharing';
import Toast from 'react-native-toast-message'

const ImageScreen = () => {
  const route = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState('loading');
  let uri = item?.webformatURL;
  const fileName = item?.previewURL?.split('/').pop();
  const imageURL = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == 'web' ? wp(50) : wp(92);
    let calculateHeight = maxWidth / aspectRatio;
    let calculateWidth = maxWidth
    if (aspectRatio < 1) {
      calculateWidth = calculateHeight * aspectRatio;
    }
    return {
      width: calculateWidth,
      height: calculateHeight,
    }
  }

  const onLoad = () => {
    setStatus('');
  }

  const share = async () => {
    setStatus('sharing');
    let uri = await downloadImage();
    if (uri) {
      await ExpoSharing.shareAsync(uri);
    }
  }

  const downloadImage = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageURL, filePath);
      setStatus('');
      return uri;
    } catch (err) {
      setStatus('')
      Alert.alert('Error while Downloading');
      return null;
    }
  }

  const download = async () => {
    setStatus('downloading')
    let res = await downloadImage();
    if (res) {
      showToast('Downloaded Successfully!')
      setStatus('')
    }
  }

  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  }

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={{
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)'
      }}>
        <Text style={{ fontFamily: 'bold', fontSize: 15, color: Colors.white }}>{text1}</Text>
      </View>
    )
  }

  return (
    <BlurView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
      tint='dark'
      intensity={60}
    >
      {
        status == 'loading' && <ActivityIndicator size='large' color='white'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      }
      <View style={getSize()}>
        <Image
          transition={100}
          style={[{
            borderRadius: 10
          }, getSize()]}
          source={uri}
          onLoad={onLoad}
        />
      </View>
      <View>
        <View style={{
          flexDirection: 'row',
          gap: 50,
          marginTop: 40,
          alignItems: 'center',
        }}>
          <Animated.View entering={FadeInDown.delay(100).springify()} >
            <TouchableOpacity onPress={() => route.back()} style={{
              height: hp(6),
              width: hp(6),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 15,
            }}>
              <AntDesign name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
          {
            status == 'sharing' ? (
              <View style={{
                height: hp(6),
                width: hp(6),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 15,
              }}>
                <ActivityIndicator size='large' color='white' />
              </View>
            ) : (
              <Animated.View entering={FadeInDown.delay(300).springify()} >
                <TouchableOpacity onPress={() => share()} style={{
                  height: hp(6),
                  width: hp(6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 15,
                }}>
                  <AntDesign name="download" size={24} color={Colors.white} />
                </TouchableOpacity>
              </Animated.View>
            )
          }
        </View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView >
  )
}

export default ImageScreen
