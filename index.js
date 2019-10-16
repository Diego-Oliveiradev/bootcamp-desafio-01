//Instanciando a dependencia do express
const express = require('express'); 

//criando uma variável para a função
const server = express();

//Solicitando que seja utilizado o json
server.use(express.json());

const users = ['Diego', 'Claudio', 'Victor', 'Davi'];

server.use((req, res, next) =>{
  console.time('Request');
  console.log(`Meétodo: ${req.method}; URL: ${req.url}`);
  
  next();

  console.timeEnd('Request');
});
// função para verificar se o usuário existe
function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({ error:'User name is required'});
  }

  return next();
}

function checkUserInArray(req, res, next){
  const user = users[req.params.index];
  
  if(!user){
    return res.status(400).json({ error:'usuário não existe no sistema, por favor verificar as informações descritas!'});
  }

  req.user = user;
  return next();
}

//Listar todos os usuarios
server.get('/users', (req, res) =>{

  return res.json(users);

});

// req para parametro
// res resposta
//server.get('/users',(req, res) => {                         ******** 1  
// definir variavél para pegar os valores do query params     ******** 1
//const nome = req.query.nome;                                ******** 1 
//return res.json({message: `Hello ${nome}`});                ******** 1 

//server.get('/users/:id',(req, res) => {                     ******** 2      
// definir variavél para pegar os valores do Route params     ******** 2
//buscar o id                                                 ******** 2
//const id = req.params.id;                                   ******** 2
//const { id } = req.params;                                  ******** 2
//return res.json({message:`Buscando o usuario ${id}`});      ******** 2

  server.get('/users/:index', checkUserInArray,(req, res) => {              //  ******** 3
  //const { index } = req.params;                           //  ******** 3
  //return res.json(users[index]);                          //  ******** 3
  return res.json(req.user);

  //return res.send('Hell Word');
  
});

// Criando uma rota para o create do usuário
server.post('/users', checkUserExists,(req, res) => {
  // criando uma const dizendo que pegará o que foi escrito no body
  const {name} = req.body;
  // adicionando o res na lista deu usuário
  users.push(name);

  // retornando a lista
  return res.json(users);
});

server.put('/users/:index', checkUserExists,(req, res) => {
  // cria a const para pegar o index params
  const { index } = req.params;
  // const para pegar o body escrito no insomina
  const {name} = req.body;

  //altera o conteudo do index peloname
  users[index] = name;

  // retorno a lista de usuarios
  return res.json(users);

});

server.delete('/users/:index', checkUserInArray,(req, res) =>{
  const { index } = req.params;
  // percorre o vetor e deleta a posição escolhida
  users.splice(index, 1);

  //return res.json(users);
  return res.send();

})
//informando a porta que será utilizada na url
server.listen(3000);