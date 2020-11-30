import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input, InputLabel, Button } from '@material-ui/core';

import { convert } from './reducers/mainReducer';

import './App.css';

const App = ({ store }) => {
    const [json1, setJSON1] = useState(undefined);
    const [json2, setJSON2] = useState(undefined);
    const [result, setResult] = useState(undefined);
    const dispatch = useDispatch();

    const addJSON1 = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (function (JSONFile) {
            return function (e) {
                try {
                    setJSON1(JSON.parse(e.target.result));
                } catch (error) {
                    alert('Error');
                }
            }
        })(file);
        reader.readAsText(file);
        e.target.value = '';
    }

    const addJSON2 = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (function (JSONFile) {
            return function (e) {
                try {
                    setJSON2(JSON.parse(e.target.result));
                } catch (error) {
                    alert('Error');
                }
            }
        })(file);
        reader.readAsText(file);
        e.target.value = '';
    }

    const changeJSON = (e) => {
        dispatch(convert(json1, json2));
        setResult(JSON.stringify(store.getState().branch1.result, null, '\t'));
    }



    return (
        <div className='App'>
            <div className='wrapper'>
                <InputLabel>Add JSON to convert</InputLabel>
                <Input type='file' onChange={(e) => addJSON1(e)} />
            </div>
            <div className='wrapper'>
                <InputLabel>Add JSON-settings for sorting and filtering</InputLabel>
                <Input type='file' onChange={(e) => addJSON2(e)} />
            </div>
            <div className='wrapper'>
                <Button variant='contained' onClick={(e) => changeJSON(e)}>Change JSON</Button>
            </div>
            <div className='wrapper'>
                {result !== 'null' && result}
            </div>
        </div>
    );
}

export default App;
