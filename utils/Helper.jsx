import { Dimensions } from "react-native";

const {width, height} = Dimensions.get('window');

export const wp = (percentage) => {
    return (percentage*width)/100;
}

export const hp = (percentage) => {
    return (percentage*height)/100;
}

export const getColumnCount = () => {
    if(width >=1024){
        return 4
    }else if(width >= 768){
        return 3
    }else{
        return 2;
    }
}

export const getImageSize = (height, width) => {
    if(width>height){
        return 250;
    }else if(height>width){
        return 300;
    }else{
        return 200
    }
}