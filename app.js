// Import needed packages
var express = require('express')
var mongoose = require('mongoose')
var bodyParse = require('body-parser')
var app = express()

// Declare port
let port = process.env.PORT || 3000

// Connect to mongoDB
const conn = mongoose.connect('mongodb://localhost:27017/myTodoDatabase')
try {
    if (conn) {
        console.log('Successfully connected.')
    } else {
        console.log('Connection failed!')
    }
} catch (err) {
    console.log("ERROR: ", err)
}

// Create Shema and model for database
let myTodoModel = new mongoose.Schema({
    todo_head: {
        type: String,
        required: true
    },
    todo_name: {
        type: String,
        required: true
    },
    todo_status: {
        type: Boolean,
        default: false,
        require: true
    }
})
let myTodoSchema = mongoose.model('todos', myTodoModel)

// this empty array help to retrive all values from db and display it OR you can use forEach
var todos1 = []

// Give which view engine you want to use
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParse.urlencoded({ extended: true }))

// Render all task OR values in main page
app.get('/', async (req, res) => {
    var todos2 = await myTodoSchema.find({})
    res.render('index', { todos1:todos2 })
})

// To insert new todo OR value
app.post('/', async (req, res) => {
    await myTodoSchema.insertMany({
        todo_head: req.body.todo_head,
        todo_name: req.body.todo_name,
        todo_status: false
    }).then(console.log('Inserted.')).catch(err => console.log("ERROR: ", err))
    res.redirect('/')
})

// Delete after compelete the todo OR task
app.post('/delete/:id', async (req, res) => {
    try {
        const result = await myTodoSchema.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (err) {
        console.log('ERROR: ', err)
    }
})

// PORT Listning
app.listen(port, () => {
    console.log(`My Server is running at port no.: ${port}`)
})
