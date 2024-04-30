import axios from "axios";

const api_key = `43616102-a64de1c153d627998ff3ca121`;

const apiURL = `https://pixabay.com/api/?key=${api_key}`

const formatURL = (params) => {
    let url = apiURL + '&per_page=25&safesearch=true&editors_choice=true'
    if (!params) return url;
    let paramKey = Object.keys(params);
    paramKey.map(key => {
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });
    return url;
}

export const apiCall = async (params) => {
    try {
        const res = await axios.get(formatURL(params));
        const { data } = res;
        return { success: true, data };
    }catch (err) {
        console.log(err);
        return{success:false, msg: err.message};
    }
}