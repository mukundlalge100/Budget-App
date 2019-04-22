import { uniqid } from "uniqid";

import data from '../index';  

export default class Income { 
  constructor(id,description,value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  addIncomeItem(des,val) {
            
    const ID = uniqid();
    console.log(uniqid);
    //create new item based on 'inc' or 'exp'... 
    
    const newItem=new Income(ID,des,val);
    // push items into data structure...
    data.allItems[type].push(newItem);

    // return our new item...
    return newItem;
}


}