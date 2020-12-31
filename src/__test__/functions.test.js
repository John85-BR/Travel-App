import {postData, returnIndex} from '../client/js/formHandler';

describe("Testing functions",()=>{

    //before star this test it is necessaire run in the terminal node src/server/index.js
    //after it is necessaire open another terminal and npm run test
    test('Testing postData function', ()=>{
        return postData('http://localhost:8081/post_pixabay', {textContent:"yellow+flowers"})
        .then(data=>{          
            expect(data.total).toBeGreaterThan(0);
        });                   
    });


    const str = "Test, test, test";
    test('Testing returnIndex', ()=>{                       
        expect(returnIndex(str)).toEqual(3);
   
    });


});