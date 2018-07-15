var search = document.getElementById('search');

search.addEventListener('click', showSearchDialog);
search.nextElementSibling.querySelector('.close-btn').addEventListener('click', hideSearchDialog);

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

var slider = document.getElementById('slider');
var imgs = slider.getElementsByTagName('figure');
var sliderBox = document.getElementById('slider-box');
var mainSlider = new Slider(sliderBox);
slider.firstElementChild.addEventListener('click', mainSlider.slideRight);
slider.lastElementChild.addEventListener('click', mainSlider.slideLeft);
sliderBox.addEventListener('mouseover', pauseInterval);
sliderBox.addEventListener('mouseout', continueInterval);
var intervalId = setInterval(mainSlider.slideLeft, 5000);
startInterval.start = performance.now();

function startInterval(pause = 0){
   var duration = 5000 - pause;
   intervalId = setInterval(mainSlider.slideLeft, duration);
   startInterval.start = performance.now();
   console.log(performance.now());
}

function pauseInterval(){
    pauseInterval.dur = performance.now() - startInterval.start;
    clearInterval(intervalId);
}

function continueInterval(){
    startInterval(pauseInterval.dur);
}

function Slider(sliderBox){
    this.boxWidth = sliderBox.offsetWidth;
    this.imgs = sliderBox.getElementsByClassName('slider_figure');
    this.currentImgs = [];
    this.previousImgs = [];
    this.displayed = 0;
    var self = this;

    initialise();

    self.show = function(isLeft){
        var margin = calcMargin();
        self.currentImgs.forEach(function(item, i, arr){
            delTransition(item);
            if(isLeft){
                item.style.left = 100 + '%';
            }
            else{
                item.style.left = -100 + '%';
            }
        })
        if(isLeft){
            i = 0;
            setTimeout(function slide(){
                addTransition(self.currentImgs[i]);
                move(self.currentImgs[i], i, margin);
                if((i+1) < self.currentImgs.length){
                    i++;
                    setTimeout(slide, 200);
                }
                else startInterval();
            }, 200); 
        }
        else{
            i = self.currentImgs.length - 1;
            setTimeout(function slide(){
                addTransition(self.currentImgs[i]);
                move(self.currentImgs[i], i, margin);
                if(i > 0){
                    i--;
                    setTimeout(slide, 200);
                }
                else startInterval();
            }, 200); 
        }
    }

    self.hide = function(isLeft){
        if(isLeft){
            var j = 0;
            setTimeout(function slide(){
                    self.previousImgs[j].style.left = -100 + '%';
                    if((j+1) < self.previousImgs.length){
                        j++;
                         setTimeout(slide, 200);
                    }
                    else{
                         self.show(isLeft);
                     }
                }, 200);
             }
        else{
            var j = self.previousImgs.length - 1;
            setTimeout(function slide(){
                    self.previousImgs[j].style.left = 100 + '%';
                    if(j > 0){
                        j--;
                         setTimeout(slide, 200);
                    }
                    else{
                         self.show(isLeft);
                     }
                }, 200);
             }
    }

    self.slideLeft = function(){
        clearInterval(intervalId);
        self.previousImgs = self.currentImgs;
        self.hide(true);
        self.currentImgs = [];
        var i;
        ((self.displayed + self.previousImgs.length) < self.imgs.length) ? i = self.displayed += self.previousImgs.length : i = self.displayed += self.previousImgs.length - self.imgs.length;
        while((calcWidth() + self.imgs[i].offsetWidth) < self.boxWidth){
            self.currentImgs.push(imgs[i]);
            i++;
            (i < self.imgs.length) ? i = i : i = 0;
        }
    }

    self.slideRight = function(){
        clearInterval(intervalId);
        self.previousImgs = self.currentImgs;
        self.hide(false);
        self.currentImgs = [];
        var i;
        (self.displayed - self.previousImgs.length > 0) ? i = self.displayed -= self.previousImgs.length : i = self.displayed = self.imgs.length - self.displayed - self.previousImgs.length;
        while((calcWidth() + self.imgs[i].offsetWidth) < self.boxWidth){
            self.currentImgs.push(imgs[i]);
            i++;
            (i < self.imgs.length) ? i = i : i = 0;
        }
    }

    function calcWidth(){
        return self.currentImgs.reduce(function(width, current){
            return width + current.offsetWidth;
        }, 0);
    }

    function calcMargin(){
    	var margin;
    	if(self.currentImgs.length <= 1)
    	{
    		margin = (self.boxWidth - calcWidth())/2;
    		return margin;
    	}
        margin = (self.boxWidth - calcWidth())/(self.currentImgs.length - 1);
        return margin;
    }

    function move(img, i, margin){
    	if(self.currentImgs.length < 2 ){
    		img.style.left = margin + 'px';
    		return;
    	}
        img.style.left = i*(calcWidth()/self.currentImgs.length + margin) + 'px';
    }

    function initialise(){
        for(var i = 0; i < self.imgs.length; i++){
            if ((calcWidth() + self.imgs[i].offsetWidth) > self.boxWidth) break;
            self.currentImgs.push(imgs[i]);
        }
        var margin = calcMargin();
        self.currentImgs.forEach(function(item, i, arr){
            move(item, i, margin);
            addTransition(item);
        })
    }

    function delTransition(item){
        item.style.transition = 'none';
    }

    function addTransition(item){
        item.style.transition = 'all 0.5s';
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