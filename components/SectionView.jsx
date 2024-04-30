import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Colors from '../utils/Colors'

const SectionView = ({ title, content }) => {
  return (
    <View style={styles.container}>
      <Text style={{
        fontFamily: 'bold',
        fontSize: 20,
        textTransform: 'capitalize',
        color: Colors.black,
        marginBottom: 10,
      }}>{title}</Text>
      {content}
    </View>
  )
}

export const OrderView = ({ data, filters, setFilter, filterName }) => {
  const ignoreColors = ['grayscale', 'transparent', 'lilac', 'white'];
  const onSelect = (item) => {
    setFilter({ ...filters, [filterName]: item })
  }
  return (
    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
      {
        data && data.map((item, ind) => {
          if (filterName === 'colors' && ignoreColors.includes(item)) {
            return null;
          }
          let isActive = filters && filters[filterName] == item;
          return filterName == 'colors' ? (
            <Pressable
              key={ind}
              style={{
                borderColor: Colors.gray,
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: isActive ? Colors.black : 'white',
                backgroundColor: item
              }}
              onPress={() => onSelect(item)}
            >
            </Pressable>
          ) : (
            <Pressable
              key={ind}
              style={{
                borderColor: Colors.gray,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                backgroundColor: isActive ? Colors.primary : 'white',
              }}
              onPress={() => onSelect(item)}
            >
              <Text
                style={{
                  textTransform: 'capitalize',
                  color: isActive ? 'white' : Colors.black,
                  fontFamily: 'med'
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    color: Colors.black,
  },
  title: {
    fontFamily: 'med',
    fontSize: 25,
    textTransform: 'capitalize',
  }
})

export default SectionView;
