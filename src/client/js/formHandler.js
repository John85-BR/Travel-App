const fetch = require("node-fetch");

/*
global variables
*/
let trip={
      trip_name:"",
      destination:[{
        address:"",            
        date:"",
        company:"",
        board_time:"",
        hotel_name:"",
        check_in:"",
        check_out:"",
        lodgind_info:"",
        packing_list:"",
        notes:"",
        date_table:"",
        temp_table:"",
        image:""  
        }] 
    };

const blankDestination={ address:"",
    date:"",
    company:"",
    board_time:"",
    hotel_name:"",
    check_in:"",
    check_out:"",
    lodgind_info:"",
    packing_list:"",
    notes:"",
    date_table:"",
    temp_table:"", 
    image:""  
};

let addTravel = document.getElementById("add_travel");
let myTravel = document.getElementById("trips");

//function that returns the the total number of words
function returnIndex(data){
  let results = 0;   

  if(data!=""){
    let temp = data.trim().split(",");    
    for(let item of temp){
      if(item!=""){
        ++results;
      }
    }
  }
    
  return results;
}

//function that returns the custom words
function configAddress(data){

  let str = data.replace(/[\[\]¨+\-.@º"§’#!?'$%^&*;:{}=\-–_><`´~()1234567890¹²³£¢¬ª|]/g,"").replace(/\s\s/g," ").replace(/,,/g,",");
    
  return str;
}

//event listener that controls the words entered in the address field
function getAddress(event){

  event.preventDefault();

  let tableHDate = event.target.parentElement.querySelector(".date_table");
  let tableHTemp = event.target.parentElement.querySelector(".temp_table");
  let address = event.target.parentElement.querySelector(".address");
  let imagem = event.target.parentElement.querySelector(".image"); 
    
  if(returnIndex(address.value)==3){

    let content=address.value.replace(/ /g,"+").replace(/,/g,"");  

    postData('http://localhost:8081/post_pixabay',{textContent:content})
    .then(data=>{                    
      if(parseInt(data.totalHits) > 0){        
        let str = data.hits[0].webformatURL;   
        trip.destination.image_url=str;                    
        imagem.style.backgroundImage = 'url('+str+')';

      }else{
        alert("No images available");
      }                
    });

  //makes a post to get the data from the APIs
  postData(`http://localhost:8081/post_geonames`,{textContent:address.value})
  .then(data=>{

    if(data.totalResultsCount>0){      
                 
      postData(`http://localhost:8081/post_wheatherbit`,{textContent:[data.geonames[0].lat,data.geonames[0].lng]})
      .then(tempData=>{

        let strTemp = `<th>Temp:</th>`;
        let strDate = `<th>Date:</th>`;

        for(let temp of tempData.data){
          strDate+=`<td>${temp.valid_date}</td>`;
          strTemp+=`<td>${temp.temp}</td>`;              
        }
        const index = event.target.parentElement.getAttribute("data-index");

        trip.destination[index].date_table = strDate;
        trip.destination[index].temp_table = strTemp;

        tableHDate.innerHTML=strDate;
        tableHTemp.innerHTML=strTemp;

        });         
      }
    });

  }else{
    alert("Insert the City, State and Country");
  }
}

//function that saves the data in the global variable "trip" when called
function saveData(){
    
  let form = document.getElementById("add_travel");
  let divsFather = form.getElementsByClassName("destinations_childs");        
  trip.trip_name = form.querySelector(".trip_name").value;

  for(let div of divsFather){
        
    let elementsInput = div.getElementsByTagName('input');
    let elementsTextarea = div.getElementsByTagName('textarea');
    let dateTable = div.querySelector('.date_table');
    let tempTable = div.querySelector('.temp_table');
    let image = div.querySelector('.image');

      //creates a temporary element to record the data
    let tempDestination={ address:"",
          date:"",
          company:"",
          board_time:"",
          hotel_name:"",
          check_in:"",
          check_out:"",
          lodgind_info:"",
          packing_list:"",
          notes:"",
          date_table:"",
          temp_table:"",
          image:""   
    };

    tempDestination[dateTable.className] = dateTable.innerHTML;
    tempDestination[tempTable.className] = tempTable.innerHTML;
    tempDestination[image.className] = image.style.backgroundImage;
        

    for(let element of elementsInput){          
      tempDestination[element.className] = element.value;         
                              
    }
    for(let textarea of elementsTextarea){
      tempDestination[textarea.className] = textarea.value;
      
    } 
    trip["destination"][div.getAttribute('data-index')]=tempDestination;
  }
    
}

//event listener that controls when a click occurred in the address field
function inputChanged(event){
  let imagem = event.target.parentElement.querySelector(".image");
  let address = event.target.parentElement.querySelector(".address");      

  if(event.target.className=="address" && event.target.value!=""){
    address.value = configAddress(address.value);
    imagem.style.backgroundImage="";
  }   
}
  
//function used explicitly to save data on the server
const getAPIData = async (url)=>{
  const res = await fetch(url);
  try {
    const data = await res.json();
    return data;
  }  catch(error) {
    // appropriately handle the error
    //alert the user
    alert('.');
  }
}

//event listener triggered when clicked on any of the tabs
function openOption(evt, option) {
  let i, tabcontent, tablinks;
  let saveTripButton = document.querySelector(".save_trip");
  let addDestButton = document.querySelector(".add_destination");

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(option).style.display = "block";
  evt.currentTarget.className += " active";

  //if click occurs in "Add or edit trip"
  if(evt.currentTarget.textContent=="Add or edit trip"){
      
      
    saveTripButton.style.display = "block";   
    addDestButton.style.display = "block";  

  }

  //if click occurs in "My travel planner"
  if(evt.currentTarget.textContent=="My travel planner"){
    saveTripButton.style.display = "none";
    addDestButton.style.display = "none";   
                                                                           
    myTravel.innerHTML="";
   
    //function used explicitly to save data on the server
    getAPIData('http://localhost:8081/get')
    .then(data=>{
      //function that serves to update the html of the "My travel planner" tab
      updateNewTrip(data);
    });        
  }   
}
//function that serves to update the html of the "My travel planner" tab
function updateNewTrip(data){
  for(let tripUnit of data){

    let tripName = document.createElement('div');     
    tripName.classList.add("trip_name");
    tripName.setAttribute("data-index",data.indexOf(tripUnit));     
    tripName.innerHTML = `<h1>${tripUnit.trip_name}</h1>`;
    myTravel.appendChild(tripName);    

    for(let destination of tripUnit.destination){
        
      let element = document.createElement('div');
      element.classList.add("destinations_childs");
      element.setAttribute("data-index",tripUnit.destination.indexOf(destination));              
      let imageUrl = destination.image;
      let newElement = `<p class = "destination_number">
          <strong>Destination ${tripUnit.destination.indexOf(destination)+1}</strong></p>
          <figure class = "image"></figure>
          <div class="address"><p><strong>Destination</strong></p><span>${destination.address}</span></div> 
          <div class="date"><p><strong>Date</strong></p><span>${destination.date}</span></div> 
          <div class="company"><p><strong>Company</strong></p><span>${destination.company}</span></div>            
          <div class="hotel_name"><p><strong>Hotel</strong></p><span>${destination.hotel_name}</span></div> 
          <div class="check_in"><p><strong>Check_in</strong></p><span>${destination.check_in}</span></div> 
          <div class="check_out"><p><strong>Check_out</strong></p><span>${destination.check_out}</span></div> 
          <div class="board_time"><p><strong>Board time</strong></p><span>${destination.board_time}</span></div>     
          <div class = "lodgind_info"><p><strong>Lodgind info</strong></p><span>${destination.lodgind_info}</span></div>
          <div class = "packing_list"><p><strong>Packing list</strong></p><span>${destination.packing_list}</span></div>
          <div class = "notes"><p><strong>Notes</strong></p><span>${destination.notes}</span></div>   
          <div class = "table_weather"><table><caption>Forecast wheather - 16 days</caption>                                                   
          <tr class = "date_table">${destination.date_table}</tr><tr class = "temp_table">${destination.temp_table}                                                                 
          </tr></table></div>`;                
      element.innerHTML=newElement; 
      let image = element.querySelector(".image");    
      image.style.backgroundImage = imageUrl;
      myTravel.appendChild(element);                    
    }           
  }
}
//when clicked on the '' add destination '' button, it adds a new item to be filled in the "Add or edit trip 'tab.
function addDestination(){
    
  let destination = document.createElement('div');
  destination.classList.add("destinations_childs"); 
  trip.destination.push(blankDestination);
  destination.setAttribute('data-index',trip.destination.length-1);
  let temp = parseInt(destination.getAttribute('data-index'))+1;

  let newDestination = `<button class = "search_location">Search</button> 
        <p class = "destination_number"><strong>Destination ${temp}</strong></p>                            
        <figure class = "image"></figure>  
        <input list = "autocomplete_places" class="address" type="text" name="input" placeholder="City, State, Country*">
        <datalist id="autocomplete_places">                           
        </datalist>
        <input class="date" type="text" name="input" placeholder="Date*" onfocus="(this.type='date')" onblur="(this.type='text')">
        <input class="company" type="text" name="input" placeholder="Flight or bus info*">              
        <input class="hotel_name" type="text" name="input" placeholder="Hotel name*"> 
        <input class="check_in" type="text" name="input" placeholder="Check in*" onfocus="(this.type='date')" onblur="(this.type='text')">
        <input class="check_out" type="text" name="input" placeholder="Check out*" onfocus="(this.type='date')" onblur="(this.type='text')">
        <input class="board_time" type="text" name="input" placeholder="Time*" onfocus="(this.type='time')" onblur="(this.type='text')">      
        <textarea class = "lodgind_info" type="text" name="textarea" placeholder="Lodgind info" rows="3" cols="33"></textarea>
        <textarea class = "packing_list" type="text" name="textarea" placeholder="Packing list" rows="3" cols="33"></textarea>
        <textarea class = "notes" type="text" name="input" placeholder="Notes" rows="3" cols="33"></textarea>  
        <div class = "table_weather"><table><caption>Forecast wheather - 16 days</caption><tr class = "date_table"></tr><tr class = "temp_table"></tr></table></div>
        <button class = "delete_travel" onclick="return Client.deleteDestination(event)">Delete destination</button></div>` ;
  destination.innerHTML=newDestination;

  let search =destination.querySelector(".search_location");
  search.addEventListener("click", (event)=>{    
    Client.getAddress(event);
  });

  destination.addEventListener("keyup", (event)=>{    
    Client.inputChanged(event);
  });
  addTravel.appendChild(destination);
}

//when clicked on the button '' delete_travel '' deletes the respective item that was in the "Add or edit trip 'tab.
function deleteDestination(event){

  event.preventDefault();
  saveData();

  const index = event.target.parentElement.getAttribute('data-index');   
  delete trip.destination[index];
  addTravel.removeChild(event.target.parentElement);
  let destTemp =[];

  for(let destination of trip.destination){
    if(destination!==undefined){
      destTemp.push(destination);
    }
      
  }
  trip.destination = destTemp;    
  refreshTripsInAddTravel(trip,0); 
}
//function that serves to update and keep the data consistent in the "Add or edit trip" tab when there is any exclusion of selected destination.
function refreshTripsInAddTravel(actualTrip,index=0){

    addTravel.innerHTML="";
    let tripName = document.createElement('input');
    tripName.classList.add("trip_name");
    tripName.setAttribute("data-index",index);
    tripName.setAttribute("type","text");
    tripName.setAttribute("name","input");
    tripName.setAttribute("placeholder","Trip name*");
    tripName.value = trip.trip_name;   
    addTravel.appendChild(tripName);
    let count = 0;
     
    for(let destination of actualTrip.destination){
   
      let destinationFather = document.createElement('div');
      destinationFather.classList.add("destinations_childs"); 
      destinationFather.setAttribute("data-index",count);    
      let imageUrl = destination.image;
      let newDestination = `<button class = "search_location">Search</button> 
        <p class = "destination_number"><strong>Destination ${count+1}</strong></p>                            
        <figure class = "image"></figure>  
        <input list = "autocomplete_places" class="address" type="text" name="input" placeholder="City, State, Country*" value="${destination.address}">
        <datalist id="autocomplete_places">                           
        </datalist>
        <input class="date" type="text" name="input" placeholder="Date*" onfocus="(this.type='date')" onblur="(this.type='text')" value="${destination.date}">
        <input class="company" type="text" name="input" placeholder="Flight or bus info*" value="${destination.company}">              
        <input class="hotel_name" type="text" name="input" placeholder="Hotel name*" value="${destination.hotel_name}"> 
        <input class="check_in" type="text" name="input" placeholder="Check in*" onfocus="(this.type='date')" onblur="(this.type='text')" value="${destination.check_in}">
        <input class="check_out" type="text" name="input" placeholder="Check out*" onfocus="(this.type='date')" onblur="(this.type='text')" value="${destination.check_out}">
        <input class="board_time" type="text" name="input" placeholder="Time*" onfocus="(this.type='time')" onblur="(this.type='text')" value="${destination.board_time}">      
        <textarea class = "lodgind_info" type="text" name="textarea" placeholder="Lodgind info" rows="3" cols="33" value="${destination.lodgind_info}"></textarea>
        <textarea class = "packing_list" type="text" name="textarea" placeholder="Packing list" rows="3" cols="33" value="${destination.packing_list}"></textarea>
        <textarea class = "notes" type="text" name="input" placeholder="Notes" rows="3" cols="33" value="${destination.notes}"></textarea>  
        <div class = "table_weather"><table><caption>Forecast wheather - 16 days</caption> <tr class = "date_table">${destination.date_table}</tr>
        <tr class = "temp_table">${destination.temp_table}</tr></table></div>`;   

        if(count>0){
          newDestination+=`<button class = "delete_travel" onclick="return Client.deleteDestination(event)">Delete destination</button></div>`;   
        }       
        destinationFather.innerHTML=newDestination;

        let image = destinationFather.querySelector(".image");    
        image.style.backgroundImage = imageUrl;
        let textareas = destinationFather.getElementsByTagName('textarea');

        let search =destinationFather.querySelector(".search_location");
        search.addEventListener("click", (event)=>{    
          Client.getAddress(event);
        });

        for(let textarea of textareas){        
          textarea.value = destination[textarea.className];
        }
        destinationFather.addEventListener("keyup", (event)=>{    
          Client.inputChanged(event);
        });
        addTravel.appendChild(destinationFather);
        count++;
    }            
  }
//function that makes a validation if all mandatory data have been filled.
function validateInputs(){
    let form = document.getElementById("add_travel");
    let elementsInput = form.getElementsByTagName('input');

    for(let element of elementsInput){
      if(element.value==""){     
        return false;
      }
    }
    return true;
}
//makes a post to get the data from the APIs
const postData = async ( url = '', data)=>{  
    //config and post the data 
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
   // Body data type must match "Content-Type" header        
   body: JSON.stringify(data),
  });

    try {
      const newData = await response.json();
      return newData;
    }catch(error) {
    console.log("error in postData", error);
    }
}
//event listener that when activated saves all data and sends it to the server.
function saveTravel(event){
    event.preventDefault();           
    if(validateInputs()){     
      //saves the data
      saveData();
      addTravel.innerHTML=`<input class="trip_name" type="text" name="input" placeholder="Trip name*" data-index='0'>     
                    <div class="destinations_childs" data-index='0'>
                        <button class = "search_location">Search</button> 
                        <p class = "destination_number"><strong>Destination 1</strong></p>                            
                        <figure class = "image"></figure>  
                        <input class="address" type="text" name="input" placeholder="Country, state, city*">
                        <input class="date" type="text" name="input" placeholder="Date*" onfocus="(this.type='date')" onblur="(this.type='text')">
                        <input class="company" type="text" name="input" placeholder="Flight or bus info*">              
                        <input class="hotel_name" type="text" name="input" placeholder="Hotel name*"> 
                        <input class="check_in" type="text" name="input" placeholder="Check in*" onfocus="(this.type='date')" onblur="(this.type='text')">
                        <input class="check_out" type="text" name="input" placeholder="Check out*" onfocus="(this.type='date')" onblur="(this.type='text')">
                        <input class="board_time" type="text" name="input" placeholder="Time*" onfocus="(this.type='time')" onblur="(this.type='text')">      
                        <textarea class = "lodgind_info" type="text" name="textarea" placeholder="Lodgind info" rows="3" cols="33"></textarea>
                        <textarea class = "packing_list" type="text" name="textarea" placeholder="Packing list" rows="3" cols="33"></textarea>
                        <textarea class = "notes" type="text" name="input" placeholder="Notes" rows="3" cols="33"></textarea>
                        <div class = "table_weather"><table><caption>Forecast wheather - 16 days</caption><tr class = "date_table"></tr><tr class = "temp_table"></tr></table>    
                        </div></div>`;

      alert("Informations save");
      postData('http://localhost:8081/save',trip);
      location.reload();

    }else{
      alert("Fill all inputs with * and click in search");
    }
  } 

  export {openOption, saveTravel, addDestination, deleteDestination, getAddress, inputChanged, postData, returnIndex}