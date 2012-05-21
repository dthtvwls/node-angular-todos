mongoose = require('mongoose').connect 'mongodb://localhost/todos'
express  = require 'express'

# Mongoose model
Todo = mongoose.model 'Todo', new mongoose.Schema
  title: String, done: Boolean

# Express config
app = express.createServer().configure ->
  @use express.logger()
  @use express.bodyParser()
  @use express.methodOverride()
  @use @router
  @use express.static 'public'
  @use express.errorHandler
    dumpExceptions: true
    showStack: true
.listen 3000

# read
app.get '/todos', (req, res)-> Todo.find (err, todos)-> res.send todos

# update
app.post '/todos', (req, res)->
  for todo in req.body
    Todo.update { _id: todo._id }, { title: todo.title, done: todo.done }, { upsert: true }, (err)->
      console.log err if err
  res.send()
  #Todo.update {}, req.body, { multi: true }, (err)->
  #  console.log err
  #  res.send()
