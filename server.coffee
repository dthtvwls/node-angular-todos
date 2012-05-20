mongoose = require('mongoose').connect 'mongodb://localhost/todos'
express  = require 'express'

# Mongoose model
Todo = mongoose.model 'Todo', new mongoose.Schema
  content: String
  done:    Boolean
  order:   Number

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

# create
app.post '/todos', (req, res)->
  todo = new Todo req.body
  todo.save (err)-> res.send todo

# read
app.get '/todos', (req, res)->
  Todo.find (err, todos)-> res.send todos

# update
app.put '/todos/:id', (req, res)->
  Todo.findById req.params.id, (err, todo)->
    todo.content = req.body.content
    todo.done    = req.body.done
    todo.order   = req.body.order
    todo.save (err)-> res.send todo

# destroy
app.delete '/todos/:id', (req, res)->
  Todo.findById req.params.id, (err, todo)->
    todo.remove (err)-> res.send ''
