/*
    Function-constructor Content
*/

function Content(path){
    this._path = path;
    this._allData = [];
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
                self._allData = input;
                document.getElementById('all').querySelector('.count').innerHTML = '(' + self._allData.length + ')';
                displayContent(self._allData);
            }
        }
    }
}

Content.prototype.filter = function(event){
    var currentPull = getDisplayedContent();
    currentPull.map = [].map;
    currentPull = currentPull.map(function(item){
        return item.id;
    });
    currentPull = this.getItemsByIds(currentPull);
    var filterKeyValue = {
        key: event.target.closest('li.filter-head').id,
        value: event.target.id
    }
    // var filterKeyValue = this.getKey(this._dataKeys, event.target.id);
   // filterKeyValue = {key: filterKeyValue.type, value: filterKeyValue[event.target.id]};
    var targetPull = currentPull.filter(function(item){
            return item[filterKeyValue.key] == filterKeyValue.value;
        });
    currentBreadCrum.addBreadcrum(event.target.id, targetPull);
    displayContent(targetPull);
}

/*
    The function getItemsById compares id from input array ids and return the
    array of content objects with these identificator.
*/
Content.prototype.getItemsByIds = function(ids){
    var result = this._allData.filter(function(item){
        for(var i = 0; i < ids.length; i++){
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

function Breadcrums (element){
    this._crums = [];
    this._box = document.getElementById(element.box);
    this._crumArrow = this._box.querySelector(element.arrow);
}

Breadcrums.prototype.addBreadcrum = function(title, filteredArray){
    var newCrum = {
        id: 'crum' + (this._crums.length + 1),
        body: title, 
        filteredArray: filteredArray
    }
    this._crums.push(newCrum);
    this.displaySelf();
}

Breadcrums.prototype.moveBack = function(event){
    for(var i = 0; i < this._crums.length; i++){
        if(!(this._crums[i].id == event.target.id)) continue;
        this._crums = this._crums.slice(0, i+1);
        displayContent(this._crums[i].filteredArray);
        this.displaySelf();
        return;
    }
    this._crums = [];
    this.displaySelf();
}

Breadcrums.prototype.displaySelf = function(){
    var self = this;
    deleteAllChildrens(self._box.children.length - 1, self._box);
    self._crums.forEach(function(item){
        var newCrumSpan = document.createElement('span');
        var newCrumArrow = self._crumArrow.cloneNode(true);
        newCrumSpan.classList.add('breadcrum-item');
        newCrumSpan.id = item.id;
        newCrumSpan.innerHTML = item.body;
        newCrumSpan.addEventListener('click', function(){
            self.moveBack(event);
        });
        self._box.appendChild(newCrumSpan);
        self._box.appendChild(newCrumArrow);
    })
}

function displayContent(itemsArray){
    var j;
    var nav = document.getElementById('pagination');
    var contentBox = document.getElementById('content-box');
    deleteAllChildrens(nav.children.length, [nav, contentBox]);
    var itemsOnPage = (function(){
        var width = contentBox.parentElement.offsetWidth;
        rowCount = Math.floor(width/350);
        return rowCount*3;
    })();
    var numOfPages = Math.ceil(itemsArray.length/itemsOnPage);
    for(var i = 0; i < numOfPages; i++){
        var newPage = document.createElement('div');
        newPage.id = 'page' + (i + 1);
        newPage.classList.add('page');
        contentBox.appendChild(newPage);
        (itemsOnPage*(i+1) > itemsArray.length) ? j = -1 : j =  itemsOnPage*(i+1);
        fillPage({
            pageId: i+1,
            content: itemsArray.slice(itemsOnPage*i, j)
        });
        var navItem = document.createElement('div');
        navItem.id = i;
        navItem.innerHTML = i+1;
        navItem.addEventListener('click', showPage);
        nav.appendChild(navItem);
    }

    function fillPage(obj){
        obj.content.forEach(function(item, i, arr){
            var newCont = document.createElement('div');
            var newContTitle = document.createElement('h3');
            var newContAuthor = document.createElement('p');
            var wrapper = document.createElement('div');
            newCont.classList.add('content-item');
            newCont.id = item.id;
            newContTitle.innerHTML = item.theme +'-'+ item.rubric;
            newContAuthor.innerHTML = item.author;
            wrapper.classList.add('titles-content-wrapper');
            wrapper.appendChild(newContAuthor);
            wrapper.appendChild(newContTitle);
            switch(item.type){
                case 'video':{
                    newCont.appendChild(displayVideo(item));
                    newCont.appendChild(wrapper);
                    break;
                };
                case 'text':{
                    var newContA = document.createElement('a');
                    newContA.href = item.url;
                    newContA.appendChild(displayText(item));
                    newContA.appendChild(wrapper);
                    newCont.appendChild(newContA);
                    break;
                };
                case 'audio': {
                    newCont.appendChild(displayAudio(item));
                    newCont.appendChild(wrapper);
                    break;
                }
            }
            document.getElementById('page' + obj.pageId).appendChild(newCont);
        });
        
    }
        function displayAudio (item){
        var newCont = document.createElement('audio');
        var src = document.createElement('source');
        src.src = item.url;
        newCont.setAttribute('controls', 'true');
        newCont.appendChild(src);
        return newCont;
    }
    
    function displayVideo(item){
        var newCont = document.createElement('video');
        var src = document.createElement('source');
        src.src = item.url;
        newCont.setAttribute('controls', 'true');
        newCont.appendChild(src);
        return newCont;
    }
    
    function displayText(item){
        var newContImg = document.createElement('img');
        newContImg.src = item.imgurl;
        return newContImg;
    }
    displayFilters(itemsArray);
    showPage(0);
}

function displayFilters(items){
    var filters = document.getElementById('filters');
    var filterRubrics = filters.getElementsByClassName('title-btn');
    filterRubrics.map = [].map;
    filterRubrics = filterRubrics.map(function(item){
        return item.closest('li');
    });
    var forCopy = filters.querySelector('.filter-item');
    for(var i = 0; i < filterRubrics.length; i++){
        var filtersItems = filterRubrics[i].getElementsByClassName('filter-item');
        filtersItems = (function(){
            var result = [];
            for(var i = 0; i<filtersItems.length; i++){
                result.push(filtersItems[i]);
            } 
            return result;
        })();
        filtersItems.forEach(function(item){
            item.count = 0;
        });
        var filt;
        items.forEach(function(item, j){
            filt = filterRubrics[i].id;
            var marker = false;
            if(item.hasOwnProperty(filt))
            {
                filtersItems.forEach(function(itemF, k){
                    if(item[filt] == itemF.id){
                        marker = true;
                        itemF.count++;
                    }
                })
                if(marker) return;
                var newLi = forCopy.cloneNode(true);
                newLi.id = item[filt];
                newLi.innerHTML = item[filt];
                newLi.count = 1;
                newLi.addEventListener('click', function(){
                    contData.filter(event);
                });
                filtersItems.push = [].push;
                filtersItems.push(newLi);
                filterRubrics[i].querySelector('.dropdown-left-menu').appendChild(newLi);
            }
        });
        for(var j = 0; j<filtersItems.length; j++){
            if( filtersItems[j].count > 0){
                filtersItems[j].style.display = 'inline-block';
                if(filtersItems[j].querySelector('.count') == null){
                    var newChild = document.createElement('span');
                    newChild.classList.add('count');
                    filtersItems[j].appendChild(newChild);
                }
                filtersItems[j].querySelector('.count').innerHTML = '(' + filtersItems[j].count + ')';
            }
            else{
                filtersItems[j].style.display = 'none';
            }
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

function deleteAllChildrens(i, items){
    if(items instanceof Array){
        for(i; i > 0; i--)
        {
            for(var j = 0; j< items.length; j++){
                items[j].removeChild(items[j].children[i-1]);
            }
        }
        return;
    }
    for(i; i > 0; i--)
    {
        items.removeChild(items.children[i-1]);
    }
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

// function parseFilter(inputFilter){
//     var parsedFilter = [];
//     return parsedFilter;
// }


//---------------------------------------------

var contData = new Content('content_data.json');
var currentBreadCrum = new Breadcrums({
    box: 'breadcrums',
    arrow: '.breadcrums-arrow'
});

contData.uploadData();
addEvListFilters();
function addEvListFilters(){
    var filter = document.getElementById('filters');
    filter = filter.getElementsByClassName('filter-item');
    for(var i = 0; i < filter.length; i++){
        filter[i].addEventListener('click', function(){
            contData.filter(event);
        });
    }
}

document.getElementById('all').addEventListener('click', function(){
    displayContent(contData._allData);
    currentBreadCrum.moveBack(event);
});

// (function(){
//     window.onresize = function(e){
//         var currentPull = getDisplayedContent();
//         displayContent(contData.getItemsByIds(currentPull));
//     }
// })();

