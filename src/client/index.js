import { openOption,saveTravel,addDestination,deleteDestination,getAddress,inputChanged,postData,returnIndex } from './js/formHandler';

import './styles/base.scss';
import './styles/footer.scss';
import './styles/header.scss';
import './styles/tabs.scss';
import './styles/addtravel.scss';
import './styles/mytravel.scss';
import './styles/mediascreen.scss';

document.addEventListener("DOMContentLoaded",()=> {
    //event listeners here

    document.querySelector(".destinations_childs").addEventListener("keyup", (event)=>{    
      Client.inputChanged(event);
    });
    document.querySelector(".destinations_childs").querySelector(".search_location").addEventListener("click", (event)=>{    
      Client.getAddress(event);
    });

    document.querySelector(".destinations_childs").querySelector(".search_location").addEventListener("click", (event)=>{    
      Client.getAddress(event);
    });

    document.querySelector(".my-travel-planner").addEventListener("click", (event)=>{    
      Client.openOption(event,'my-travel');
    });

    document.querySelector(".add_edit").addEventListener("click", (event)=>{    
      Client.openOption(event,'new-travel');
    });

    document.querySelector(".save_trip").addEventListener("click", (event)=>{    
      Client.saveTravel(event);
    });

    document.querySelector(".add_destination").addEventListener("click", ()=>{    

      Client.addDestination();
    });
  });

export{
    openOption,
    saveTravel,
    addDestination,
    deleteDestination,
    getAddress,
    inputChanged,
    postData,
    returnIndex
    
}



