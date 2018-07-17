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
    Function-constructor Content
*/

function Content(path){
    this._path = path;
    this._dataContent = [];
    this._dataKeys = {};
}

/* 
    Function UploadData uploading content data from JSON file content_data.json:
    the first object of the JSON-data matches key - value for rubrics, types and subtypes of content from other 
    objects.
*/

Content.prototype.uploadData = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',this._path, true);
    xhr.send();
    xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        var input = JSON.parse(xhr.responseText);
            if(input.length > 0){
                this._dataKeys = input[0];
                this._dataContent = input.slice(1);
                var displayer = new Displayer(this._dataContent, 9);
                displayer.displayContent(this._dataContent);
            }
        }
    }
}

Content.prototype.filter = function(filterParams){

}

Content.prototype.sort = function(sortParam){

}

function getDisplayedContent(){
    var contentBox = document.getElementById('content-box');
    var displayedContent = contentBox.getElementsByClassName('content-item');
    return displayedContent;
}

function Displayer(contentArr, itemsOnPage){
    this._contentBox = document.getElementById('content-box');
    this._itemsOnPage = itemsOnPage;
    this._numOfPages = Math.ceil(contentArr.length/itemsOnPage);
    this._content = contentArr;
}

Displayer.prototype.displayContent = function(){
    var j;
    var nav = document.getElementById('pagination');
    for(var i = 0; i < this._numOfPages; i++){
        var newPage = document.createElement('div');
        newPage.id = 'page' + (i + 1);
        newPage.classList.add('page');
        this._contentBox.appendChild(newPage);
        (this._itemsOnPage*(i+1) - 1 > this._content.length) ? j = -1 : j =  this._itemsOnPage*(i+1) - 1;
        this.fillPage({
            pageId: i+1,
            content: this._content.slice(9*i, j)
        });
        var navItem = document.createElement('div');
        var self = this;
        navItem.id = i;
        navItem.innerHTML = i+1;
        navItem.addEventListener('click', showPage);
        nav.appendChild(navItem);
    }
    showPage(0);
}

Displayer.prototype.fillPage = function(obj){
    var self = this;
    obj.content.forEach(function(item, i, arr){
        var newCont = document.createElement('div');
        var newContTitle = document.createElement('h3');
        var newContAuthor = document.createElement('p');
        var wrapper = document.createElement('div');
        newCont.classList.add('content-item');
        newCont.id = item.id;
        newContTitle.innerHTML = item.theme;
        newContAuthor.innerHTML = item.author;
        wrapper.classList.add('titles-content-wrapper');
        wrapper.appendChild(newContAuthor);
        wrapper.appendChild(newContTitle);
        switch(item.type){
            case '1':{
                newCont.appendChild(self.displayVideo(item));
                newCont.appendChild(wrapper);
                break;
            };
            case '2':{
                var newContA = document.createElement('a');
                newContA.href = item.url;
                newContA.appendChild(self.displayText(item));
                newContA.appendChild(wrapper);
                newCont.appendChild(newContA);
                break;
            };
            case '3': {
                newCont.appendChild(self.displayAudio(item));
                newCont.appendChild(wrapper);
                break;
            }
        }
        document.getElementById('page' + obj.pageId).appendChild(newCont);
    });
    
}

Displayer.prototype.displayAudio = function(item){
    var newCont = document.createElement('audio');
    var src = document.createElement('source');
    src.src = item.url;
    newCont.setAttribute('controls', 'true');
    newCont.appendChild(src);
    return newCont;
}

Displayer.prototype.displayVideo = function(item){
    var newCont = document.createElement('video');
    var src = document.createElement('source');
    src.src = item.url;
    newCont.setAttribute('controls', 'true');
    newCont.appendChild(src);
    return newCont;
}

Displayer.prototype.displayText = function(item){
    var newContImg = document.createElement('img');
    newContImg.src = item.imgurl;
    return newContImg;
}

function showPage (id){
    if(id != 0){
        id = event.target.id;
    }
    var content = document.getElementById('content-box');
    for(i = 0; i < content.children.length; i++){
        if(content.children[i].matches('.page')){
            content.children[i].style.display = 'none';
        }
    }
    if(content.children[id]){
        content.children[id].style.display = 'flex';
    }
}

function parseFilter(inputFilter){
    var parsedFilter = [];
    return parsedFilter;
}


var contData = new Content('content_data.json');
contData.uploadData();



/*
    Accordion function implements showing and hiding of dropdown left menu
*/

var leftMenu = document.getElementById('left-menu-list');
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
    elem.style.height = elem.firstElementChild.offsetHeight * elem.children.length + 'px';
    console.log(elem.height);
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
  
