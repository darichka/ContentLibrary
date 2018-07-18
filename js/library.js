/*
    Function-constructor Content
*/

function Content(path){
    this._path = path;
    this._allData = [];
    this._dataKeys = {};
    this.crums = [];
}

/* 
    Function UploadData uploading content data from JSON file content_data.json:
    the first object of the JSON-data matches key - value for rubrics, types and subtypes of content from other 
    objects.
*/

Content.prototype.uploadData = function(){
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.open('GET',this._path, true);
    xhr.send();
    xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        var input = JSON.parse(xhr.responseText);
            if(input.length > 0){
                self._dataKeys = input[0];
                self._allData = input.slice(1);
                var displayer = new Displayer(self._allData, 9);
                displayer.displayContent(self._allData);
            }
        }
    }
}

Content.prototype.addBreadCrum = function(title){
    var box = document.getElementById('breadcrums');
    var crumArrow = box.querySelector('.breadcrums-arrow');
    var newCrum = {
        id: 'crum' + (this.crums.length + 1),
        body: title
    }
    this.crums.push(newCrum);
    var newCrumSpan = document.createElement('span');
    newCrumSpan.classList.add('breadcrum-item');
    newCrumSpan.id = newCrum.id;
    newCrumSpan.innerHTML = newCrum.body;
    var newArrow = crumArrow.cloneNode(true);
    box.appendChild(newArrow);
    box.appendChild(newCrumSpan);
}

Content.prototype.filter = function(event){
    this.addBreadCrum(event.target.id);
    var currentPull = getDisplayedContent();
    currentPull.map = [].map;
    currentPull = currentPull.map(function(item){
        return item.id;
    });
    currentPull = this.getItemsByIds(currentPull);
    // (!filterParams) ? filterParams = event.target.id : filterParams = filterParams;
    var filterKeyValue = this.getKey(this._dataKeys, event.target.id);
    filterKeyValue = {key: filterKeyValue.type, value: filterKeyValue[event.target.id]};
    var targetPull = currentPull.filter(function(item){
            return item[filterKeyValue.key] == filterKeyValue.value;
        });
    var displayer = new Displayer(targetPull, 9);
    displayer.displayContent(targetPull);
}

/*
    The function getItemsById compares id from input array ids and return the
    array of content objects with these identificator.
*/
Content.prototype.getItemsByIds = function(ids){
    var result = this._allData.filter(function(item){
        for(var i = 0; i < ids.length; i++){
            console.log(item.id == ids[i]);
            if(item.id == ids[i]){
                i = 0;
                return true;
            }            
        }
        return false;
    });
    return result;
}

Content.prototype.getKey = function keyOfValue(obj, keyValue){
   
    for(key in obj){
        if((typeof (obj[key]) == 'object') && obj[key].hasOwnProperty(keyValue)){
            obj[key].type = key;
            return obj[key];
        }
    }
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
    this._targetContent = contentArr;
}

Displayer.prototype.displayContent = function(){

    var j;
    var nav = document.getElementById('pagination');
    var i = nav.children.length;
    for( i ; i > 0; i--){
        this._contentBox.removeChild(this._contentBox.children[i-1]);
        nav.removeChild(nav.children[i-1]);
    }
    for(var i = 0; i < this._numOfPages; i++){
        var newPage = document.createElement('div');
        newPage.id = 'page' + (i + 1);
        newPage.classList.add('page');
        this._contentBox.appendChild(newPage);
        (this._itemsOnPage*(i+1) > this._targetContent.length) ? j = -1 : j =  this._itemsOnPage*(i+1);
        this.fillPage({
            pageId: i+1,
            content: this._targetContent.slice(9*i, j)
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
        newContTitle.innerHTML = item.theme + item.rubric;
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
var filter = document.getElementById('filters');
var g = contData.filter.bind(contData);
filter = filter.getElementsByClassName('filter-item');
for(var i = 0; i < filter.length; i++){
    filter[i].addEventListener('click', function(){
        contData.filter(event);
    });
}


