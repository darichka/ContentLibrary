var search = document.getElementById('search');

search.addEventListener('click', showSearchDialog);
search.nextElementSibling.querySelector('.close-btn').addEventListener('click', hideSearchDialog);

function showSearchDialog(event){
    search.nextElementSibling.open = true;
}
function hideSearchDialog(event){
    if(search.nextElementSibling.open){
        search.nextElementSibling.open = false;
    }
}

var slider = document.getElementById('slider');
var imgs = slider.getElementsByTagName('figure');
var mainSlider = new Slider(imgs);
var showNext = mainSlider.showNext;
slider.firstElementChild.addEventListener('click', mainSlider.showPrevious);
slider.lastElementChild.addEventListener('click', mainSlider.showNext);
setInterval(mainSlider.showNext, 3000);

function Slider(imgs){
    this.imgs = imgs;
    this.currentImgId = 0;
    if(imgs.length) imgs[this.currentImgId].style.display = 'inline-block';

    var self = this;

    self.showNext = function(){
        self.imgs[self.currentImgId].style.display = 'none';
        (self.currentImgId < self.imgs.length-1) ? self.currentImgId++ : self.currentImgId = 0;
        self.imgs[self.currentImgId].style.display = 'inline-block';
    }

    self.showPrevious = function(){
        self.imgs[self.currentImgId].style.display = 'none';
        (self.currentImgId > 0) ? self.currentImgId-- : self.currentImgId = self.imgs.length-1;
        self.imgs[self.currentImgId].style.display = 'inline-block';
    }
}

// Slider.prototype.showNext = function(){
//     this.imgs[this.currentImgId].style.display = 'none';
//     (this.currentImgId < this.imgs.length) ? this.currentImgId++ : this.currentImgId = 0;
//     this.imgs[this.currentImgId].style.display = 'inline-block';
// };

// Slider.prototype.showPrevious = function(){
//     this.imgs[this.currentImgId].style.display = 'none';
//     (this.currentImgId > 0) ? this.currentImgId-- : this.currentImgId = this.imgs.length-1;
//     this.imgs[this.currentImgId].style.display = 'inline-block';
// };