const express = require("express");
const bodyParser = require("body-parser")
const mongoose=require("mongoose")
const _=require("lodash")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')

mongoose.connect("mongodb+srv://varad:abcd1234@cluster0.zsfzfrb.mongodb.net/todolistDB",{useNewUrlParser:true})

const itemsSchema=new mongoose.Schema({
    name:String
})

const Item=mongoose.model("item",itemsSchema)

const item1=new Item({
    name:"Buy Items"
})

const item2=new Item({
    name: "Cook Food"
})

const item3=new Item({
    name: "Eat Food"
})


const defaultItems=[item1,item2,item3]

//item1.save()

const listSchema={
    name: String,
    items: [itemsSchema]
}

const List=mongoose.model("List",listSchema)


app.get("/", function (req, res) {

    Item.find(function(err,items){
        if(items.length===0){
            Item.insertMany([item1,item2,item3],function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("Insert-many successful")
                }
            })
            res.redirect("/")
        }else{
            res.render("list", { listTitle: "Today", newListItems: items })
        }
    })

    
})

app.get("/:CLname",function(req,res){
    const CLname=_.capitalize(req.params.CLname)
    List.findOne({name:CLname},function(err,doc){
        if(doc){
            res.render("list", { listTitle: CLname, newListItems: doc.items })
        }else{
            const list=new List({
                name: CLname,
                items: defaultItems
            })
        
            list.save()
            res.redirect("/"+CLname)
        }
    })
    
})

app.post("/", function (req, res) {
    var itemName = req.body.newValue

    const listName=req.body.list

    const newItem=new Item({
        name:itemName
    })

    if(listName=="Today"){
        newItem.save()
        res.redirect("/")
    }else{
        List.findOne({name:listName},function(err,foundList){
            console.log(listName)
            foundList.items.push(newItem)
            foundList.save()
            res.redirect("/"+listName)
        })
    }
    
})

app.post("/delete",function (req,res){
    const checkedItemId=req.body.checkbox
    const listName=req.body.listName

    if(listName=="Today"){
        Item.findByIdAndRemove(checkedItemId.trim(),function(err){
            if(!err){
                console.log("Successfully deleted checked item.")
                res.redirect("/")
            }
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId.trim()}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName)
            }
        })
    }
})




app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems })
})

app.listen(3000, function () {
    console.log("Server started on port 3000")
})