const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    	origin: "http://localhost",
	    methods: ["GET", "POST"],
	    allowedHeaders: ["my-custom-header"],
	    credentials: true
  },
});
server.listen(process.env.PORT || 8080);
console.log('Servidor rodando na porta 8080...');
		var ranked = require('ranked');

// var ranked = require('ranked');
// const languages = [
//   { name: 'Javascript', year: 1995 },
//   { name: 'Java', year: 1995 },
//   { name: 'C#', year: 2001 },
//   { name: 'Groovy', year: 2003 },
//   { name: 'Scala', year: 2003 },
//   { name: 'Go', year: 2009 },
// ];
// const jogadores = [
// {
// 	Vinicius: {'pontos': 2},
// 	Ana: {'pontos': 10},
// 		Vivi: {'pontos': 30}
// 	}
// ]

// console.log(jogadores);
// const scoreFn = jogador => jogador.pontos;
// var rankedItems = ranked.ranking(jogadores, scoreFn);
// console.log(rankedItems);




var peca = null;

async function criarPeca(){
	var px = Math.floor(Math.random() * 9) * 50;
    var py = Math.floor(Math.random() * 9) * 50;
    peca = {px,py};
}

jogadores = {};
ranking = [];

conexoes = [];

criarPeca();

io.on('connection', function(socket){
	conexoes.push(socket);

	//Disconnect
	socket.on('disconnect',function(data){
		// jogadores.splice(jogadores.indexOf(socket.username), 1);
		// atualizarJogadores();
		// conexoes.splice(conexoes.indexOf(socket),1);
		// console.log('Disconnected: %s sockets disconnected',conexoes.length);
	});	



	socket.on('novoJogador',function(name, positionX, positionY,callback){
		callback(true);
		socket.username = name;
		let u = {'name':name, 'pontos': 0};
		ranking.push(u);
		atualizarJogadores();
		atualizarRanking();

		jogadores[name] = {positionX,positionY};
		console.log(ranking);
		if (peca == null) {
			criarPeca();
		}
		else{
			io.to(socket.id).emit('getPeca', peca);
		}
	});

	socket.on('getJogadores',function(){
		socket.emit('jogadores_posicoes', jogadores);
	});
	
	socket.on('moverJogador',function(positionX, positionY){
		console.log("> Jogador: "+socket.username+" se moveu");
		jogadores[socket.username] = {positionX,positionY};
		if (positionY == peca.py && positionX == peca.px) {
			console.log("> "+socket.username+" pegou uma peca");
			for ( i = 0; i < ranking.length; i++) {
				if (ranking[i].name == socket.username) {
					ranking[i].pontos++;
					atualizarRanking();
				}
			}
			criarPeca();
			io.sockets.emit('getPeca', peca);
		}
		socket.broadcast.emit('atualizarPosicoes', jogadores);
		atualizarJogadores();
	});

	socket.on('pegarPeca', (user)=> {
		console.log("O jogador + "+user+" pegou uma peca");
		criarPeca();
		console.log(peca);
		io.sockets.emit('getPeca', peca);
	});

	const scoreFn = jogador => jogador.pontos;

	function atualizarJogadores() {
		io.sockets.emit('jogadores_posicoes', jogadores);
	}
	function atualizarRanking(){
		var rankedItems = ranked.ranking(ranking, scoreFn);
		io.sockets.emit('getRanking', rankedItems);
	}
});
