import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { hp } from '../utils/Helper'
import SectionView, { OrderView } from './SectionView'
import { filter } from "../utils/Filter";
import Colors from '../utils/Colors'
import Animated, { FadeInDown } from 'react-native-reanimated'

const FiltersModel = ({ filterRef, filters, setFilter, onClose, onApply, onReset }) => {
    const snapPoints = useMemo(() => ['75%'], []);
    return (
        <BottomSheetModal
            ref={filterRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={backDrop}
        >
            <BottomSheetView>
                <View style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    gap: 20,
                }}>
                    <Text style={{ fontFamily: 'bold', fontSize: 35, marginTop: 10, marginBottom: 5 }}>Filter</Text>
                    {
                        Object.keys(section).map((sectionName, index) => {
                            const sectionData = filter[sectionName];
                            let sectionView = section[sectionName];
                            return (
                                <Animated.View key={sectionName} entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}>
                                    <SectionView
                                        title={sectionName}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilter,
                                            filterName: sectionName,
                                        })}
                                    />
                                </Animated.View>
                            )
                        })
                    }
                    <Animated.View
                        entering={FadeInDown.delay(500).springify().damping(11)}
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            gap: 20,
                            marginTop: 40,

                        }}>
                        <TouchableOpacity
                            onPress={() => onReset()}
                            style={{
                                backgroundColor: Colors.white,
                                width: '48%',
                                alignItems: 'center',
                                paddingVertical: 10,
                                borderRadius: 10,
                                borderWidth: 1,
                            }}>
                            <Text style={{ fontFamily: 'med', fontSize: 20 }}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onApply()}
                            style={{
                                backgroundColor: Colors.primary,
                                width: '48%',
                                alignItems: 'center',
                                paddingVertical: 10,
                                borderRadius: 10
                            }}>
                            <Text style={{ fontFamily: 'med', color: Colors.white, fontSize: 20 }}>Apply</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const section = {
    "order": (props) => <OrderView {...props} />,
    "orientation": (props) => <OrderView {...props} />,
    "type": (props) => <OrderView {...props} />,
    "colors": (props) => <OrderView {...props} />
}

const backDrop = ({ animatedIndex, style }) => {
    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        {
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
    ];
    return (
        <View style={containerStyle}>
            <BlurView style={StyleSheet.absoluteFill} tint='dark' intensity={25} />
        </View>
    )
}

export default FiltersModel