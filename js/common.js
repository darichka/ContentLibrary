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
    function initMap draws nap on the page contacts.html
*/
function initMap() {
    var fitchburg = {lat: 43.002316, lng: -89.424095}; // coordinate of offise (lat = latitude, long = longitude)
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 8, center: fitchburg});
        var marker = new google.maps.Marker({position: fitchburg, map: map});
}

/*
    Accordion function implements showing and hiding of dropdown left menu
*/

var leftMenu = document.getElementById('filters');
var newAcc = new Accordion(leftMenu);
function Accordion(elem){
    var firstLevel = elem.getElementsByClassName('filter-btn');
    firstLevel.forEach = [].forEach;
    var self = this;
    firstLevel.forEach(function(item, i, arr){
        item.addEventListener('click',function(){
            if(!this.matches('.open')){
                this.classList.add('open');
                if(this.nextElementSibling.matches('.dropdown-left-menu')){
                    self.show(this.nextElementSibling);
                }
            }
            else{
                this.classList.remove('open');
                if(this.nextElementSibling.matches('.dropdown-left-menu')){
                    self.hide(this.nextElementSibling);
                }
            }
        });
    });
}

Accordion.prototype.hide = function(elem){
    elem.style.height = 0;
};

Accordion.prototype.show = function(elem){
    elem.children.filter = [].filter;
    var displayedChilds = elem.children.filter(function(item){
        if(item.style.display !='none') return true;
    })
    if(displayedChilds.length > 0){
        elem.style.height = displayedChilds[0].offsetHeight * displayedChilds.length + 'px';
    }
    else{
        elem.style.height = 0;
    }
};

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
  
