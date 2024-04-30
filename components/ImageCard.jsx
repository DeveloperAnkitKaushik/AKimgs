import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import {Image} from "expo-image"
import { hp, wp, getImageSize } from '../utils/Helper'
import Colors from '../utils/Colors'

const ImageCard = ({ item, index, column, route }) => {
    const isLastRow = () => {
        return (index + 1) % column === 0;
    }
    const getImageHeight = () => {
        let { imageHeight: height, imageWidth: width } = item;
        return { height: getImageSize(height, width) }
    }
    return (
        <Pressable style={[styles.container, !isLastRow() && styles.spacing]} onPress={() => route.push({pathname: 'image', params: {...item}})}>
            <Image
                source={{ uri: item?.webformatURL }}
                style={[styles.image, getImageHeight()]}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray,
        borderRadius: 20,
        marginBottom: wp(2),
        borderCurve: 'continuous',
        overflow: 'hidden',
    },
    spacing: {
        marginRight: 10,
    },
    image: {
        width: '100%',
        height: 300,
    },
})

export default ImageCard
