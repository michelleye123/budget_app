var budgetController = (function() {
    
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };
    
    var Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    
    var Expense = function (id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    
    Expense.prototype.calcPercent = function() {
        return this.value / data.totals.inc * 100
    }


    // calc budget


    return {    // this {} OBJECT is assigned to the budgetController variable, after the IIFE returns
        addItem: function(input) {
            console.log(input.type);

            if (data.allItems[input.type].length > 0) {
                lastindex = data.allItems[input.type].length - 1;
                id = data.allItems[input.type][lastindex].id + 1;
            } else {
                id = 0;
            }
            
            if (input.type === 'inc') {
                var newItem = new Income(id, input.desc, input.value);
            } else {
                var newItem = new Expense(id, input.desc, input.value);
            }
            
            data.allItems[input.type].push(newItem);
            data.totals[input.type] += input.value;
            return newItem
        },
        publicproperty: 5,
        pubdata: data
    }
    
})();


var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn'
    };

// update UI after budget calc
    
    return {
        getDOMstrings: function() {
            return DOMstrings
        },
        getInput: function() {
            var inputObj = {
                type: document.querySelector(DOMstrings.inputType).value, 
                desc: document.querySelector(DOMstrings.inputDesc).value, 
                value: document.querySelector(DOMstrings.inputValue).value
                };
            return inputObj
        },
        addListItem: function(obj, type) {
            var htmlstr;
            
            if (type === 'inc') {
                htmlStr = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else {
                htmlStr = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%pc%/%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                var pc = obj.calcPercent();
                htmlStr = htmlStr.replace('%pc%', pc);
            }
            
            
            htmlStr = htmlStr.replace('%id%', obj.id).replace('%desc%', obj.desc).replace('%value%', obj.value);
            
            document.querySelector('.'+ type +'__list').insertAdjacentHTML('beforeend', htmlStr);
            
        },
        
        clearFields: function() {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); // trick to convert list to array
//            fieldsArr.forEach(function(current, index, array){
//                current.value = "";
//            });
            
//            fieldsArr[1].focus();            
            fieldsArr[1].select();
            
        },
        
        rmListItem: function(id, type){
            //
        }
    }
})();


var controller = (function(budgetControl, UIControl){
    var input, newItem;
    
    var DOMstrings = UIControl.getDOMstrings();
    
    var setupEventListeners = function() {
            document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAddItem);
    
            document.addEventListener('keypress', function(event) {
                if (event.code === 'Enter'){
                    ctrlAddItem();
                }
            });
    };
    
    var ctrlAddItem = function(){
        input = UIControl.getInput();
        item = budgetControl.addItem(input);
        UIControl.addListItem(item, input.type);
        UIControl.clearFields();
        // calc budget
        // display budget in UI
//        console.log(item)
    };
    

    return {
        init: function() {
            console.log('init start');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();