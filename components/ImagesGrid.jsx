import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MasonryFlashList } from '@shopify/flash-list'
import ImageCard from './ImageCard'
import { getColumnCount, wp } from '../utils/Helper'

const ImagesGrid = ({images, route}) => {
    const column = getColumnCount();
    return (
        <View style={{ minHeight: 100, width: wp(100) }}>
            <MasonryFlashList
                data={images}
                initialNumToRender={1000}
                contentContainerStyle={styles.container}
                numColumns={column}
                renderItem={({ item, index }) => <ImageCard route= {route} item={item} column={column} index={index} />}
                estimatedItemSize={200}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
    }
})

export default ImagesGrid
