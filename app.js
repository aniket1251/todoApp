const express = require("express");
const mongoose = require("mongoose"); 
require('dotenv').config()
const _ = require("lodash");
const date = require(__dirname + "/date.js");

// --API

// --APP CONFIG
const app = express();
app.set("view engine", "ejs");

// -- Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


//-- Database
mongoose.connect(`mongodb+srv://aniket12:${process.env.password}@cluster0.qluet.mongodb.net/toDoListDB`);
let day = date.day(); 

const itemsSchema = {
  name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Wake Up"
});
const item2 = new Item({
  name: "ughh..., Sleep, what will you even do after waking up"
});
const item3 = new Item({
  name: "Wake up BUB!!, Yeah Wolverine has come"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res)=>{
    

  Item.find({}, (err, foundItems)=>{
    if(foundItems.length ===0 ){
      Item.insertMany(defaultItems, (err)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("sucessfully loaded data");
          res.redirect("/");
        }
      });
    }
    else{
      res.render("list", {titleList: day, newListItems: foundItems});
    }
  });

    
  });
  
  // -- Api Routes

  app.post("/", (req,res)=>{
    const item = req.body.newItem;
    const currentListName = req.body.list;
    const newItem = new Item({
      name: item
    });
    
    if(currentListName === day){
      newItem.save();  
      res.redirect("/"); 
    }
    else{
      List.findOne({name: currentListName}, (err, foundList)=>{
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+ currentListName);
      });
 }
    
  });

  app.post("/delete", (req,res)=>{
    const id = req.body.checkbox;
    const currentList = req.body.listName;

    if(currentList === day){

      Item.findByIdAndDelete(id, (err)=>{
        if(err){
          console.log(err);
        }
        res.redirect("/");
      });
    }
    else{
      List.findOneAndUpdate(
        {name: currentList},
         {$pull: {items: {_id: id}}},
         (err, foundList)=>{
           if(!err){
             res.redirect("/"+ currentList);
           }
         });
    }

    
  });
  
app.get("/:listType", (req,res)=>{
  const costumList = _.capitalize(req.params.listType);

  List.findOne({name: costumList}, (err, foundList)=>{
    if(!err){
      if(!foundList){
        const requestedList = new List({
          name: costumList,
          items: defaultItems
        });
        requestedList.save();
        console.log("made the list");
        res.redirect("/" + costumList);
      
      }
    
  else
  {
    res.render("list", {titleList: foundList.name, newListItems: foundList.items});
  }
}   
  });

 
});

// -- listen command
app.listen("3000", ()=>{
    console.log("the server has started");
});