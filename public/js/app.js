var todomvc = angular.module('todomvc', []);

var Todos = function($scope, $http) {

  // collection
  $scope.todos = [];

  // read
  $http.get('/todos').success(function(data) {
    $scope.todos = (function() { return JSON.stringify(data) && data; })();
  });

  // update
  $scope.$watch('todos', function() {
    var isEditing = $scope.todos.filter(function(val) {
      return val.editing;
    }).length;

    if (!isEditing) {
      $http.post('/todos', JSON.stringify($scope.todos));
    }
  }, true);

  $scope.todoForms = {
    0: "You're done!",
    one: '{} item left',
    other: '{} items left'
  };

  $scope.addTodo = function() {
    if (this.newTodo.trim().length === 0) {
      return;
    }

    $scope.todos.push({
      title: this.newTodo,
      done: false,
      editing: false
    });

    this.newTodo = '';
  };

  $scope.editTodo = function(todo) {
     //cancel any active editing operation
    $scope.todos.forEach(function(val) {
      val.editing = false;
    });
    todo.editing = true;
  };

  $scope.finishEditing = function(todo) {
    if (todo.title.trim().length === 0) {
      $scope.removeTodo(todo);
    } else {
      todo.editing = false;
    }
  };

  $scope.removeTodo = function(todo) {
    for (var i = 0, len = $scope.todos.length; i < len; ++i) {
      if (todo === $scope.todos[i]) {
        $scope.todos.splice(i, 1);
      }
    }
  };

  $scope.remainingTodos = function() {
    return $scope.todos.filter(function(val) {
      return !val.done;
    });
  };

  $scope.doneTodos = function() {
    return $scope.todos.filter(function(val) {
      return val.done;
    });
  }

  $scope.clearDoneTodos = function() {
    $scope.todos = $scope.remainingTodos();
  };

  $scope.markAllDone = function() {
    var markDone = true;
    if (!$scope.remainingTodos().length) {
      markDone = false;
    }
    $scope.todos.forEach(function(todo) {
      todo.done = markDone;
    });
  };
};
