let _ = require('lodash');

const CONVERT_JSON = 'CONVERT_JSON';

let initialState = {
    result: null,
    functions: {
        include: (item, key, value) => item[key] === value ? true : false,
        exclude: (item, key, value) => item[key] === value ? false : true
    }
};

const mainReducer = (state = initialState, action) => {
    let copyOfState;

    switch (action.type) {
        case CONVERT_JSON:
            {
                let newState = _.cloneDeep(state);
                let objectsForAnalysis = action.data[0].data;
                let jsonObj = action.data[1].condition;
                if (objectsForAnalysis.length !== 0) {
                    try {
                        for (let keyOfJsonObj in jsonObj) {

                            if (keyOfJsonObj !== 'sort_by') {
                                let arrayOfConditions = jsonObj[keyOfJsonObj];
                                if (arrayOfConditions.length === 0) continue;
                                let keysOfConditions = [];
                                let valuesOfConditions = [];

                                for (let i in arrayOfConditions) {
                                    keysOfConditions.push(...Object.keys(arrayOfConditions[i]));
                                    valuesOfConditions.push(...Object.values(arrayOfConditions[i]));
                                }

                                objectsForAnalysis = objectsForAnalysis.filter(objectForAnalysis => keysOfConditions.every((key, index) => newState.functions[keyOfJsonObj](objectForAnalysis, key, valuesOfConditions[index])));
                            }
                        }

                        let sorting = arr => {

                            arr.sort((a, b) => {
                                let counter = { value: 0 };

                                const isMore = (a, b, c) => {
                                    if (a[jsonObj.sort_by[c.value]] > b[jsonObj.sort_by[c.value]]) {
                                        return 1;
                                    } else if (a[jsonObj.sort_by[c.value]] < b[jsonObj.sort_by[c.value]]) {
                                        return -1;
                                    } else {
                                        c.value++;
                                        if (jsonObj.sort_by.length < c.value) return 1;
                                        return isMore(a, b, c);
                                    };
                                }

                                if (a[jsonObj.sort_by[counter.value]] > b[jsonObj.sort_by[counter.value]]) {
                                    return 1;
                                } else if (a[jsonObj.sort_by[counter.value]] < b[jsonObj.sort_by[counter.value]]) {
                                    return -1;
                                } else {
                                    counter.value++;
                                    if (jsonObj.sort_by.length < counter.value) return 1;
                                    return isMore(a, b, counter);
                                }
                            })
                        };

                        for (let i = 0; i < jsonObj.sort_by.length; ++i) {
                            sorting(objectsForAnalysis);
                        }

                        newState.result = objectsForAnalysis;
                    } catch (err) {
                        alert(err.message);
                    }
                }

                copyOfState = newState;
            }; return copyOfState;
        default: {
            return state;
        }
    }
}

export const convert = (json1, json2) => {
    return {
        type: CONVERT_JSON,
        data: [json1, json2]
    }
}

export default mainReducer;