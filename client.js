const grpc  = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync('todo.proto',{});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo('localhost:40000',grpc.credentials.createInsecure())

const text = process.argv[2];
client.createTodo({
  'id':-1,
  'text': text
},(err, response) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Received from Server:', JSON.stringify(response));
})

// client.readTodos({}, (err, response) => {
//     if (err) {
//       console.error('Error:', err);
//       return;
//     }
//    if(response.items){
//     response.items.forEach((i) => {
//       console.log(i.text);
//     });
//    }
//   });

const call = client.readTodosStream();
call.on('data', (items) => {
  console.log('Recieved item from server ' + JSON.stringify(items));
});

call.on('end', (e) => {
  console.log('Server Done!');
});