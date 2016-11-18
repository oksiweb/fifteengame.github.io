(function() {


    var battleField = document.getElementsByClassName('battle-field')[0];
    var mixButton = document.getElementById('mix');

    var order = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    function create() {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < 16; i++){
            var element = document.createElement('div');
            fragment.appendChild(element);
        }
            battleField.appendChild(fragment);
    }

    function fill() {
        [].forEach.call(battleField.children, function(item,i){
            item.setAttribute('id', i);
            item.textContent = order[i] ;
        })
    }

    function swap(x,y) {
        var t = order[x];
        order[x] = order[y];
        order[y] = t;
    }

    function solvable(arr) {
         for (var disorder = 0, i = 1, len = arr.length-1; i < len; i++){
            for (var j = i-1; j >= 0; j--){
                if (arr[j] > arr[i]) disorder++;
            }
         }
         return !(disorder % 2);
    };

    function mixElements() {
        order.sort(function() { return Math.random()-0.5; });
        battleField.addEventListener('click', puzzleClick);
        if (!solvable(order)){
            swap(0, 1);
        }
        fill();
    };

    var  move= {up: -4, left: -1, down: 4, right: 1};

    function shiftCell(targetId){
        for(var key in move){
            var newId = Number(targetId) + move[key];
            if (newId <16 && newId >=0) {
                var side = document.getElementById(newId);
                if(side && side.textContent === ''){
                    side.textContent = event.target.textContent;
                    event.target.textContent = '';
                }

            }
        }

    }

	function isCompleted() {
	    var win = [].map.call(battleField.children, function(item){
	         return item.textContent;
	    }).filter(function(item) { return item != '' }).every(function(item, i) {
	    return +item === i+1;
	    });
		if (win) {
			[].forEach.call(battleField.children, function(item,i){
                item.textContent = 'win' ;
            })
		}
	}

    function puzzleClick(event) {
        var targetId = event.target.id;
        shiftCell(targetId);
        isCompleted()
    }

    create();
    fill();
    mixButton.addEventListener( 'click', mixElements);

})();




