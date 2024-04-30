import { View, Text, Pressable, ScrollView, TextInput, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../utils/Colors';
import { hp, wp } from '../utils/Helper';
import Categories from "../components/Categories";
import { apiCall } from '../api';
import ImagesGrid from '../components/ImagesGrid';
import { useCallback } from 'react';
import { debounce } from 'lodash';
import FiltersModel from '../components/FiltersModel';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Services from '@/utils/Services'
import { client } from '@/utils/KindeConfig';
import 'dotenv/config';
require('dotenv').config();

var page = 1;

const Index = () => {
    const { top } = useSafeAreaInsets();
    const notchArea = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [filter, setFilter] = useState(null);
    const [images, setImages] = useState([]);
    const inputRef = useRef();
    const filterRef = useRef(null);
    const scrollRef = useRef(null);
    const [isEnd, setIsEnd] = useState(false);
    const [user, setUser] = useState('');
    const [expandMenu, setExpandMenu] = useState(false);
    const route = useRouter();

    const checkUserAuth = async () => {
        const result = await Services.getData("login");
        if (result !== 'true') {
            route.replace('/login');
        }
    }

    useEffect(() => {
        getUserDetails();
        checkUserAuth();
        fetchImages();
    }, []);

    const handleLogout = async () => {
        const logout = await client.logout();
        if (logout) {
            await Services.storeData('login', 'false');
            route.replace("/login");
        }
    }

    const fetchImages = async (params = { page: 1 }, append = true) => {
        let res = await apiCall(params);
        if (res.success && res?.data?.hits) {
            if (append) {
                setImages([...images, ...res.data.hits])
            } else {
                setImages([...res.data.hits])
            }
        }
    }

    const handleAciveCategory = (active) => {
        setActiveCategory(active);
        clearSearch();
        setImages([]);
        page = 1;
        let params = {
            page,
            ...filter,
        }
        if (active) params.category = active;
        fetchImages(params, false);
    }

    const handleSearch = (text) => {
        setSearch(text);
        if (text.length > 2) {
            page = 1;
            setImages([]);
            setActiveCategory(null);
            fetchImages({ page, q: text, ...filter }, false);
        }
        if (text == '') {
            page = 1;
            setActiveCategory(null);
            inputRef?.current?.clear();
            setImages([])
            fetchImages({ page }, false)
        }
    }

    const clearSearch = () => {
        setSearch("");
        inputRef?.current?.clear();
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    const handleOpenFilter = () => filterRef?.current?.present();
    const handleCloseFilter = () => filterRef?.current?.close();

    const applyFilter = () => {
        if (filter) {
            page = 1;
            setImages([]);
            let params = {
                page,
                ...filter
            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false);
        }
        handleCloseFilter();
    }

    const resetFilter = () => {
        if (filter) {
            page = 1;
            setFilter(null);
            setImages([]);
            let params = {
                page,
            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false);
        }
        handleCloseFilter();
    }

    const handleScroll = (event) => {
        setExpandMenu(false)
        const contentHeight = event.nativeEvent.contentSize.height;
        const srollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scollOffset = event.nativeEvent.contentOffset.y;
        const bottomPosition = contentHeight - srollViewHeight;

        if (scollOffset >= bottomPosition - 1) {
            if (!isEnd) {
                setIsEnd(true);
                ++page;
                let params = {
                    page,
                    ...filter,
                }
                if (activeCategory) params.category = activeCategory;
                if (search) params.q = search;
                fetchImages(params);
            }
        } else if (isEnd) {
            setIsEnd(false);
        }
    }

    const scrollToTop = () => {
        scrollRef?.current?.scrollTo({
            y: 0,
            animated: true,
        })
    }

    const getUserDetails = async () => {
        const user = await client.getUserDetails();
        setUser(user);
    }

    const generateProfilePic = () => {
        if (user && user.picture) {
            return <TouchableOpacity style={{ position: 'relative', zIndex: 1000, }} onPress={() => setExpandMenu(v => !v)}>
                <Image source={{ uri: user.picture }} style={{ width: 40, height: 40, borderRadius: 25, }} />
                {expandMenu &&
                    <Text style={{
                        position: 'absolute',
                        top: 20,
                        borderColor: Colors.gray,
                        borderWidth: 1,
                        borderRadius: 5,
                        right: 60,
                        width: 100,
                        backgroundColor: 'white',
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        textAlign: 'center',
                        fontFamily: 'med',
                    }} onPress={() => handleLogout()}>Logout</Text>
                }
            </TouchableOpacity>
        } else if (user && user.given_name) {
            const firstLetter = user.given_name.charAt(0).toUpperCase();
            return (
                <View style={[styles.profilePic, styles.initialCircle]}>
                    <Text style={styles.initialText}>{firstLetter}</Text>
                </View>
            );
        } else {
            return null;
        }
    };

    const clearOnlyFilter = (key) => {
        let filterz = { ...filter };
        delete filterz[key];
        setFilter({ ...filterz });
        page = 1;
        setImages([]);
        let params = {
            page,
            ...filterz
        }
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);
    }

    return (
        <View style={{ paddingTop: notchArea, flex: 1 }}>
            <StatusBar barStyle={'default'} />
            {/* Header  */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                <Pressable style={{}} onPress={scrollToTop}>
                    <Image
                        source={require("../assets/images/logo.png")}
                        style={{
                            width: 80,
                            height: 40,
                            marginBottom: 10,
                        }}
                    />
                </Pressable>
                <View style={{ flexDirection: 'row', gap: 20, marginTop: -10 }}>
                    <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} onPress={handleOpenFilter}>
                        <FontAwesome6 name="bars-staggered" size={24} color={Colors.black} />
                    </Pressable>
                    {generateProfilePic()}
                </View>
            </View>
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={5}
                contentContainerStyle={{ gap: 5 }}
                ref={scrollRef}
            >
                {/* Search Bar Area  */}
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    justifyContent: 'space-between',
                    borderColor: Colors.gray,
                    backgroundColor: Colors.white,
                    borderRadius: 10,
                    paddingHorizontal: 7,
                    paddingVertical: 10,
                    marginTop: 20
                }}>
                    <Pressable style={{ alignItems: 'center', paddingRight: 10, justifyContent: 'center' }}><AntDesign name="search1" size={hp(2.5)} color={Colors.gray} /></Pressable>
                    <TextInput
                        placeholder='Search For Photo!'
                        placeholderTextColor={Colors.gray}
                        style={{ flex: 1, color: Colors.black, fontFamily: 'med' }}
                        onChangeText={handleTextDebounce}
                        ref={inputRef}
                    />
                    {
                        search !== '' && (<Pressable onPress={() => handleSearch('')}><AntDesign name="close" size={hp(2.5)} color={Colors.gray} /></Pressable>)
                    }
                </View>
                <View style={{
                    marginTop: 20,
                    paddingHorizontal: 15
                }}>
                    <Categories activeCategory={activeCategory} handleAciveCategory={handleAciveCategory} />
                </View>
                {
                    filter && (
                        <View>
                            <ScrollView horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingHorizontal: 15,
                                    gap: 15,
                                    paddingTop: 15,
                                }}
                            >
                                {
                                    Object.keys(filter).map((key, ind) => {
                                        return (
                                            <View
                                                key={ind}
                                                style={{
                                                    paddingHorizontal: 10,
                                                    backgroundColor: Colors.primary,
                                                    flexDirection: 'row',
                                                    paddingVertical: 5,
                                                    borderRadius: 10,
                                                    gap: 7,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {
                                                    key=='colors' ? (
                                                        <View style={{
                                                            height: 15,
                                                            width: 20,
                                                            backgroundColor: filter[key],
                                                            borderRadius: 10,
                                                        }}></View>
                                                    ) : (
                                                        <Text style={{ color: Colors.white, textTransform: 'capitalize', fontFamily: 'med' }}>{filter[key]}</Text>
                                                    )
                                                }
                                                <Pressable style={{}} onPress={() => clearOnlyFilter(key)}>
                                                    <AntDesign name="close" size={14} color={Colors.white} />
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }

                {/* image grid  */}
                <View style={{
                    marginTop: 10,
                }}>
                    {
                        images.length > 0 && <ImagesGrid images={images} route={route} />
                    }
                </View>
                {/* loading  */}
                <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
                    <ActivityIndicator size='large' />
                </View>
            </ScrollView>
            <FiltersModel filterRef={filterRef} filters={filter} setFilter={setFilter} onClose={handleCloseFilter} onApply={applyFilter} onReset={resetFilter} />
        </View>
    );
}

export default Index;
