const grpc  = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync('todo.proto',{});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bindAsync("0.0.0.0:40000",grpc.ServerCredentials.createInsecure(),(err, port) => {
  if (err) {
    console.error('Error binding server:', err);
    return;
  }
  console.log(`Server running at http://0.0.0.0:${port}`);
  server.start();
});

server.addService(todoPackage.Todo.service,{
    "createTodo":createTodo,
    "readTodos":readTodos,
    "readTodosStream":readTodosStream
});

const todos = []


  function createTodo(call, callback) {
    const todoItem = {
      id: todos.length + 1, // Generate a new ID based on the length of the array
      text: call.request.text,
    };
    todos.push(todoItem); // Store the newly created todo item
    callback(null, todoItem); // Send the response back to the client
  }


  function readTodos(call, callback) {
    // Return the list of todos
    callback(null, { items: todos });
  }

  function readTodosStream(call) {
    todos.forEach((todo) => {
      console.log('Streaming todo:', todo);
      call.write(todo)
    });
   
    call.end();
  }
  