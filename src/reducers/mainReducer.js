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

                try {
                    for (let keyOfJsonObj in jsonObj) {
                        if (keyOfJsonObj !== 'sort_by') {
                            objectsForAnalysis = objectsForAnalysis.filter(objectForAnalysis => {
                                let arrayOfConditions = jsonObj[keyOfJsonObj];
                                let keysOfConditions = [];
                                let valuesOfConditions = [];

                                for (let i in arrayOfConditions) {
                                    keysOfConditions.push(Object.keys(arrayOfConditions[i])[0]);
                                    valuesOfConditions.push(Object.values(arrayOfConditions[i])[0]);
                                }

                                return keysOfConditions.every((key, index) => newState.functions[keyOfJsonObj](objectForAnalysis, key, valuesOfConditions[index]));
                            });
                        }
                    }

                    objectsForAnalysis.sort((a, b) => {
                        return a[jsonObj.sort_by] > b[jsonObj.sort_by] ? -1 : 1;
                    });

                    newState.result = objectsForAnalysis;
                } catch (err) {
                    alert('Error');
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