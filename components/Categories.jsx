import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Category from '../utils/Data';
import { TouchableOpacity } from 'react-native';
import Colors from '../utils/Colors';
import Animated, { FadeInRight } from 'react-native-reanimated';

const Categories = ({ activeCategory, handleAciveCategory }) => {
    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                gap: 10,
            }}
            data={Category.Category}
            keyExtractor={item => item}
            renderItem={({ item, index }) =>
                <FilterItem title={item} index={index} isActive={activeCategory == item} handleAciveCategory={handleAciveCategory} />
            }
        />
    );
};

const FilterItem = ({ title, index, handleAciveCategory, isActive }) => {
    return (
        <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
            <TouchableOpacity
                onPress={() => handleAciveCategory(isActive ? null : title)}
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: Colors.gray,
                    borderRadius: 10,
                    color: isActive ? Colors.white : Colors.black,
                    backgroundColor: isActive ? Colors.primary : Colors.white,
                }}>
                <Text style={{ fontFamily: 'med', fontSize: 14, color: isActive ? Colors.white : Colors.black, textTransform: 'capitalize' }}>{
                    title}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};


export default Categories;
