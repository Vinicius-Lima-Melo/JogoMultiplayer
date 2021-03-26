var userName;
var pecaP;
var jogadorLogado = [];

socket.on('getRanking', (ranking) => {
    console.log(ranking);
    $('.trPlayer').remove();
    ranking.forEach((r) => {
        $('table').append('<tr class="trPlayer"><td class="bold">'+r.rank+'</td><td>'+r.item.name+'</td><td>'+r.item.pontos+'</td></tr>');
    });
});

socket.on('jogadores_posicoes', function(jogadores_posicoes){
    $('.jogadores').remove();
    Object.keys(jogadores_posicoes).forEach((jogador_posicao) => {
        if (jogador_posicao != userName) {
            socket.emit("atualizaFrame", jogador_posicao);
            $("#"+jogador_posicao).remove();
            $("#box-game").append('<div class="jogadores" id="'+jogador_posicao+'"></div>');
            $("#"+jogador_posicao).css({
                top: jogadores_posicoes[jogador_posicao].positionY,
                left: jogadores_posicoes[jogador_posicao].positionX
            }); 
        }
    });
});

socket.on('getPeca', function(peca){
    $('.peca').remove();
    $("#box-game").append('<div class="peca"></div>');
    pecaP = peca;
    $(".peca").css('top', peca.py);
    $(".peca").css('left', peca.px);
})

$(document).on('keyup', function(key) {
    let toPosition = [];
    toPosition['positionX'] = $('.jogadorLogado')[0].offsetLeft;
    toPosition['positionY'] = $('.jogadorLogado')[0].offsetTop
    moverJogador(key.code, toPosition);
});



function start(){
    var positionX = Math.floor(Math.random() * 9) * 50;
    var positionY = Math.floor(Math.random() * 9) * 50;
    $(".jogadorLogado").css('top', positionY);
    $(".jogadorLogado").css('left', positionX);
    
    socket.emit('novoJogador', userName, positionX, positionY, function(data){
        if (data) {
            socket.emit('getJogadores');
            $("#playerName").css('display', 'none');
            $("#btnStart").css('display', 'none');
            $("#box-game").css('display', 'block');
            jogadorLogado['positionY'] = positionY;
            jogadorLogado['positionX'] = positionX;
            console.log("Nome: "+userName+" Px: "+positionX, "Py: "+positionY);
        }
        else alert("Erro");
    });
}

// MOVENDO JOGADOR
function atualizarPosicaoJogadorLogado(code){
    if(code == 'ArrowUp' || code == 'w'){
        jogadorLogado['positionY'] = jogadorLogado['positionY'] - 50;
        if (jogadorLogado['positionX'] == pecaP.px && jogadorLogado['positionY'] == pecaP.py) {
        }
        socket.emit('moverJogador', 
            jogadorLogado.positionX, 
            jogadorLogado.positionY
        );
    }
    else if(code == 'ArrowDown' || code == 's'){
        jogadorLogado['positionY'] = jogadorLogado['positionY'] + 50;
        if (jogadorLogado['positionX'] == pecaP.px && jogadorLogado['positionY'] == pecaP.py) {
        }
        socket.emit('moverJogador', 
            jogadorLogado.positionX, 
            jogadorLogado.positionY
        );
    }
    else if(code == 'ArrowLeft' || code == 'a'){
        jogadorLogado['positionX'] = jogadorLogado['positionX'] - 50;
        if (jogadorLogado['positionX'] == pecaP.px && jogadorLogado['positionY'] == pecaP.py) {
        }
        socket.emit('moverJogador', 
            jogadorLogado.positionX, 
            jogadorLogado.positionY
        );
    }
    else if(code == 'ArrowRight' || code == 'd'){
        jogadorLogado['positionX'] = jogadorLogado['positionX'] + 50;
        if (jogadorLogado['positionX'] == pecaP.px && jogadorLogado['positionY'] == pecaP.py) {
        }
        socket.emit('moverJogador', 
            jogadorLogado.positionX, 
            jogadorLogado.positionY
        );
    }
}

function moverJogador(code, position) {
    var newPosition;
    if(code == 'ArrowUp' || code == 'w'){
        newPosition = position.positionY - 50;
        if (newPosition >= 0) {
            atualizarPosicaoJogadorLogado(code)
            $(".jogadorLogado").css('top', newPosition);
        }
    }
    else if(code == 'ArrowDown' || code == 's'){
        newPosition = position.positionY + 50;
        if (newPosition <= 450) {
            atualizarPosicaoJogadorLogado(code)
            $(".jogadorLogado").css('top', newPosition);
        }
    }
    else if(code == 'ArrowLeft' || code == 'a'){
        newPosition = position.positionX - 50;
        if (newPosition >= 0) {
            atualizarPosicaoJogadorLogado(code)
            $(".jogadorLogado").css('left', newPosition);
        }
    }
    else if(code == 'ArrowRight' || code == 'd'){
        newPosition = position.positionX + 50;
        if (newPosition <= 450) {
            atualizarPosicaoJogadorLogado(code)
            $(".jogadorLogado").css('left', newPosition);
        }
    }
}