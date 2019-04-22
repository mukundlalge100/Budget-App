

export default class Expense { 
  constructor(id,description,value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

calcPercentages(totalIncome) {
    if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
    }
    else {
        this.percentage = -1;
    }
};

getPercentages() {
    return this.percentage;
};
  
}