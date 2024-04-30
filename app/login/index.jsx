import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { hp, wp } from '@/utils/Helper'
import { LinearGradient } from 'expo-linear-gradient'
import Animated from 'react-native-reanimated'
import { FadeInDown } from 'react-native-reanimated'
import Colors from '@/utils/Colors'
import { useRouter } from 'expo-router'
import { client } from '../../utils/KindeConfig';
import services from '../../utils/Services';

const index = () => {
    const route = useRouter();
    const handleSignin = async () => {
        const token = await client.login();
        if (token) {
            await services.storeData('login', 'true');
            route.replace("/");
        }
    }
    return (
        <View style={{
            flex: 1,
        }}>
            <StatusBar barStyle={'dark-content'} />
            <Image
                source={require("../../assets/images/cover_mob.png")}
                style={{
                    width: wp(100),
                    height: hp(100),
                    position: 'absolute',
                }}
                resizeMode='cover'
            />
            <Animated.View entering={FadeInDown.duration(600)} style={{
                flex: 1
            }}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
                    style={{
                        width: wp(100),
                        height: hp(65),
                        position: 'absolute',
                        bottom: 0,
                    }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.8 }}
                />
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 40,
                    gap: 15,
                }}>
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={{
                                width: 150,
                                height: 70,
                                marginBottom: 10,
                            }}
                            resizeMode='cover'
                        />
                    </Animated.View>
                    <Animated.Text style={{ fontSize: 18, fontFamily: 'bold', color: Colors.black }} entering={FadeInDown.delay(400).springify()}>Your Vision, Our Library.</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <TouchableOpacity style={{
                            backgroundColor: Colors.primary,
                            paddingHorizontal: 60,
                            paddingVertical: 15,
                            borderRadius: 10,
                            marginTop: 10,
                            marginBottom: 20
                        }}
                            onPress={handleSignin}
                        >
                            <Text style={{ fontFamily: 'bold', color: Colors.white, fontSize: 20 }}>Get Started</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    )
}

export default index
