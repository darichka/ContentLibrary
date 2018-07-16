function search(){
    var searchItem = document.getElementById('search');
    searchItem.addEventListener('click', showSearchDialog);
    searchItem.nextElementSibling.querySelector('.close-btn').addEventListener('click', hideSearchDialog);
    function showSearchDialog(){
        if(search.nextElementSibling.open) {
            hideSearchDialog();
            return;
        }
        search.nextElementSibling.open = true;
    }
    function hideSearchDialog(){
        if(search.nextElementSibling.open){
            search.nextElementSibling.open = false;
        }
    }
};

/* 
    function of map drawing on the page contacts.html
*/
function initMap() {
    var fitchburg = {lat: 43.002316, lng: -89.424095}; // coordinate of offise (lat = latitude, long = longitude)
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 8, center: fitchburg});
        var marker = new google.maps.Marker({position: fitchburg, map: map});
}

/* 
    Function UploadData uploading content data from JSON files:
    content_data.json - file, what contains array with data for library
    rubrics_keys.json - matches key - value  for rubrics in file content_data.json
    type_keys.json - matches key - value  for types in file content_data.json
    subtype_keys.json - matches key - value  for subtype in file content_data.json
*/

var data = new UploadData();

function UploadData(){
    var dataKeys = {};
    var dataContent = [];
    setKeys();
    setDataContent();

    function setKeys(){
        var response = openFile('data/rubrics_keys.json');
        dataKeys.rubrics = JSON.parse(response);
        dataKeys.types = JSON.parse(openFile('data/type_keys.json'));
        dataKeys.subtypes = JSON.parse(openFile('data/subtype_keys.json'));
    }
    
    function setDataContent(){
        dataContent = JSON.parse(openFile('data/content_data.json'));
    }

    this.getKeys = function(){
        return dataKeys;
    }

    this.getData = function(){
        return dataContent;
    }
}

function openFile(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',path, false);
    xhr.send();
        if(xhr.status != 200){ 
            alert('Error oquired during opening the file ' + path + xhr.status + ': ' + xhr.statusText);
        }
        else{
            return xhr.responseText;
        }
    
}

function PropertyError(property) {
    Error.call(this, property) ;
    this.name = "PropertyError";
  
    this.property = property;
    this.message = "Ошибка в свойстве " + property;
  
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PropertyError);
    } else {
      this.stack = (new Error()).stack;
    }
  }

  PropertyError.prototype = Object.create(Error.prototype);
  
