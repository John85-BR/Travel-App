let d = new Date();
let newDate = (d.getMonth()+1)+'/'+ d.getDate()+'/'+ d.getFullYear();

let trip={
      trip_name:"",
      destination:{
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
        table_date:"",
        table_temp:""  
      }    
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
    table_date:"",
    table_temp:""
  };

  let footer = document.querySelector('.footer');
  let addTravel = document.getElementById("add_travel");
  let myTravel = document.getElementById("trips");


  function getAddress(event){

    event.preventDefault();
 
    let imagem = event.target.parentElement.querySelector(".image");
    let address = event.target.parentElement.querySelector(".address");
    let tableHDate = event.target.parentElement.querySelector(".date_table");
    let tableHTemp = event.target.parentElement.querySelector(".temp_table");

    let results = 0;
    alert(event.target.parentElement.className);
    if(address.value!=""){
      let temp = address.value.trim().split(",");    
      for(let item of temp){
        if(item!=""){
          ++results;
        }
      }
    }
    
    
    if(results==3 && imagem.style.backgroundImage ==""){

      let content=address.value.replace(/ /g,"+").replace(/,/g,"");  
      
      alert(content);
      postData('http://localhost:8081/post_pixabay',{textContent:content})
      .then(data=>{                    
        if(parseInt(data.totalHits) > 0){        
          let str = data.hits[0].webformatURL;           
          imagem.style.backgroundImage = 'url('+str+')';

        }else{
          alert("No images available");
        }                
      });

      getAPIData(`http://api.geonames.org/searchJSON?q=${address.value}&maxRows=1&isNameRequired=true&username=jbezerrajr`)
      .then(data=>{

        if(data.totalResultsCount>0){       

          getAPIData(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${data.geonames[0].lat}&lon=${data.geonames[0].lng}&key=72e60b68280146b8bfd7bef572fc91a0`)
          .then(tempData=>{

            let strTemp = `<th>Temp:</th>`;
            let strDate = `<th>Date:</th>`;

            for(let temp of tempData.data){
              strDate+=`<td>${temp.valid_date}</td>`;
              strTemp+=`<td>${temp.temp}</td>`;              
            }
            const index = event.target.parentElement.getAttribute("data-index");

            trip.destination[index].table_date = strDate;
            trip.destination[index].table_temp = strTemp;

            tableHDate.innerHTML=strDate;
            tableHTemp.innerHTML=strTemp;

          });
               
        }


      });





    }else{
      alert("Insert the City, State and Country");
    }
  }

  function saveData(){

    
    let form = document.getElementById("add_travel");
    let divsFather = form.getElementsByClassName("destinations_childs");
          
  

    trip.trip_name = form.querySelector(".trip_name").value;


    for(let div of divsFather){
        
      let elementsInput = div.getElementsByTagName('input');
      let elementsTextarea = div.getElementsByTagName('textarea');

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
          table_date:"",
          table_temp:""
      };
        

      for(let element of elementsInput){          
        tempDestination[element.className] = element.value;         
                              
      }
      for(let element of elementsTextarea){
        tempDestination[element.className] = element.value;
      
      } 
      trip["destination"][div.getAttribute('data-index')]=tempDestination;
    }      
     
   
    alert(JSON.stringify(trip));
    
    
  }

  function inputChanged(event){
    let imagem = event.target.parentElement.querySelector(".image");
    let address = event.target.parentElement.querySelector(".address");
    let options = ``;
    let datalist = document.getElementById("autocomplete_places"); 

    saveData();
        

    if(event.target.className=="address" && event.target.value!=""){
      
      address.value = address.value.replace(/[\[\]¨+\-.@º"§’#!?'$%^&*;:{}=\-–_><`´~()1234567890¹²³£¢¬ª|]/g,"");
      address.value = address.value.replace(/\s\s/g," ");
      address.value = address.value.replace(/,,/g,",");

      let temp = address.value.trim().split(",");
      let results = 0;
      for(let item of temp){
        if(item!=""){
          ++results;
        }
      }

 

      /*postData('http://localhost:8081/post_geonames',{textContent:address.value})
      .then(data=>{   
        
        
        if(parseInt(data.totalResultsCount) > 0 && results>1){      
          for(let item of data.geonames){
            let str = item.toponymName+", "+item.adminName1+", "+item.countryName;
            alert(str);
            options += `<option value=${str}>`;
          }  
         
          datalist.innerHTML=options;

        }         
      });*/

      imagem.style.backgroundImage="";
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
    }

    if(evt.currentTarget.textContent=="My travel planner"){
      saveTripButton.style.display = "none";
      addDestButton.style.display = "none";   

      addTravel.innerHTML=`<input class="trip_name" type="text" name="input" placeholder="Trip name*" data-index='0'>     
                    <div class="destinations_childs" onkeyup="Client.inputChanged(event)" data-index='0'>
                        <button class = "search_location" onclick="return Client.getAddress(event)">Search</button> 
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
                        <div style="overflow-x:auto;" class = "table_weather">
                            <table>                                                  
                                <tr class = "date_table">
                                
                                    
                                </tr>
                                <tr class = "temp_table">
                                
                                    
                                </tr>
                            </table>    
                        </div></div>`;                                                             
                    
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
      
      tripName.innerHTML = `<h1>${tripUnit.trip_name}</h1>`;
      myTravel.appendChild(tripName);
     
      for(let destination of tripUnit.destination){
        
        let element = document.createElement('div');
        element.classList.add("destinations_childs");
        element.setAttribute("data-index",tripUnit.destination.indexOf(destination));
          
        let content=destination.address.replace(/ /g,"+").replace(/,/g,""); 
        postData('http://localhost:8081/post_pixabay',{textContent:content})
        .then(data=>{           
          let str = data.hits[0].webformatURL;    
          let imageUrl = 'url('+str+')'; 

          let newElement = `<p class = "destination_number">
          <strong>Destination ${tripUnit.destination.indexOf(destination)+1}</strong></p>
          <figure class = "image" style="background-image:${imageUrl};"></figure>
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
          <div class = "about"><p><strong>About the place</strong></p><span>Name</span></div>
          <div class = "table_weather"><table>                                                  
          <tr class = "date_table">${destination.table_date}</tr><tr class = "temp_table">${destination.table_temp}                                                                 
          </tr></table></div>`;                
          element.innerHTML=newElement; 
          myTravel.appendChild(element);

        });              
      }           
    }
  }

  function addDestination(){
   
    let destination = document.createElement('div');
    destination.classList.add("destinations_childs"); 
    trip.destination.push(blankDestination);
    destination.setAttribute('data-index',trip.destination.length-1);
    let temp = parseInt(destination.getAttribute('data-index'))+1;

    let newDestination = `<button class = "search_location" onclick="return Client.getAddress(event)">Search</button> 
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
        <div style="overflow-x:auto;" class = "table_weather">
                            <table>                                                  
                                <tr class = "date_table">
                                
                                    
                                </tr>
                                <tr class = "temp_table">
                                
                                    
                                </tr>
                            </table>    
                        </div>
        <button class = "delete_travel" onclick="return Client.deleteDestination(event)">Delete destination</button>                                       
        
    </div>` ;

    destination.innerHTML=newDestination;
    destination.addEventListener("keyup", (event)=>{    
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

    

    for(let destination of trip.destination){
      if(destination!==undefined){
        destTemp.push(destination);
      }
    }
    trip.destination = destTemp;

    

   
    
    refreshTripsInAddTravel(trip,0);

    
  }


  function refreshTripsInAddTravel(actualTrip,index=0){

    

    addTravel.innerHTML="";

    let tripName = document.createElement('input');
    tripName.classList.add("trip_name");
    tripName.setAttribute("data-index",index);
    tripName.setAttribute("type","text");
    tripName.setAttribute("name","input");
    tripName.setAttribute("placeholder","Trip name*");
    
    addTravel.appendChild(tripName);

    let count = 0;
     
    for(let destination of actualTrip.destination){

      
      let destinationFather = document.createElement('div');
      destinationFather.classList.add("destinations_childs"); 

      alert(destination.address);
     
      destinationFather.setAttribute("data-index",count);    
      let newDestination = `<button class = "search_location" onclick="return Client.getAddress(event)"><strong>Search</strong></button> 
        <p class = "destination_number"><strong>Destination ${count+1}</strong></p>                            
        <figure class = "image"></figure>  
        <input list = "autocomplete_places" class="address" type="text" name="input" placeholder="City, State, Country*" value="${destination.address}">
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
        <div style="overflow-x:auto;" class = "table_weather"><table><tr class = "date_table"></tr><tr class = "temp_table"></tr></table></div>`;   

        if(count>0){
          newDestination+=`<button class = "delete_travel" onclick="return Client.deleteDestination(event)">Delete destination</button>`;   
        }
        
        destinationFather.innerHTML=newDestination;
        destinationFather.addEventListener("keyup", (event)=>{    
          Client.inputChanged(event);
        });
        addTravel.appendChild(destinationFather);
        count++;
    }            
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
          table_date:"",
          table_temp:""
        };
        

        for(let element of elementsInput){          
          tempDestination[element.className] = element.value;         
          element.value="";                          
        }
        for(let element of elementsTextarea){
          tempDestination[element.className] = element.value;
          element.value="";
        } 
        trip["destination"][div.getAttribute('data-index')]=tempDestination;
      }      
      alert("Informations save");
      postData('http://localhost:8081/save',trip);

    }else{
      alert("Fill all inputs with *");
    }
  }
 


  

  export {openOption, saveTravel, addDestination, deleteDestination, getAddress, inputChanged}