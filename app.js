const express = require("express");
const bodyParser = require("body-parser")
const mongoose=require("mongoose")
const date=require(__dirname+"/date.js")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')







app.get("/", function (req, res) {
    var day=date()

    res.render("list", { listTitle: day, newListItems: items })
})

app.post("/", function (req, res) {
    var item = req.body.newValue
    if (req.body.list == "Work") {
        workItems.push(item)
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect("/")
    }
})

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems })
})

app.listen(3000, function () {
    console.log("Server started on port 3000")
})