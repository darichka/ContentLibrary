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
var mainSlider = new Slider(slider.children[1]);
slider.firstElementChild.addEventListener('click', mainSlider.slideRight);
slider.lastElementChild.addEventListener('click', mainSlider.slideLeft);
// setInterval(mainSlider.showNext, 3000);

// function Slider(imgs){
//     this.imgs = imgs;
//     this.currentImgId = 0;
//     if(imgs.length) imgs[this.currentImgId].style.display = 'inline-block';

//     var self = this;

//     self.showNext = function(){
//         self.imgs[self.currentImgId].style.display = 'none';
//         (self.currentImgId < self.imgs.length-1) ? self.currentImgId++ : self.currentImgId = 0;
//         self.imgs[self.currentImgId].style.display = 'inline-block';
//     }

//     self.showPrevious = function(){
//         self.imgs[self.currentImgId].style.display = 'none';
//         (self.currentImgId > 0) ? self.currentImgId-- : self.currentImgId = self.imgs.length-1;
//         self.imgs[self.currentImgId].style.display = 'inline-block';
//     }
// }


function Slider(sliderBox){
    this.boxWidth = sliderBox.offsetWidth;
    this.imgs = sliderBox.getElementsByClassName('slider_figure');
    this.currentImgs = [];
    this.previousImgs = [];
    this.displayed = 0;
    var self = this;

    self.show = function(isLeft){
        var margin = (self.boxWidth - calcWidth())/(self.currentImgs.length - 1);
        var i = 0;
            setTimeout(function slide(){
                if(isLeft){
                    self.currentImgs[i].style.left = 100 + '%';
                }
                else{
                    self.currentImgs[i].style.left = -100 + '%';
                }
                self.currentImgs[i].style.transition = 'all 1s';
                self.currentImgs[i].style.left = i*(calcWidth()/self.currentImgs.length + margin) + 'px';
                if((i+1) < self.currentImgs.length){
                    i++;
                    setTimeout(slide, 200);
                }
            }, 100);
    }

    self.hide = function(isLeft){
        var j = 0;
        setTimeout(function slide(){
            if(isLeft){
                self.previousImgs[j].style.left = -100 + '%';
                
            }
            else{
                self.previousImgs[j].style.left = 100 + '%';
                self.previousImgs[j].style.transition = 'none';
            }
            if((j+1) < self.previousImgs.length){
                j++;
                setTimeout(slide, 200);
            }
            else{
                self.show(isLeft);
            }
        }, 200);
    }

    for(var i = 0; i < self.imgs.length; i++){
        if ((calcWidth() + self.imgs[i].offsetWidth) > self.boxWidth) break;
        self.currentImgs.push(imgs[i]);
    }
    self.show(true);

    self.slideLeft = function(){
        self.previousImgs = self.currentImgs;
        self.hide(true);
        self.currentImgs = [];
        var i;
        console.log(self.displayed + self.previousImgs.length);
        ((self.displayed + self.previousImgs.length) < self.imgs.length) ? i = self.displayed += self.previousImgs.length : i = self.displayed += self.previousImgs.length - self.imgs.length;
        while((calcWidth() + self.imgs[i].offsetWidth) < self.boxWidth){
            self.currentImgs.push(imgs[i]);
            i++;
            (i < self.imgs.length) ? i = i : i = 0;
        }
}

self.slideRight = function(){
    self.previousImgs = self.currentImgs;
    self.hide(false);
    self.currentImgs = [];
    var i;
   console.log(self.displayed - self.previousImgs.length);
    (self.displayed - self.previousImgs.length > 0) ? i = self.displayed -= self.previousImgs.length : i = self.displayed = self.imgs.length - (self.displayed + 1) ;
    while((calcWidth() + self.imgs[i].offsetWidth) < self.boxWidth){
        self.currentImgs.push(imgs[i]);
        i--;
        (i > 0) ? i = i : i = self.imgs.length - 1;
    }
}

    function calcWidth(){
        return self.currentImgs.reduce(function(width, current){
            return width + current.offsetWidth;
        }, 0);
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