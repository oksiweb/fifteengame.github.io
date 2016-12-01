/**
 *  View
 */
var view = {
    /**
     *  get elements from DOM
     */
    battleField : document.getElementsByClassName('battle-field')[0],
    mixButton :   document.getElementById('mix'),
    /**
     *  create and draw game's field
     *
     *  @this {view}
     */
    create: function() {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < 16; i++){
            var element = document.createElement('div');
            fragment.appendChild(element);
        }
        this.battleField.appendChild(fragment);
    },
    /**
     *  fill cells with numbers
     *
     *  @this {view}
     *  @param {array} arr - numbers from 1 to 15 (any order)
     */
    fill: function(arr) {
        [].forEach.call(this.battleField.children, function(item,i){
            item.setAttribute('data-item', i);
            item.textContent = arr[i] ;
        })
    },

    /**
     *  swap the cells
     */
    swapCells:function(a,b){
        a.textContent = b.textContent;
        b.textContent = '';
    },
    /**
     *  fill cells with word 'win'
     */
    drawWin: function(item){
        item.textContent = 'win' ;
    }


};

/**
 *  Model
 */
var model = {
    /**
     *  source array
     */
    order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    /**
     *  set data to the localStorage
     *
     *  @param {array} arr - numbers from 1 to 15 (any order)
     */
    set: function(arr){
        localStorage.setItem("arr", arr);
    },
    /**
     *  get data to the localStorage
     *
     */
    get: function(){
        var data = localStorage.getItem("arr") || false;
        if(data){
            return data.split(',');
        }else{
            return false;
        }
    },
    /**
     *  swap two numbers
     *
     *  @param {array} arr - array
     *  @param {number} x - index in array
     *  @param {number} y - index in array
     *  @return {array} arr - new array
     */
    swap: function(x,y,arr) {
        var t = arr[x];
        arr[x] = arr[y];
        arr[y] = t;
        return arr;
    },
    /**
     * Check if the game can be solved
     *
     * @param {array} arr - numbers from 1 to 15 (any order)
     * @return {boolean} true or false
     */
    solvable: function(arr){
        for (var disorder = 0, i = 1, len = arr.length-1; i < len; i++){
            for (var j = i-1; j >= 0; j--){
                if (arr[j] > arr[i]) disorder++;
            }
        }
        return !(disorder % 2);
    },
    /**
     *  mix elements, if game can not be solved, swap two elements
     *
     *  @this {model}
     *  @return {array} arr - new array
     */
    mixElements: function() {
        var data = model.get();
        data = data.sort(function() {
            return Math.random()-0.5;
        });
        if (!this.solvable(data)){
            data = this.swap(0, 1, data);
        }
        if(data.length<16){
            data = data.concat('');
        }
        this.set(data);
        return data;
    },
    /**
     *  change cells and set data to the localStorage
     *
     *  @this {model}
     *  @param {number} a - index of the first element in the array
     *  @param {number} b - index of the second element in the array
     */
    changeCell: function(a,b){
        var arr = model.get();
        var data = this.swap(a,b,arr);
        this.set(data);
    }
};

/**
 *  Controller
 */
var controller = {
    /**
     *  Check if the order of the numbers is expected (from 1 to 15), change view to drawWin
     */
    isCompleted: function() {
	    var win = [].map.call(view.battleField.children, function(item){
	         return item.textContent;
	    }).filter(function(item) { return item != '' }).every(function(item, i) {
	    return +item === i+1;
	    });
		if (win) {
			[].forEach.call(view.battleField.children, function(item,i){
                view.drawWin(item);
            })
		}
	},
	/**
     *  directions array
     */
    move:  {up: -4, left: -1, down: 4, right: 1},
    /**
     *  puzzleClick is event handler, swap the positions of the cells and then check the game is completed
     */
    puzzleClick: function(event) {
        var targetItem = event.target.getAttribute('data-item');
        for(var key in controller.move){
            var newItem = Number(targetItem) + controller.move[key];
            if (newItem <16 && newItem >=0) {
                var side = document.querySelectorAll('div[data-item="'+newItem+'"]')[0];
                    if(side && side.textContent === ''){
                        var a = newItem;
                        var b = event.target.getAttribute('data-item');
                        model.changeCell(a,b)
                        view.swapCells(side,event.target)
                    }
            }
        }
        controller.isCompleted()
    },
    /**
     *  mix elements, draw view
     */
    newGame: function(){
        var data = model.mixElements();
        view.fill(data);
        view.battleField.addEventListener('click', controller.puzzleClick);
    }

};


/**
 *  IIFE
 */
;(function(){
    /**
     *  game-app
     */
    var app = {
        /**
         *  check localStorage, draw view and init events
         */
        init: function(){
            if(model.get()===false){
                model.set(model.order);
            }
            var data = model.get();
            view.create();
            view.fill(data);
            this.eventButton();
            if(data.length>15){
                this.event();
            }
        },
        event: function(){
            view.battleField.addEventListener('click', controller.puzzleClick);
        },
        eventButton: function(){
            view.mixButton.addEventListener('click', controller.newGame);
        }
    };
    /**
     *  game state
     */
    app.init();
})()


