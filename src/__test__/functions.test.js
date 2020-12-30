import {postData} from '../client/js/formHandler';

describe("Testing functions",()=>{

    //before star this test it is necessaire run in the terminal node src/server/index.js
    //after it is necessaire open another terminal and npm run test
    test('Testing postData function', ()=>{
        return postData('http://localhost:8081/searchText', {text:"test"})
        .then(data=>{          
            expect(data.status.msg).toEqual('OK');
        });                   
    });

});