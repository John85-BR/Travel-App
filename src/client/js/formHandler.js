

let trip={
      trip_name:"",
      destination:[{
        country:"",
        state:"",
        city:"",       
        date:"",
        company:"",
        board_time:"",
        hotel_name:"",
        check_in:"",
        check_out:"",
        lodgind_info:"",
        packing_list:"",
        notes:""  
      }]    
    };
    
    const blankDestination={ country:"",
    state:"",
    city:"",
    date:"",
    company:"",
    board_time:"",
    hotel_name:"",
    check_in:"",
    check_out:"",
    lodgind_info:"",
    packing_list:"",
    notes:""
  };

  let footer = document.querySelector('.footer');
  let addTravel = document.getElementById("add_travel");
  let myTravel = document.getElementById("trips");


  function getAddress(event){

    
    let imagem = event.target.parentElement.parentElement.querySelector(".image");
    let country = event.target.parentElement.parentElement.querySelector(".country");
    let state = event.target.parentElement.parentElement.querySelector(".state");
    let city = event.target.parentElement.parentElement.querySelector(".city");
    let index = event.target.parentElement.parentElement.getAttribute("data-index");
    
    
    if(country.value.length>3 && state.value.length>3 && city.value.length>3 && imagem.style.backgroundImage ==""){

      let content=country.value.replace(/ /g,"+")+"+"+state.value.replace(/ /g,"+")+"+"+city.value.replace(/ /g,"+");
      alert(content);
          
      getAPIData(`https://pixabay.com/api/?key=19665690-5244963ad9ee949591bbe5ec8&q=${content}&image_type=photo`)
      .then(data=>{           
        let str = data.hits[0].webformatURL;
        alert(str);
        imagem.style.backgroundImage = 'url('+str+')';
      
      });
    }

  }

  function inputChanged(event){
    let imagem = event.target.parentElement.querySelector(".image");
    if(event.target.className=="country" || event.target.className=="state" || event.target.className=="city"){
      imagem.style.backgroundImage = "";
    }   
  }
    

  
  
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

function updateDatalist(data){
  let option = ``;
  let countryDataList = document.getElementById("countries"); 

  for(let item of data){
    option+=`<option value=${item.name}>`;
  }
  countryDataList.innerHTML=option;
}


function openOption(evt, option) {
    var i, tabcontent, tablinks;
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

    if(evt.currentTarget.textContent=="Add or edit trip"){
      trip.destination = [];
      trip.destination.push(blankDestination);
      
      saveTripButton.style.display = "block";   
      addDestButton.style.display = "block";

     
      getAPIData('https://restcountries.eu/rest/v2/all')
      .then(data=>{
        updateDatalist(data);
      });
    }

    if(evt.currentTarget.textContent=="My travel planner"){
      saveTripButton.style.display = "none";
      addDestButton.style.display = "none";
      

      
      addTravel.innerHTML=`<input class="trip_name" type="text" name="input" placeholder="Trip name*" data-index='0'>     
      <div class="destinations_childs" data-index='0' onkeydown="Client.inputChanged(event)">
          <p class = "search_location" onclick="return Client.getAddress(event)"><strong>Search location</strong></p> 
          <p class = "destination_number"><strong>Destination 1</strong></p>
          <figure class = "image"></figure>                                                                                  
          <input class="country" type="text" name="input" placeholder="Country*" > 
          <input class="city" type="text" name="input" placeholder="City*" >                                                                                 
          <input class="state" type="text" name="input" placeholder="State*" > 
          <input class="date" type="text" name="input" placeholder="Date*" onfocus="(this.type='date')" onblur="(this.type='text')">
          <input class="company" type="text" name="input" placeholder="Flight or bus info*">              
          <input class="hotel_name" type="text" name="input" placeholder="Hotel name*"> 
          <input class="check_in" type="text" name="input" placeholder="Check in*" onfocus="(this.type='date')" onblur="(this.type='text')">
          <input class="check_out" type="text" name="input" placeholder="Check out*" onfocus="(this.type='date')" onblur="(this.type='text')">
          <input class="board_time" type="text" name="input" placeholder="Time*" onfocus="(this.type='time')" onblur="(this.type='text')">      
          <textarea class = "lodgind_info" type="text" name="input" placeholder="Lodgind info" rows="3" cols="33"></textarea>
          <textarea class = "packing_list" type="text" name="input" placeholder="Packing list" rows="3" cols="33"></textarea>
          <textarea class = "notes" type="text" name="input" placeholder="Notes" rows="3" cols="33"></textarea>                                         
          
      </div>`;
      myTravel.innerHTML="";
   
      getAPIData('http://localhost:8081/get')
      .then(data=>{
        updateNewTrip(data);
      });        
    }

    
  }

  function updateNewTrip(data){

    

    for(let tripUnit of data){

      let tripName = document.createElement('div');
      tripName.classList.add("trip_name");
      tripName.setAttribute("data-index",data.indexOf(tripUnit));
      console.log(tripUnit.name+" in update");
      tripName.innerHTML = `<h1>${tripUnit.trip_name}</h1>`;
      myTravel.appendChild(tripName);
     

      for(let destination of tripUnit.destination){
        
        let element = document.createElement('div');
        element.classList.add("destinations_childs");
        element.setAttribute("data-index",tripUnit.destination.indexOf(destination));

        let address = `${destination.country}, ${destination.state}, ${destination.city}`;
    
        let newElement = `<p class = "destination_number">
        <strong>Destination ${tripUnit.destination.indexOf(destination)+1}</strong></p>
        <div class="address"><p><strong>Destination</strong></p><span>${address}</span></div> 
        <div class="date"><p><strong>Date</strong></p><span>${destination.date}</span></div> 
        <div class="company"><p><strong>Company</strong></p><span>${destination.company}</span></div>            
        <div class="hotel_name"><p><strong>Hotel</strong></p><span>${destination.hotel_name}</span></div> 
        <div class="check_in"><p><strong>Check_in</strong></p><span>${destination.check_in}</span></div> 
        <div class="check_out"><p><strong>Check_out</strong></p><span>${destination.check_out}</span></div> 
        <div class="board_time"><p><strong>Board time</strong></p><span>${destination.board_time}</span></div>     
        <div class = "lodgind_info"><p><strong>Lodgind info</strong></p><span>${destination.lodgind_info}</span></div>
        <div class = "packing_list"><p><strong>Packing list</strong></p><span>${destination.packing_list}</span></div>
        <div class = "notes"><p><strong>Notes</strong></p><span>${destination.notes}</span></div>
        <div class = "about"><p><strong>About the place</strong></p><span>Name</span></div>`;         
        
        element.innerHTML=newElement; 
        myTravel.appendChild(element);
      }

      
      

      
      
    }

  }
  


  function addDestination(){
   
    let destination = document.createElement('div');
    destination.classList.add("destinations_childs"); 
    

    trip.destination.push(blankDestination);
    destination.setAttribute('data-index',trip.destination.length-1);
    let temp = parseInt(destination.getAttribute('data-index'))+1;

    let newDestination = `<p class = "search_location" onclick="return Client.getAddress(event)"><strong>Search location</strong>
    </p> <p class = "destination_number">
    <strong>Destination ${temp}</strong></p><figure class = "image"></figure>  
    <input class="country" list = "countries" name="country" placeholder="Country*" > 
    <datalist id="countries">                            
    </datalist>
    <input class="city" list = "cities" name="city" placeholder="City*" > 
    <datalist id="cities">                            
    </datalist>                                                                                
    <input class="state" list = "states" name="state" placeholder="State*" > 
    <datalist id="states">                            
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
    <button class = "delete_travel" onclick="return Client.deleteDestination(event)">Delete destination</button>` ;

    destination.innerHTML=newDestination;
    destination.addEventListener("keydown", (event)=>{    
      Client.inputChanged(event);
    });
    addTravel.appendChild(destination);

 

  }

  function deleteDestination(event){

    event.preventDefault();

    const index = event.target.parentElement.getAttribute('data-index');
    delete trip.destination[index];

    addTravel.removeChild(event.target.parentElement);

    let destTemp =[];

    for(destination of trip.destination){
      if(destination!='undefined'){
        destTemp.push(destination);
      }
    }

    trip.destination = destTemp;
  
  }

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

  //vai para o utils
  function saveTravel(event){

    event.preventDefault();
        
    let form = document.getElementById("add_travel");
    let divsFather = form.getElementsByClassName("destinations_childs");

    



    
      
    if(validateInputs()){     

      trip.trip_name = form.querySelector(".trip_name").value;
      form.querySelector(".trip_name").value="";

      for(let div of divsFather){
        

        let elementsInput = div.getElementsByTagName('input');
        let elementsTextarea = div.getElementsByTagName('textarea');
        

        for(let element of elementsInput){
       
          trip.destination[div.getAttribute('data-index')][element.className] = element.value;
          element.value="";         
                   
        }
        for(let element of elementsTextarea){
          trip.destination[div.getAttribute('data-index')][element.className] = element.value;
          element.value="";
        } 

      }      
      
      alert("Informations save");

      console.log(JSON.stringify(trip.destination)+" in client");

      postData('http://localhost:8081/save',trip);

    }else{
      alert("Fill all inputs with *");
    }

    
  }
 


  

  export {openOption, saveTravel, addDestination, deleteDestination, getAddress, inputChanged}