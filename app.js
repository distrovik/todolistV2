const express = require("express");
const app = express();
const port = 420;
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

//const items = ["Buy Food","Cook Food","Eat Food"];
//const workItems = [];

mongoose.connect("mongodb+srv://nixnicksnix:Darkstar96@cluster0.hstk6kt.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

const itemSchema = {
  name: {
    type: String,
    required: [true, "No Data entered!"],
  },
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your to do list!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item,",
});

const item3 = new Item({
  name: "Click on checkbox to remove an item.",
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems)
// .then( () => {
//     console.log("Successfully saved default items to DB");
//   }).catch(err => {
//     console.log(err);
//   });

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log("Server started on port " + port);
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems);
        res.redirect("/");
      } else {
        res.render("home", { listTitle: day, newListItems: foundItems });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  const day = date.getDate();

  //   res.render("home", {listTitle: day, newListItems: defaultItems});
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === date.getDate()) {

  item.save();

  // const item = req.body.newItem;

  // if (req.body.list === "Work") {
  //     workItems.push(item);
  //     res.redirect("/work")
  // } else {
  //     items.push(item);
  //     res.redirect("/");
  // }
  res.redirect("/");
  } else {
    List.findOne({name: listName})
    .then ( (foundList)=>{
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
    })
  }

});

app.post("/delete", (req, res) => {
  const itemName = req.body.checkedBox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.findByIdAndRemove(itemName)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    List.findOne({name:listName})
    .then ((foundList) => {
        foundList.items.pull({_id: itemName});
        foundList.save()
        .then (()=>{
            res.redirect("/"+listName);
        });

    });
    }
  
});

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", (req, res) => {

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName})

  .then ((foundList) => {
    
        if (!foundList){

            const list = new List({
                name: customListName,
                items: defaultItems,
              });
            
              list.save();
              
              res.redirect("/"+customListName)

        } else {
            res.render("home", {listTitle: foundList.name, newListItems: foundList.items});
        }

    })
    .catch( (err)=>{
        console.log(err);
    })


});

// app.get("/work", (req, res) => {
//   res.render("home", { listTitle: "Work List", newListItems: workItems });
// });

// app.post("/work", (req, res) => {
//   const item = req.body.newItem;

//   workItems.push(item);

//   res.redirect("/work");
// });

// app.get("/about", (req, res) => {
//   res.render("about");
// });
