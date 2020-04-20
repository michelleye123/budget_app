var budgetController = (function() {
    var privatevar = 32;    // not accessible e.g. "budgetController.privatevar > undefined"
    
    // add new item to data structure



    // calc budget


    
    return {    // this {} OBJECT is assigned to the budgetController variable, after the IIFE returns
        publicmethod: function() {    // accessible e.g. "budgetController.publicfunction
            console.log('publicvars');
        },
        publicproperty: 5
    }
    
})();


var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn'
    };

// add new item to UI

// update UI after budget calc
    
    return {
        getDOMstrings: function() {
            return DOMstrings
        },
        getinput: function() {
            var inputObj = {
                type: document.querySelector(DOMstrings.inputType).value, 
                desc: document.querySelector(DOMstrings.inputDesc).value, 
                val: document.querySelector(DOMstrings.inputValue).value
                };
            return inputObj
        }
    }
})();


var controller = (function(budgetControl, UIControl){
    
    var DOMstrings = UIControl.getDOMstrings();
    
    var ctrlAddItem = function(){
        // get data
        input = UIControl.getinput();
        // add to budget controller
        // add to UI
        // calc budget
        // display budget in UI
        console.log(input)
    };
    
    // add event handler
    document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event) {
        if (event.code === 'Enter'){
            ctrlAddItem();
        }
    });
    
    return {
        y: budgetControl.publicproperty
    }
})(budgetController, UIController);

