import { DOMstrings } from "./views/base";

export const data = {
  allItems: {
    exp: [],
    inc: []
  },

  totals: {
    exp: 0,
    inc: 0
  },

  budget: 0,

  percentage: -1
};

// UI CONTROLLER...
var UIcontroller = (function() {
  var formatNumbers = function(num, type) {
    var numSpilt, int, dec, type;
    /*
            1. + or - before number...
            2.Exactly two points after int number...
            3.thousand seperated by comma , ....
  
            ex.
            2310.4567->2,310.46.
        */
    num = Math.abs(num);
    num = num.toFixed(2);
    numSpilt = num.split(".");
    int = numSpilt[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    dec = numSpilt[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  // NODE LIST FUNCTION FOR QSALL METHOD WE ALWAYS USED IT.IT IS POWERFULL METHOD...
  const nodeListForEach = (list, callback) => {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function() {
      return {
        type: DOMstrings.inputType.value,
        description: DOMstrings.inputDesciption.value,
        value: parseFloat(DOMstrings.inputValue.value)
      };
    },

    addListItem: function(obj, type) {
      var html, newhtml, element;

      // Create html Strings with placeholdertext...

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div > ';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual data...

      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%description%", obj.description);
      newhtml = newhtml.replace("%value%", formatNumbers(obj.value, type));

      // Insert the html into DOM...

      element.insertAdjacentHTML("beforeend", newhtml);
    },

    deletelistItems: function(selectorId) {
      var element = document.getElementById(selectorId);

      element.parentNode.removeChild(element);
    },

    // CLEARFIELD METHOD IS FOR CLEARING VALUE AND DESCRIPTION FROM DESCRIPTION AND VALUE UI AND PUT FOCUS BACK TO DESCRIPTION AGAIN...
    clearFields: function() {
      var fields, fieldsArray;

      fields = document.querySelectorAll(
        ".add__description" + "," + ".add__value"
      );

      fieldsArray = Array.from(fields);

      fieldsArray.forEach(current => {
        current.value = "";
      });

      fieldsArray[0].focus();
    },

    // DISPLAY BUDGET ON TOP OF THE WEBPAGE OF APPLICATION...
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      DOMstrings.budgetLabel.textContent = formatNumbers(obj.budget, type);
      DOMstrings.incomeLabel.textContent = formatNumbers(obj.totalInc, "inc");
      DOMstrings.expensesLabel.textContent = formatNumbers(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        DOMstrings.percentagelabel.textContent = obj.percentage + "%";
      } else {
        DOMstrings.percentagelabel.textContent = "---";
      }
    },

    // DISPLAY PERCENTAGES OF EXPENCES IN EXPENSE FIELD...
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(".item__percentage");

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          percentages[index] = "---";
        }
      });
    },

    // DISPLAYING CURRRENT MONTH AND YEAR ON TOP OF THE APPLICATION...
    displayDate: function() {
      var now, year, months, index;

      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      year = now.getFullYear();

      index = now.getMonth();

      document.querySelector(".budget__date").textContent =
        months[index] + ", " + year;
    },

    // CHANGING OULINE OF THE INPUT FIELDS AND ENTER BUTTON AS WELL...
    changedOutline: function() {
      var fields = document.querySelectorAll(
        ".add__type" + "," + ".add__description" + "," + ".add__value"
      );

      nodeListForEach(fields, function(current) {
        current.classList.toggle("red-focus");
      });
      DOMstrings.inputBtn.classList.toggle("red");
    }
  };
})();

// BUDGET CONTROLLER....
var budgetController = (function() {
  // FUNCTION CONSTRUCTOR OF INCOMES...
  var Incomes = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // FUNCTION CONSTRUCTOR OF THE EXPENSE...
  var Expences = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expences.prototype.calcPercentages = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expences.prototype.getPercentages = function() {
    return this.percentage;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },

    totals: {
      exp: 0,
      inc: 0
    },

    budget: 0,

    percentage: -1
  };

  return {
    addItems: function(type, des, val) {
      var newItem, ID;

      // creat new id...
      //.
      //[1 2 3 4 5],next id =6
      // [1 2 5 6 7],next id=8
      // ID=lastID+1;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on 'inc' or 'exp'...
      if (type === "exp") {
        newItem = new Expences(ID, des, val);
      } else if (type === "inc") {
        newItem = new Incomes(ID, des, val);
      }

      // push items into data structure...
      data.allItems[type].push(newItem);

      // return our new item...
      return newItem;
    },

    deleteItems: function(type, ID) {
      var index, ids;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(ID);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // CALCULATE THE TOTAL INCOME AND EXPENCES...
      calculateTotal("inc");
      calculateTotal("exp");

      // CALCULATE THE BUDGET:INCOME-EXPENCES...

      data.budget = data.totals.inc - data.totals.exp;

      // CALCULATE THE PERCENTAGE OF INCOME THAT WE SPEND ...

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(current) {
        current.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function() {
      var arrayPercentages = data.allItems.exp.map(function(current) {
        return current.getPercentages();
      });
      return arrayPercentages;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

// BUTTON CONTROLLER...
var appController = (function(budgetCtrl, UICtrl) {
  var setupEventLisners = function() {
    DOMstrings.inputBtn.addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    DOMstrings.container.addEventListener("click", ctrlDeleteItem);

    DOMstrings.inputType.addEventListener("change", UICtrl.changedOutline);
  };

  var updateBudget = function() {
    // 1.Calucalte the budget...

    budgetCtrl.calculateBudget();

    // 2.return the budget...

    var budget = budgetCtrl.getBudget();

    // 3.Display the budget on the UI...'

    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1.calculate percentages...

    budgetCtrl.calculatePercentages();

    //2.read it from data structure...

    var percentages = budgetCtrl.getPercentages();

    //3.update the UI with percentages...

    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItems;

    // 1.GET FILLED INPUT DATA..

    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2.ADD ITEM TO THE BUDGET CONTROLLLER..

      newItems = budgetCtrl.addItems(
        input.type,
        input.description,
        input.value
      );

      // 3. ADD NEW ITEM TO THE UI ...

      UICtrl.addListItem(newItems, input.type);

      // 4. Clear the html fields after inserting a data ...

      UICtrl.clearFields();

      // 5.CALCULATE AND UPDATE THE BUDGET...

      updateBudget();

      // 6.calculate and update percentages...

      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    // itemID IS ARRAY LIKE inc-1,inc-2 etc...

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");

      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1.DELETE THE ITEM FROM DATA STRUCTURE ...

      budgetCtrl.deleteItems(type, ID);

      //2.DELETE THE ITEM FROM UI...

      UICtrl.deletelistItems(itemID);

      //3.UPDATE AND SHOW THE UPDATED BUDGET...

      updateBudget();

      //4.UPDATE AND CALCULATE THE PERCENTAGES OF EXPENSES...

      updatePercentages();
    }
  };

  return {
    init: function() {
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalExp: 0,
        totalInc: 0,
        percentage: -1
      });
      setupEventLisners();
    }
  };
})(budgetController, UIcontroller);

appController.init();
