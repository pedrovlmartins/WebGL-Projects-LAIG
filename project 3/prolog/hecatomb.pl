:- use_module(library(random)).
% Tabuleiro inicial do jogo (segundo as regras fornecidas no site).
% Cada valor representa uma das quatro peças existentes.
% 1 e 2 representam, respetivamente, um soldado do jogador preto (o) e um soldado do jogador branco (x).
% 3 e 4 representam, respetivamente, o rei do jogador preto (o) e o rei do jogador branco (x).
% 0 representa uma casa sem nenhuma peça (ainda que, no tabuleiro inicial, todas as casas estejam preenchidas).
startingBoard([
        [1, 1, 1, 1, 3, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[2, 2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 4, 2, 2, 2]]
        ).		
		
% Predicado que inicia o jogo.
% Disponibiliza ao utilizador as opções de jogo existentes.
start :-
	nl, write('         + - + - + - + - + - + - + - +'), nl, nl,
	 write('         - - >  H E C A T O M B  < - -'), nl, nl,
	 write('         + - + - + - + - + - + - + - +'), nl, nl,
	 write('Bem-vindo ao meu primeiro projeto de Programacao em Logica!'), nl,
	 write('Existem tres modos de jogo disponivel. Por favor escolha um:'), nl, nl,
	 write('1 - Humano contra Humano.'), nl,
	 write('2 - Humano contra Computador.'), nl,
	 write('3 - Computador contra Computador.'), nl,
	 write('4 - Sair do programa.'), nl, nl,
	 repeat,
	 write('Opcao (entre 1 e 4) = '),
	 read(Option),
	 checkOption(Option), !, 
	 startingBoard(Board),
	 playGame(Option, Board).

% Predicados playGame/2 iniciam o modo de jogo respetivo consoante a escolha do utilizador.
playGame(1, Board) :-
	nl, nl, write('        - + - + - + - +  + - + - + - + - + - + -'), nl, nl,
	write('        - - >  H U M A N O vs H U M A N O  < - -'), nl, nl,
	write('        - + - + - + - +  + - + - + - + - + - + -'), nl,
	Turn is 1, Captures is 0, Player is 1, humanVsHuman(Turn, Player, Captures, Board).	
playGame(2, Board) :-
	nl, nl, write('    - + - + - + - +  + - + - + - + - + - + - + - + -'), nl, nl,
	write('    - - >  H U M A N O vs C O M P U T A D O R  < - -'), nl, nl,
	write('    - + - + - + - +  + - + - + - + - + - + - + - + -'), nl,
	selectLevel(2, Level),
	Turn is 1, Captures is 0, Player is 1, humanVsComputer(Turn, Player, Captures, Board, Level).
playGame(3, Board) :-
	nl, nl, write('- + - + - + - +  + - + - + - + - + - + - + - + - + - + -'), nl, nl,
	write('- - >  C O M P U T A D O R vs C O M P U T A D O R  < - -'), nl, nl,
	write('- + - + - + - +  + - + - + - + - + - + - + - + - + - + -'), nl,
	selectLevel(3, OneLevel), selectLevel(4, TwoLevel),
	drawBoard(Board, 0, 1), nl, Turn is 1, Captures is 0, Player is 1, computerVsComputer(Turn, Player, Captures, Board, OneLevel, TwoLevel).

% Humano contra Humano.
humanVsHuman(_, Player, Captures, Board) :- % Condição de terminação (GameOver).
	checkGameOver(Board, IsGameOver, Player, Captures), IsGameOver == true, !,
	nl, nl, nl, write('      - - - - - F I M    D O    J O G O  - - - - -'), nl,
	drawBoard(Board, 0, 1), nl, nl, writeMessageOfGameOver(Player, Captures).
humanVsHuman(Turn, Player, Captures, Board) :-
	checkGameOver(Board, IsGameOver, Player, Captures), IsGameOver == false, !,
	nl, nl, write('             - - - - - T U R N O '), write(Turn), write(' - - - - -'), nl,
	drawBoard(Board, Player, 1), nl, nl, nl,
	convertPlayer(Player), nl,
	repeat, 
	selectPiece(Player, Board, PieceLine, PieceColumn, PieceLetterColumn, IsKing, SelectPieceValidity), SelectPieceValidity == true, !,
	writeSelectedHumanPiece(IsKing, PieceLine, PieceLetterColumn),
	repeat,
	selectDestiny(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, DestinyLetterColumn, IsKing, DestinyPieceValidity), DestinyPieceValidity == true, !,
	movePiece(Board, PieceLine, PieceColumn, DestinyLine, DestinyColumn, NewBoard, Captures, NewCaptures),
	writeDestinationHumanPiece(IsKing, PieceLine, PieceLetterColumn, DestinyLine, DestinyLetterColumn, NewCaptures),
	NewTurn is Turn + 1, changePlayers(Player, NewPlayer), humanVsHuman(NewTurn, NewPlayer, NewCaptures, NewBoard).

% Humano contra Computador.
humanVsComputer(_, Player, Captures, Board, _) :- % Condição de terminação (GameOver).
	checkGameOver(Board, IsGameOver, Player, Captures), IsGameOver == true, !,
	nl, nl, nl, write('      - - - - - F I M    D O    J O G O - - - - -'), nl,
	drawBoard(Board, 0, 1), nl, nl, writeMessageOfGameOver(Player, Captures).
humanVsComputer(Turn, 1, Captures, Board, Level) :- % Turno do humano.
	checkGameOver(Board, IsGameOver, 1, Captures), IsGameOver == false, !,
	nl, nl, write('            - - - - - T U R N O '), write(Turn), write(' - - - - -'), nl, nl,
	write('                - - - H U M A N O - - -'), nl,
	drawBoard(Board, 1, 1), nl, nl, nl,
	convertPlayer(1), nl,
	repeat, 
	selectPiece(1, Board, PieceLine, PieceColumn, PieceLetterColumn, IsKing, SelectPieceValidity), SelectPieceValidity == true, !,
	writeSelectedHumanPiece(IsKing, PieceLine, PieceLetterColumn),
	repeat,
	selectDestiny(1, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, DestinyLetterColumn, IsKing, DestinyPieceValidity), DestinyPieceValidity == true, !,
	movePiece(Board, PieceLine, PieceColumn, DestinyLine, DestinyColumn, NewBoard, Captures, NewCaptures),
	writeDestinationHumanPiece(IsKing, PieceLine, PieceLetterColumn, DestinyLine, DestinyLetterColumn, NewCaptures),
	NewTurn is Turn + 1, drawBoard(NewBoard, 1, 1), nl, nl, nl,
	write('  - - - - - F I M   D O   T U R N O   H U M A N O - - - - -'), nl, nl, nl, 
	repeat,
	write('Humano contra Computador. Opcoes disponiveis: '), nl,
	write('''j.'' - turno do computador (o computador realiza uma jogada).'), nl, write('''q.'' - termina o jogo.'), nl, write('''s.'' - termina o programa.'), nl,
	write('Opcao: '), read(PlayBot), checkTurnPlay(PlayBot), !,
	humanVsComputer(NewTurn, 2, NewCaptures, NewBoard, Level).
humanVsComputer(Turn, 2, Captures, Board, Level) :- % Turno do computador.
	checkGameOver(Board, IsGameOver, 2, Captures), IsGameOver == false, !,
	nl, nl, write('           - - - - - T U R N O '), write(Turn), write(' - - - - - -'), nl, nl,
	write('        - - - - - C O M P U T A D O R - - - - -'), nl, nl, nl,
	repeat,
	random(1, 9, PieceLine), random(1, 9, PieceColumn),
	validatePieceSelection(2, Board, PieceLine, PieceColumn, IsKing, true, SelectValidity), SelectValidity == true, !,
	writeSelectedBotPiece(IsKing, PieceLine, PieceColumn),
	repeat,
	random(1, 9, DestinyLine), random(1, 9, DestinyColumn),
	validateDestinySelection(2, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, IsKing, true, DestinyValidity), DestinyValidity == true, !,
	movePiece(Board, PieceLine, PieceColumn, DestinyLine, DestinyColumn, NewBoard, Captures, NewCaptures),
	writeDestinationBotPiece(IsKing, DestinyLine, DestinyColumn, NewCaptures),
	drawBoard(NewBoard, 2, 1), nl, nl, 
	NewTurn is Turn + 1, nl, write('  - - - - - F I M   D O   T U R N O   C O M P U T A D O R - - - - -'), nl, nl, nl,
	repeat,
	write('Humano contra Computador. Opcoes disponiveis: '), nl,
	write('''j.'' - turno do humano (o humano realiza uma jogada).'), nl, write('''q.'' - termina o jogo.'), nl, write('''s.'' - termina o programa.'), nl,
	write('Opcao: '), read(PlayHuman), checkTurnPlay(PlayHuman), !,
	humanVsComputer(NewTurn, 1, NewCaptures, NewBoard, Level).
	
% Computador contra Computador
computerVsComputer(_, Player, Captures, Board, _, _) :- % Condição de terminação (GameOver).
	checkGameOver(Board, IsGameOver, Player, Captures), IsGameOver == true, !,
	nl, nl, nl, write('      - - - - - F I M    D O    J O G O  - - - - -'), nl,
	drawBoard(Board, 0, 1), nl, nl, writeMessageOfGameOver(Player, Captures).
computerVsComputer(Turn, Player, Captures, Board, OneLevel, TwoLevel) :-
	checkGameOver(Board, IsGameOver, Player, Captures), IsGameOver == false, !,
	nl, nl, write('           - - - - - T U R N O '), write(Turn), write(' - - - - -'), nl, nl, nl, 
	repeat,
	write('Computador contra Computador. Opcoes disponiveis: '), nl,
	write('''j.'' - o computador realiza uma jogada.'), nl, write('''q.'' - termina o jogo.'), nl, write('''s.'' - termina o programa.'), nl,
	write('Opcao: '), read(PlayBot1), checkTurnPlay(PlayBot1), !,
	repeat,
	random(1, 9, PieceLine), random(1, 9, PieceColumn),
	validatePieceSelection(Player, Board, PieceLine, PieceColumn, IsKing, true, SelectValidity), SelectValidity == true, !, nl,
	writeSelectedBotPiece(IsKing, PieceLine, PieceColumn),
	repeat,
	random(1, 9, DestinyLine), random(1, 9, DestinyColumn),
	validateDestinySelection(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, IsKing, true, DestinyValidity), DestinyValidity == true, !,
	movePiece(Board, PieceLine, PieceColumn, DestinyLine, DestinyColumn, NewBoard, Captures, NewCaptures),
	writeDestinationBotPiece(IsKing, DestinyLine, DestinyColumn, NewCaptures),
	drawBoard(NewBoard, Player, 1), nl,
	NewTurn is Turn + 1, changePlayers(Player, NewPlayer),
	computerVsComputer(NewTurn, NewPlayer, NewCaptures, NewBoard, OneLevel, TwoLevel).

% Seleciona o nível de jogo para ser usado pelo jogador automático.
selectLevel(2, Level) :- % Caso do Humano vs Computador.
	nl, nl, write('Existem tres niveis disponiveis para o jogador automatico (por ordem de dificuldade): '), nl, nl,
	write('1 - Movimento aleatorio.'), nl,
	write('2 - Captura de pecas adversarias.'), nl,
	write('3 - Aproximacao do rei.'), nl, nl,
	repeat,
	write('Opcao (entre 1 e 3) = '),
	read(Level),
	checkLevel(Level), !.
selectLevel(3, Level) :- % Caso do Computador vs Computador (para o primeiro jogador).
	nl, nl, write('Existem tres niveis disponiveis para um dos jogadores automaticos (por ordem de dificuldade): '), nl, nl,
	write('1 - Movimento aleatorio.'), nl,
	write('2 - Captura de pecas adversarias.'), nl,
	write('3 - Aproximacao do rei.'), nl, nl,
	repeat,
	write('Opcao (entre 1 e 3) para o primeiro jogador = '),
	read(Level),
	checkLevel(Level), !.
selectLevel(4, Level) :- % Caso do Computador vs Computador (para o segundo jogador).	
	nl, repeat,
	write('Opcao (entre 1 e 3) para o segundo jogador = '),
	read(Level),
	checkLevel(Level), !.

% Predicado que escolhe uma peça consoante a escolha do utilizador.
selectPiece(Player, Board, Line, Column, LetterColumn, IsKing, Validity) :-
	write('Escreva as coordenadas da peca que deseja mover (linha/coluna):'), nl,
	repeat, 
	write('Linha (entre 1 e 8) = '), read(Line), checkLine(Line), !,
	repeat,
	write('Coluna (entre a e h, em letras minusculas) = '), read(LetterColumn), checkColumn(LetterColumn, Column), !,
	validatePieceSelection(Player, Board, Line, Column, IsKing, false, Validity).
	
% Validação da escolha de uma peça respeitando as regras do jogo.
validatePieceSelection(Player, Board, Line, Column, IsKing, IsBot, FinalValidity) :-
	getMatrixElement(Board, Column, Line, Element),
	checkIfIsKing(Element, IsKing),
	checkIfIsPlayerPiece(IsBot, Element, Player, IsPlayerPieceValidity), !,
	checkIfCanBeSelected(IsBot, IsPlayerPieceValidity, Board, Element, Column, Line, CanBeSelectedValidity), !,
	checkFinalSelectionValidity(CanBeSelectedValidity, IsPlayerPieceValidity, FinalValidity).

% Predicado que coloca a peça escolhida pelo utilizador na nova posição, também fornecida pelo utilizador.
selectDestiny(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, DestinyLetterColumn, IsKing, Validity) :-
	write('Escreva as coordenadas da posicao para onde deseja mover a peca (linha/coluna):'), nl,
	repeat, 
	write('Linha (entre 1 e 8) = '), read(DestinyLine), checkLine(DestinyLine), !,
	repeat,
	write('Coluna (entre a e h, em letras minusculas) = '), read(DestinyLetterColumn), checkColumn(DestinyLetterColumn, DestinyColumn), !,
	validateDestinySelection(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, IsKing, false, Validity).

% Validação de um movimento de uma peça para a nova posição caso a peça seja um soldado.
validateDestinySelection(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, false, IsBot, FinalValidity) :-
	getMatrixElement(Board, DestinyColumn, DestinyLine, Element),
	checkDestinyPieceValidity(IsBot, Element, Player, DestinyPieceValidity), !,
	checkDirectionValidity(IsBot, PieceLine, DestinyLine, PieceColumn, DestinyColumn, DirectionValidity), !,
	checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, MobilityValidity), !,
	checkFinalDestinyValidity(DestinyPieceValidity, DirectionValidity, MobilityValidity, FinalValidity).
	
% Validação de um movimento de uma peça para a nova posição, caso a peça seja um rei. Auxilio do predicado movableKing.
validateDestinySelection(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, true, IsBot, FinalValidity) :-
	LineDif is PieceLine - DestinyLine, ColumnDif is PieceColumn - DestinyColumn, 
	AbsLineDif is abs(LineDif), AbsColumnDif is abs(ColumnDif),
	movableKing(IsBot, Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, AbsLineDif, AbsColumnDif, FinalValidity).
	
movableKing(false, _, _, _, _, _, _, AbsLineDif, _, false) :- 
	AbsLineDif > 1, nl, !, write('!!! ERRO !!! Um rei so se pode deslocar para posicoes adjacentes. Por favor escolha novamente!'), nl, nl.
movableKing(true, _, _, _, _, _, _, AbsLineDif, _, false) :- 
	AbsLineDif > 1, !. 
movableKing(false, _, _, _, _, _, _, _, AbsColumnDif, false) :- 
	AbsColumnDif > 1, nl, !, write('!!! ERRO !!! Um rei so se pode deslocar para posicoes adjacentes. Por favor escolha novamente!'), nl, nl. 
movableKing(true, _, _, _, _, _, _, _, AbsColumnDif, false) :- 
	AbsColumnDif > 1, !.
movableKing(IsBot, Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, AbsLineDif, AbsColumnDif, FinalValidity) :- 
	AbsLineDif =< 1, AbsColumnDif =< 1, 
	validateDestinySelection(Player, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, false, IsBot, FinalValidity).

% Move a peça para a nova posição, usando os predicados deleteMatrixElement e replaceMatrixElement. Atualiza a variável Captures.
movePiece(Board, PieceLine, PieceColumn, DestinyLine, DestinyColumn, BoardWithNewPiece, Captures, NewCaptures) :-
	getMatrixElement(Board, PieceColumn, PieceLine, OldElement), 
	getMatrixElement(Board, DestinyColumn, DestinyLine, NewElement),
	updateMatrixElement(NewElement, Captures, NewCaptures),
	deleteMatrixElement(Board, PieceColumn, PieceLine, BoardWithoutOldPiece),
	replaceMatrixElement(BoardWithoutOldPiece, DestinyColumn, DestinyLine, OldElement, BoardWithNewPiece).
	
% Atualiza a variavel Captures.
updateMatrixElement(Element, Captures, NewCaptures) :- % quando não há captura, incrementa a variável.
	Element == 0, NewCaptures is Captures + 1.
updateMatrixElement(Element, _, NewCaptures) :-
	Element \= 0, NewCaptures is 0. % quando há captura, reinicia a variável.

% Verifica, ao nível de uma linha do tabuleiro, os movimentos possíveis de jogo.
listOfAvailablePlaysLine([X | Xs], Line, Column, Player, Result) :-
	getMatrixElement(X, Column, Line, Element), checkIfIsKing(Player, Element),
	validatePieceSelection(Player, Board, Line, Column, _, true, FinalValidity),
	FinalValidity == true,
	addPossibleResults(Result, Board, Player, Line, Column, NewResult),
	listOfAvailablePlaysLine(Xs, Line, Column, Player, NewResult).

% Acede um elemento numa lista a partir do índice passado como argumento.
% Condição de terminação: quando o índice estiver a 1.
getListElement([Element | _], 1, Element).
getListElement([_ | Xs], Index, Element) :-
	Index > 1, NewIndex is Index-1, getListElement(Xs, NewIndex, Element).
	
% Acede um elemento num tabuleiro a partir da coluna e da linha passados como argumento.
getMatrixElement([_ | Xs], Column, Line, Element) :-
	Line > 1, NewLine is Line-1, getMatrixElement(Xs, Column, NewLine, Element).
getMatrixElement([X | _], Column, 1, Element) :-
	getListElement(X, Column, Element).
	
% Acede a um elemento numa lista e substitui esse elemento por aquele na variável Element.
% Condição de terminação: quando o índice estiver a 1.
replaceListElement([_ | Xs], 1, Element, [Element | Xs]).
replaceListElement([X | Xs], Index, Element, [X | Ys])
	:- Index > 1, NewIndex is Index-1, replaceListElement(Xs, NewIndex, Element, Ys).

% Acede a um elemento num tabuleiro e faz uso do predicado replaceListElement para substituir o elemento passado em Element.
replaceMatrixElement([X | Xs], Column, 1, Element, [Res | Xs])
	:- replaceListElement(X, Column, Element, Res).
replaceMatrixElement([X | Xs], Column, Line, Element, [X | Ys])
	:- Line > 1, NewLine is Line-1, replaceMatrixElement(Xs, Column, NewLine, Element, Ys).
	
% Elimina (colocando a 0) um elemento de uma linha (dado pelo índice).
% Condição de terminação: quando o íncide estiver a 1.
deleteListElement([_ | Xs], 1, [0 | Xs]).
deleteListElement([X | Xs], Index, [X | Ys])
	:- Index > 1, NewIndex is Index-1, deleteListElement(Xs, NewIndex, Ys).

% Elimina um elemento do tabuleiro (colocando-o a 0) fazendo uso do predicado deleteListElement.
deleteMatrixElement([X | Xs], Column, 1, [Res | Xs])
	:- deleteListElement(X, Column, Res).
deleteMatrixElement([X | Xs], Column, Line, [X | Ys])
	:- Line > 1, NewLine is Line-1, deleteMatrixElement(Xs, Column, NewLine, Ys).
	
% Conta o número de um determinado elemento numa matriz.
countElementMatrix(_, [], 0) :- !.
countElementMatrix(Element, [X | Xs], N) :-
	countElementList(Element, X, Res),
	Res >= 1, countElementMatrix(Element, Xs, N2),
	N is N2 + Res.
countElementMatrix(Element, [X | Xs], N) :-
	countElementList(Element, X, Res), 
	Res < 1, countElementMatrix(Element, Xs, N).

% Conta o número de um determinado elemento numa linha.
countElementList(_, [], 0) :- !.
countElementList(X, [X | Xs], N) :-
    countElementList(X, Xs, N2),
    N is N2 + 1.
countElementList(X, [Y | Ys], N) :- 
    X \= Y,
    countElementList(X, Ys, N).

% Predicado que desenha o tabuleiro de jogo para interação com o utilizador.
% Faz uso de um outro predicado auxiliar para desenhar cada linha individualmente.
drawBoard([X | Xs], Player, Number) :-
	nl, nl, write('      (a)   (b)   (c)   (d)   (e)   (f)   (g)   (h)    '), nl,
	write('    +-----+-----+-----+-----+-----+-----+-----+-----+'), nl,
	write('    |     |     |     |     |     |     |     |     |'), nl,
	write('('), write(Number), write(') |'), drawLine(X, Player), nl,
	NewNumber is Number + 1, drawBoardAux(Xs, Player, NewNumber),
	write('    +-----+-----+-----+-----+-----+-----+-----+-----+').

% Predicado auxiliar ao predicado drawBoard, com o mesmo número de argumentos.
% A finalidade é desenhar cada linha individualmente, fazendo uso do predicado drawLine.
% Condição de terminação: lista vazia (percorreu o tabuleiro todo).
drawBoardAux([], _, _).
drawBoardAux([X | Xs], Player, Number) :-
    write('    +-----+-----+-----+-----+-----+-----+-----+-----+'), nl,
	write('    |     |     |     |     |     |     |     |     |'), nl,
	write('('), write(Number), write(') |'), drawLine(X, Player), nl,
	NewNumber is Number + 1, drawBoardAux(Xs, Player, NewNumber).

% Predicado para desenhar uma linha do tabuleiro (convertendo cada valor individual).
% Condição de terminação: lista vazia (percorreu a linha até ao fim).
drawLine([], _).
drawLine([X | Xs], Player) :-
	convertValue(X, Player), write('|'), drawLine(Xs, Player).

% Predicados (convert*) cujo objetivo é converter valores numéricos em strings para serem imprimidos no ecrã.

% convertValue diz respeito aos valores do tabuleiro 
% Primeiro parâmetro: 0 - sem peça, 1 e 3 - peças pretas, 2 e 4 - peças brancas.
% Segundo parâmetro: 0 - sem jogador associado, 1 - jogador branco, 2 - jogador preto.
convertValue(0, _) :- write('     ').
convertValue(1, 0) :- write('  o  ').
convertValue(1, 1) :- write('  o  ').
convertValue(1, 2) :- write(' -o- ').
convertValue(2, 0) :- write('  x  ').
convertValue(2, 1) :- write(' -x- ').
convertValue(2, 2) :- write('  x  ').
convertValue(3, 0) :- write(' |O| ').
convertValue(3, 1) :- write(' |O| ').
convertValue(3, 2) :- write('-|O|-').
convertValue(4, 0) :- write(' |X| ').
convertValue(4, 1) :- write('-|X|-').
convertValue(4, 2) :- write(' |X| ').
	
% convertPlayer faz a conversão de números para o respetivo jogador (1 - jogador branco, 2 - jogador preto).
convertPlayer(1) :- 
	write('Turno do jogador branco (''x''). Este jogador pode mover as seguintes pecas: '), nl,
	write(' -x- |-> corresponde a um soldado (movimento livre em qualquer direcao).'), nl,
	write(' |X| |-> corresponde ao rei (movimento para celulas adjacentes).'), nl, nl,
	write('A qualquer momento pode digitar ''q'' para terminar o jogo ou ''s'' para sair do programa.'), nl.
convertPlayer(2) :- 
	write('Turno do jogador preto (''o''). Este jogador pode mover as seguintes pecas: '), nl,
	write(' -o- |-> corresponde a um soldado (movimento livre em qualquer direcao).'), nl,
	write(' |O| |-> corresponde ao rei (movimento para celulas adjacentes).'), nl, nl,
	write('A qualquer momento pode digitar ''q'' para terminar o jogo ou ''s'' para sair do programa.'), nl.

% Simples factos que trocam os jogadores.
changePlayers(1, 2).
changePlayers(2, 1).

% Factos e predicados (check*) que verificam todas as opções possíveis para efeitos de cumprimento de regras.
% Em caso de erro, imprimem uma mensagem que evidencia o mesmo.

% checkGameOver(Board, IsGameOver, WinningPlayer, Captures), para verificar se o jogo terminou ou se continua.
checkGameOver(_, true, _, 10). % situação de empate.
checkGameOver(Board, true, 2, _) :- % fim do jogo, ganha o jogador branco.
	countElementMatrix(3, Board, 0).
checkGameOver(Board, true, 1, _) :- % fim do jogo, ganha o jogador preto.
	countElementMatrix(4, Board, 0).
checkGameOver(_, false, _, _). % jogo continua.

% checkOption/1 pode ter um valor entre 1 e 3. Todos os outros são opções inválidas.
checkOption(1).
checkOption(2).
checkOption(3).
checkOption(4) :- exit.
checkOption(_)
	:- nl, write('!!! ERRO !!! Opcao invalida, deve ser um numero entre 1 e 4. Por favor escolha novamente!'), nl, nl, false.

% checkLevel/1 verifica o valor do nivel escolhido (entre 1 e 3).
checkLevel(s) :- exit.
checkLevel(q) :- restart.
checkLevel(1).
checkLevel(2).
checkLevel(3).
checkLevel(_)
	:- nl, write('!!! ERRO !!! Opcao invalida, deve ser um numero entre 1 e 4. Por favor escolha novamente!'), nl, nl, false.

% checkLine/1 pode ter um valor entre 1 e 8 (correspondente ao número de linhas de tabuleiro existentes).
checkLine(s) :- exit.
checkLine(q) :- restart.
checkLine(1).
checkLine(2).
checkLine(3).
checkLine(4).
checkLine(5).
checkLine(6).
checkLine(7).
checkLine(8).
checkLine(_) 
	:- nl, write('!!! ERRO !!! Linha invalida, deve ser um numero entre 1 e 8. Por favor escolha novamente!'), nl, nl, false.

% checkColumn/2 verifica se o átomo fornecido pelo utilizador está entre 'a' e 'h'.
checkColumn(s, -1) :- exit.
checkColumn(q, 0) :- restart.
checkColumn(a, 1).
checkColumn(b, 2).
checkColumn(c, 3).
checkColumn(d, 4).
checkColumn(e, 5).
checkColumn(f, 6).
checkColumn(g, 7).
checkColumn(h, 8).
checkColumn(_, 9) 
	:- nl, write('!!! ERRO !!! Coluna invalida, deve ser uma letra minuscula entre ''a'' e ''h''. Por favor escolha novamente!'), nl, nl, false.

% checkTurnPlay/1 verifica as opções de escolha para o turno do bot nos modos de jogo em que este é chamado.
checkTurnPlay(q) :- restart.
checkTurnPlay(s) :- exit.
checkTurnPlay(j) :- true.
checkTurnPlay(_) :- nl, write('!!! ERRO !!! Opcao invalida. Por favor escolha novamente!'), nl, nl, false.
	
% checkIfIsKing/2 verifica se o elemento selecionado é, ou não, um rei.
checkIfIsKing(3, true).
checkIfIsKing(4, true).
checkIfIsKing(_, false). % Falso em todos os outros casos.
	
% checkIfIsPlayerPiece/3 verifica os cenários possíveis de seleção de peças no tabuleiro (para cada jogador).
checkIfIsPlayerPiece(_, 1, 2, true). % Jogador preto pode selecionar soldado preto.
checkIfIsPlayerPiece(_, 3, 2, true). % Jogador preto pode selecionar rei preto.
checkIfIsPlayerPiece(_, 2, 1, true). % Jogador branco pode selecionar soldado branco.
checkIfIsPlayerPiece(_, 4, 1, true). % Jogador branco pode selecionar rei branco.
checkIfIsPlayerPiece(true, 0, _, false). % Falso em todos os outros casos.
checkIfIsPlayerPiece(false, 0, _, false)
	:- nl, write('!!! ERRO !!! Nao ha nenhuma peca nas coordenadas fornecidas. Por favor escolha novamente!'), nl, nl.
checkIfIsPlayerPiece(true, _, _, false)	.
checkIfIsPlayerPiece(false, _, _, false)
	:- nl, write('!!! ERRO !!! Selecao de peca invalida! So pode jogar com as pecas da sua cor. Por favor escolha novamente!'), nl, nl.

% checkDestinyPieceValidity/3 verifica os cenários possíveis de colocação de uma peça numa outra célula (para cada jogador).
checkDestinyPieceValidity(_, 1, 1, true). % Jogador branco pode mover a peça para uma posição com um soldado preto.
checkDestinyPieceValidity(_, 3, 1, true). % Jogador branco pode mover a peça para uma posição com um rei preto.
checkDestinyPieceValidity(_, 0, 1, true). % Jogador branco pode mover a peça para uma posição com nenhuma peça.
checkDestinyPieceValidity(_, 2, 2, true). % Jogador preto pode mover a peça para uma posição com um soldado branco.
checkDestinyPieceValidity(_, 4, 2, true). % Jogador preto pode mover a peça para uma posição com um rei branco.
checkDestinyPieceValidity(_, 0, 2, true). % Jogador preto pode mover a peça para uma posição com nenhuma peça.
checkDestinyPieceValidity(false, _, _, false) % Falso em todos os outros casos.
	:- nl, write('!!! ERRO !!! Posicao invalida! So pode colocar pecas em celulas vazias ou com pecas adversarias. Por favor escolha novamente!'), nl, nl.
checkDestinyPieceValidity(true, _, _, false).

% checkDirectionValidity/5 verifica se a peça escolhida pelo utilizador pode movimentar-se direcionalmente para o destino.
checkDirectionValidity(_, PieceLine, PieceLine, _, _, true). % Movimento na mesma linha (horizontal).
checkDirectionValidity(_, _,_, PieceColumn, PieceColumn, true). % Movimento na mesma coluna (vertical).
checkDirectionValidity(_, PieceLine, DestinyLine, PieceColumn, DestinyColumn, true) :- % Movimentos na diagonal.
	LineDif is PieceLine - DestinyLine, ColumnDif is PieceColumn - DestinyColumn, 
	AbsLineDif is abs(LineDif), AbsColumnDif is abs(ColumnDif), AbsLineDif == AbsColumnDif.
checkDirectionValidity(false, _, _, _, _, false) % Falso em todos os outros casos.
	:- nl, write('!!! ERRO !!! Direcao invalida! A peca escolhida so pode ser movida na horizontal, vertical ou diagonal. Por favor escolha novamente!'), nl, nl.	
checkDirectionValidity(true, _, _, _, _, false).

% elementConf e checkMobilityValidity estão responsáveis por verificar se uma peça não pula por cima de outras peças até à sua nova posição.
% Cada checkMobilityValidity faz uma chamada recursiva com uma direção e um sentido de movimento diferentes.
% Estes predicados utilizam o predicado getMatrixElement para devolver os valores do tabuleiro que vão percorrendo.
elementConf(_, 0, true).
elementConf(0, _, true).
elementConf(PieceDif, Element, false) :-
	PieceDif > 0, Element > 0.

% Termina quando a peça de origem estiver na mesma localização que o destino.
checkMobilityValidity(_, _, PieceLine, PieceLine, PieceColumn, PieceColumn, true).

checkMobilityValidity(IsBot, Board, PieceLine, PieceLine, PieceColumn, DestinyColumn, Validity) :- % horizontal, da esquerda para a direita.
	DestinyColumn > PieceColumn, NewPieceColumn is PieceColumn + 1, PieceDif is DestinyColumn - NewPieceColumn,
	getMatrixElement(Board, NewPieceColumn, PieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, PieceLine, PieceLine, NewPieceColumn, DestinyColumn, Validity).
	
checkMobilityValidity(IsBot, Board, PieceLine, PieceLine, PieceColumn, DestinyColumn, Validity) :- % horizontal, da direita para a esquerda.
	DestinyColumn < PieceColumn, NewPieceColumn is PieceColumn - 1, PieceDif is NewPieceColumn - DestinyColumn,
	getMatrixElement(Board, NewPieceColumn, PieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, PieceLine, PieceLine, NewPieceColumn, DestinyColumn, Validity).
	
checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, PieceColumn, Validity) :- % vertical, de cima para baixo.
	DestinyLine > PieceLine, NewPieceLine is PieceLine + 1, PieceDif is DestinyLine - NewPieceLine,
	getMatrixElement(Board, PieceColumn, NewPieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, NewPieceLine, DestinyLine, PieceColumn, PieceColumn, Validity).
	
checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, PieceColumn, Validity) :- % vertical, de baixo para cima.
	DestinyLine < PieceLine, NewPieceLine is PieceLine - 1, PieceDif is NewPieceLine - DestinyLine,
	getMatrixElement(Board, PieceColumn, NewPieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, NewPieceLine, DestinyLine, PieceColumn, PieceColumn, Validity).
	
checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, Validity) :- % diagonal esquerda, +1 +1.
	DestinyLine > PieceLine, DestinyColumn > PieceColumn, NewPieceLine is PieceLine + 1, NewPieceColumn is PieceColumn + 1, 
	PieceDif is DestinyLine - NewPieceLine, getMatrixElement(Board, NewPieceColumn, NewPieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, NewPieceLine, DestinyLine, NewPieceColumn, DestinyColumn, Validity).

checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, Validity) :- % diagonal esquerda, -1 -1.
	DestinyLine < PieceLine, DestinyColumn < PieceColumn, NewPieceLine is PieceLine - 1, NewPieceColumn is PieceColumn - 1, 
	PieceDif is NewPieceLine - DestinyLine, getMatrixElement(Board, NewPieceColumn, NewPieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, NewPieceLine, DestinyLine, NewPieceColumn, DestinyColumn, Validity).
	
checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, Validity) :- % diagonal direita, +1 -1.
	DestinyLine > PieceLine, DestinyColumn < PieceColumn, NewPieceLine is PieceLine + 1, NewPieceColumn is PieceColumn - 1, 
	PieceDif is DestinyLine - NewPieceLine, getMatrixElement(Board, NewPieceColumn, NewPieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, NewPieceLine, DestinyLine, NewPieceColumn, DestinyColumn, Validity).
	
checkMobilityValidity(IsBot, Board, PieceLine, DestinyLine, PieceColumn, DestinyColumn, Validity) :- % diagonal direita, -1 +1.
	DestinyLine < PieceLine, DestinyColumn > PieceColumn, NewPieceLine is PieceLine - 1, NewPieceColumn is PieceColumn + 1, 
	PieceDif is NewPieceLine - DestinyLine, getMatrixElement(Board, NewPieceColumn, NewPieceLine, Element), elementConf(PieceDif, Element, Validity),
	checkMobilityValidity(IsBot, Board, NewPieceLine, DestinyLine, NewPieceColumn, DestinyColumn, Validity).

checkMobilityValidity(true, _, _, _, _, _, false).
checkMobilityValidity(false, _, _, _, _, _, false)
	:- nl, write('!!! ERRO !!! Posicao invalida! A peca nao pode saltar por cima de outras pecas. Por favor escolha novamente!'), nl, nl.	

% Serie de factos/predicados que previnem uma peça que nao se pode mexer de ser selecionada.
checkIfCanBeSelected(IsBot, IsPlayerPieceValidity, Board, Element, Column, Line, FinalValidity) :-
	ColumnPlusOne is Column + 1, ColumnMinusOne is Column - 1,
	LinePlusOne is Line + 1, LineMinusOne is Line - 1,
	checkElement(Board, Element, Column, LinePlusOne, ValidityOne), !,
	checkElement(Board, Element, Column, LineMinusOne, ValidityTwo), !,
	checkElement(Board, Element, ColumnPlusOne, Line, ValidityThree), !,
	checkElement(Board, Element, ColumnMinusOne, Line, ValidityFour), !,
	checkElement(Board, Element, ColumnPlusOne, LinePlusOne, ValidityFive), !,
	checkElement(Board, Element, ColumnMinusOne, LineMinusOne, ValiditySix), !,
	checkElement(Board, Element, ColumnPlusOne, LineMinusOne, ValiditySeven), !,
	checkElement(Board, Element, ColumnMinusOne, LinePlusOne, ValidityEight), !,
	canBeSelectedFinalValidity(IsBot, IsPlayerPieceValidity,
	ValidityOne, ValidityTwo, ValidityThree, ValidityFour, ValidityFive, ValiditySix, ValiditySeven, ValidityEight, FinalValidity).

% Se todas as peças ao seu redor forem iguais, a peça nao se pode mexer.
canBeSelectedFinalValidity(true, true, 1, 1, 1, 1, 1, 1, 1, 1, 1).
canBeSelectedFinalValidity(false, true, 1, 1, 1, 1, 1, 1, 1, 1, 1)
	:- nl, write('!!! ERRO !!! Selecao de peca invalida! A peca que escolheu nao se pode mover. Por favor escolha novamente!'), nl, nl.
canBeSelectedFinalValidity(_, false, 1, 1, 1, 1, 1, 1, 1, 1, 1).
	
% Caso contrário, a peça pode-se mover.
canBeSelectedFinalValidity(_, _, 2, _, _, _, _, _, _, _, 2).
canBeSelectedFinalValidity(_, _, _, 2, _, _, _, _, _, _, 2).
canBeSelectedFinalValidity(_, _, _, _, 2, _, _, _, _, _, 2).
canBeSelectedFinalValidity(_, _, _, _, _, 2, _, _, _, _, 2).
canBeSelectedFinalValidity(_, _, _, _, _, _, 2, _, _, _, 2).
canBeSelectedFinalValidity(_, _, _, _, _, _, _, 2, _, _, 2).
canBeSelectedFinalValidity(_, _, _, _, _, _, _, _, 2, _, 2).
canBeSelectedFinalValidity(_, _, _, _, _, _, _, _, _, 2, 2).

checkElement(Board, Element, Column, Line, Validity) :-
	Column > 0, Line > 0, Column < 9, Line < 9,
	getMatrixElement(Board, Column, Line, ReturnElement),
	normalizeElement(Element, NormalizedElement),
	normalizeElement(ReturnElement, NormalizedReturnElement),
	NormalizedReturnElement == NormalizedElement, Validity is 1.
checkElement(Board, Element, Column, Line, Validity) :-
	Column > 0, Line > 0, Column < 9, Line < 9,
	getMatrixElement(Board, Column, Line, ReturnElement),
	normalizeElement(Element, NormalizedElement),
	normalizeElement(ReturnElement, NormalizedReturnElement),
	NormalizedReturnElement \= NormalizedElement, Validity is 2.
checkElement(_, _, _, _, 1).

normalizeElement(1, 1).
normalizeElement(2, 2).
normalizeElement(3, 1).
normalizeElement(4, 2).
normalizeElement(0, 0).

% checkFinalSelectionValidity/2 averigua se todas as condições da seleção da peça são verificadas.
checkFinalSelectionValidity(2, true, true).
checkFinalSelectionValidity(_, _, false).

% checkFinalDestinyValidity/3 averigua se todas as condições de movimentação da peça são verificadas.
checkFinalDestinyValidity(true, true, true, true). % Todas as variáveis têm que ser verdadeiras.	
checkFinalDestinyValidity(_, _,_, false). % Caso contrário, a validade não é verificada (independentemente de que variável seja falsa).

% Escreves as mensageens nos predicados de jogo para a peça selecionada/movimentada no caso de ser soldado ou rei.
writeSelectedHumanPiece(false, PieceLine, PieceLetterColumn) :- % caso seja um soldado.
	nl, write('----------------------------'), nl,
	write('Selecionado o soldado em '), write(PieceLine), write(PieceLetterColumn), write('.'),
	nl, write('----------------------------'), nl, nl.
writeSelectedHumanPiece(true, PieceLine, PieceLetterColumn) :- % caso seja um rei.
	nl, write('------------------------'), nl,
	write('Selecionado o rei em '), write(PieceLine), write(PieceLetterColumn), write('.'),
	nl, write('------------------------'), nl, nl.
writeDestinationHumanPiece(false, PieceLine, PieceLetterColumn, DestinyLine, DestinyLetterColumn, Captures) :- % caso seja um soldado.
	nl, write('-------------------------------------'), nl,
	write('Soldado em '), write(PieceLine), write(PieceLetterColumn), write(' colocado na posicao '), write(DestinyLine), write(DestinyLetterColumn), write('.'),
	nl, writeCapturedInfo(Captures), nl, write('-------------------------------------').
writeDestinationHumanPiece(true, PieceLine, PieceLetterColumn, DestinyLine, DestinyLetterColumn, Captures) :- % caso seja um rei.
	nl, write('---------------------------------'), nl,
	write('Rei em '), write(PieceLine), write(PieceLetterColumn), write(' colocado na posicao '), write(DestinyLine), write(DestinyLetterColumn), write('.'),
	nl, writeCapturedInfo(Captures), nl, write('---------------------------------').
writeSelectedBotPiece(false, PieceLine, PieceColumn) :- % caso seja um soldado.
	write('------------------------------------------------'), nl,
	write('O computador selecionou o soldado na posicao '), write(PieceLine), checkColumn(PieceLetterColumn, PieceColumn), write(PieceLetterColumn), write('.'), nl.
writeSelectedBotPiece(true, PieceLine, PieceColumn) :- % caso seja um rei.
	write('--------------------------------------------'), nl,
	write('O computador selecionou o rei na posicao '), write(PieceLine), checkColumn(PieceLetterColumn, PieceColumn), write(PieceLetterColumn), write('.'), nl.
writeDestinationBotPiece(false, DestinyLine, DestinyColumn, Captures) :- % caso seja um soldado.
	write('Este soldado foi colocado na posicao '), write(DestinyLine), checkColumn(DestinyLetterColumn, DestinyColumn), write(DestinyLetterColumn),  write('.'), nl,
	writeCapturedInfo(Captures), nl, write('------------------------------------------------'), nl.
writeDestinationBotPiece(true, DestinyLine, DestinyColumn, Captures) :- % caso seja um rei.
	write('Este rei foi colocado na posicao '), write(DestinyLine), checkColumn(DestinyLetterColumn, DestinyColumn), write(DestinyLetterColumn),  write('.'), nl,
	writeCapturedInfo(Captures), nl, write('--------------------------------------------'), nl.
	
% Escreve a mensagem relativa ao número de capturas das peças.
writeCapturedInfo(0) :-
	write('Foi capturada uma peca adversaria!').
writeCapturedInfo(1) :-
	write('Passou-se 1 turno sem capturas.').
writeCapturedInfo(Captures) :-
	write('Passaram-se '), write(Captures), write(' turnos sem capturas.').
	
% Escreve a mensagem de fim de jogo, referindo o respetivo vencedor (ou empate).
writeMessageOfGameOver(_, 10) :-
	nl, write('------------------------------------------------------------'), nl,
	write('Passaram-se 10 turnos sem captura. O jogo terminou empatado!'),
	nl, write('------------------------------------------------------------').
writeMessageOfGameOver(1, _) :-
	nl, write('------------------------------------------------------------------------'), nl,
	write('O rei do jogador branco foi comido. O jogador preto sagrou-se vencedor!'),
	nl, write('------------------------------------------------------------------------').
writeMessageOfGameOver(2, _) :-
	nl, write('------------------------------------------------------------------------'), nl,
	write('O rei do jogador preto foi comido. O jogador branco sagrou-se vencedor!'),
	nl, write('------------------------------------------------------------------------').

% Predicado para sair do programa, imprimindo a respetiva mensagem no ecrã.
exit :- 
	nl, write('--------------------------------------------------------------------'), nl,
	write('O programa vai agora fechar. Para abri-lo novamente escreva ''start.'''),
	nl, write('--------------------------------------------------------------------'),nl, nl, abort.

% Predicado para voltar ao menu inicial, imprimindo a respetiva mensagem no ecrã.
restart :-
	nl, write('---------------------------------------------------------------'), nl,
	write('O jogo foi terminado abruptamente e vai voltar ao menu inicial.'),
	nl, write('---------------------------------------------------------------'), !, nl, nl, start.