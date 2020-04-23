const budgetController = (function() {
    
    const data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        available: 0,
        percentage: -1
    };
    
    const Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    
    const Expense = function (id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.pc = -1;
    };
    
    const calcTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum.toFixed(2);
    }
    
    Expense.prototype.calcPercent = function(totalinc) {
        if (totalinc>0) {
            this.pc = Math.round(this.value / totalinc * 100);
        }
    }
    
    Expense.prototype.getPercent = function() {
        return this.pc
    }

    return {    // this {} OBJECT is assigned to the budgetController constiable, after the IIFE returns
        addItem: function(input) {
            if (data.allItems[input.type].length > 0) {
                lastindex = data.allItems[input.type].length - 1;
                id = data.allItems[input.type][lastindex].id + 1;
            } else {
                id = 0;
            }
            
            let newItem;
            
            if (input.type === 'inc') {
                newItem = new Income(id, input.desc, input.value);
            } else {
                newItem = new Expense(id, input.desc, input.value);
            }
            
            data.allItems[input.type].push(newItem);
            data.totals[input.type] += input.value;
//            console.log(data.totals);
            return newItem
        },
        
        delItem: function(itemId, type) {
            const ids = data.allItems[type].map(function(cur){
                return cur.id;
            })
            
            const index = ids.indexOf(itemId);
            
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calcBudget: function() {
            calcTotal('inc');
            calcTotal('exp');
            data.available = (data.totals.inc - data.totals.exp).toFixed(2);
            if (data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            }
        },
        
        calcPercent: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercent(data.totals.inc);
            });
        },
        
        getPercent: function() {
            const allPc = data.allItems.exp.map(function(cur){
                return cur.getPercent()
            })
            return allPc
        },
        
        getBudget: function() {
            return {
                available: data.available,
                incTotal: data.totals.inc,
                expTotal: data.totals.exp,
                expPc: data.percentage
            }
        }
        
        }
    
})();


const UIController = (function(){

    const DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        delButton: '.item__delete--btn',
        availableLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        expensespcLabel: '.budget__expenses--percentage',
        incExpContainer: '.container',
        expPcLabel: '.item__percentage'
    };
    
    function updateTotalFontSize(available,maxavailable,minfontsize,maxfontsize) {
        console.log(available);
        let fsize = Math.round((maxavailable-minfontsize)*available/maxavailable);
        fsize = Math.max(minfontsize, fsize);
        fsize = Math.min(maxfontsize, fsize);
        document.querySelector(DOMstrings.availableLabel).style.fontSize = fsize+'px';
    }
    
    return {
        getDOMstrings: function() {
            return DOMstrings
        },
        
        getUserInput: function() {
            const inputObj = {
                type: document.querySelector(DOMstrings.inputType).value, 
                desc: document.querySelector(DOMstrings.inputDesc).value, 
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                };
            return inputObj
        },
        
        getSwitchInput: function(item, type) {
            const valstr = item.querySelector('.item__value').textContent;
            const value = parseFloat(valstr.split(' ')[1]);
//            console.log(valstr, value);
            const inputObj = {
                type: type, 
                desc: item.querySelector('.item__description').textContent,
                value: value
                };
            return inputObj
        },
        
        addListItem: function(obj, type) {
            let htmlstr;
            
            if (type === 'inc') {
                htmlStr = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div><div class="item__switch"><button class="item__switch--btn"><i class="ion-arrow-swap"></i></button></div> </div></div>';
            } else {
                htmlStr = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%pc%/%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
//                const pc = obj.calcPercent();
//                htmlStr = htmlStr.replace('%pc%', pc);
            }
            
            
            htmlStr = htmlStr.replace('%id%', obj.id).replace('%desc%', obj.desc).replace('%value%', obj.value);
            
            document.querySelector('.'+ type +'__list').insertAdjacentHTML('beforeend', htmlStr);
            
            UIController.clearFields();
            
        },
        
        clearFields: function() {
            let fields;
            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); // trick to convert list to array
//            fieldsArr.forEach(function(current, index, array){
//                current.value = "";
//            });
            fieldsArr[1].select();
        },
        
        delListItem: function(elemId){
            const element = document.getElementById(elemId);
            element.parentNode.removeChild(element);
        },
        
        updateTotals: function(totals){
            console.log(totals)
            document.querySelector(DOMstrings.availableLabel).textContent = totals.available;
            document.querySelector(DOMstrings.incomeLabel).textContent = '+ ' + totals.incTotal;
            document.querySelector(DOMstrings.expensesLabel).textContent = '- ' + totals.expTotal;
            if (totals.expPc > 0) {
                document.querySelector(DOMstrings.expensespcLabel).textContent = totals.expPc + '%';
            } else {
                document.querySelector(DOMstrings.expensespcLabel).textContent = '';
            }
            updateTotalFontSize(totals.available,1000,16,100);
        },
        
        updatePercents: function(percents) {
            //
            const fields = document.querySelectorAll(DOMstrings.expPcLabel);
//            console.log(fields);
            
            const nodeListForEach = function(nodelist, callback) {
                for (let i=0; i<nodelist.length; i++){
                    callback(nodelist[i], i);
                }
            }
            
            nodeListForEach(fields, function(current, index) {
                //
                current.textContent = percents[index] + '%';
            });
        },
        
        toggleInputOutlines: function() {
            arr = ['inputType', 'inputDesc', 'inputValue'];
            arr.forEach(s => {
                o = document.querySelector(DOMstrings[s])
                o.classList.toggle('red-focus');
            })
            document.querySelector(DOMstrings.addButton).classList.toggle('red');
        }
                
    }
})();


const controller = (function(budgetControl, UIControl){
    let input, item, totals;
    
    const DOMstrings = UIControl.getDOMstrings();
    
    const setupEventListeners = function() {
            document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAddItem);
            document.addEventListener('keypress', function(event) {
                if (event.code === 'Enter'){
                    ctrlAddItem();
                }
            });
            document.querySelector(DOMstrings.incExpContainer).addEventListener('click', ctrlChangeItem);
            document.querySelector(DOMstrings.inputType).addEventListener('change', UIControl.toggleInputOutlines);
            
    };
    
    const updateBudget= function(){
        budgetControl.calcBudget();
        totals = budgetControl.getBudget();
        UIControl.updateTotals(totals);
    };
    
    const updatePercent = function() {
        budgetControl.calcPercent();
        const percents = budgetControl.getPercent();
        UIControl.updatePercents(percents);
    }
    
    const ctrlAddItem = function(){
        input = UIControl.getUserInput();
        if (input.desc !== 'test' && !isNaN(input.value) && input.value > 0) {
            item = budgetControl.addItem(input);
            UIControl.addListItem(item, input.type);
            updateBudget();
            updatePercent();
        }
//        console.log(item)
    };
    
    const ctrlChangeItem = function(event){
        const obj = event.target.parentNode.parentNode;
        const actionType = obj.className;
        const element = obj.parentNode.parentNode;
        const itemIdStr = element.id;
        
        if (itemIdStr) { 
            let [type, itemId] = itemIdStr.split('-');
            itemId = parseInt(itemId);
            
            if (actionType === 'item__delete') {
                _ctrlDelItem(itemIdStr, itemId, type);
            
            } else if (actionType === 'item__switch') {
//                console.log('item switch detected');
                console.log(element);
                _ctrlSwitchItem(element, itemIdStr, itemId, type);
            }
            updateBudget();
            updatePercent();
        }
    };
    

    const _ctrlDelItem = function(itemIdStr, itemId, type){
        budgetControl.delItem(itemId, type);
        UIControl.delListItem(itemIdStr);
    };

    const _ctrlSwitchItem = function(element, itemIdStr, itemId, type){
        input = UIControl.getSwitchInput(element, type);
        _ctrlDelItem(itemIdStr, itemId, type);

        if (input.type === 'inc') {
            input.type = 'exp';
        } else {
            input.type = 'inc';
        }
        item = budgetControl.addItem(input);
        UIControl.addListItem(item, input.type);
    };

    return {
        init: function() {
            console.log('init start');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();

