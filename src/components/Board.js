import React, {useState, useEffect} from 'react';
import Tile from './Tile';

const Board = () => {
    const [state, setState] = useState({
        boardState: new Array(7).fill(new Array(6).fill(null)),
        playerTurn: 'Red',
        gameMode: '',
        gameSelected: false,
        showTitle: true,
        winner: '',
        current_move: 0,
        history: [],
        win_history : []
    })

    /* checks if col contain tile */
    const checkCol = (a, b, c, d) => {
        return ((a !== null) && (a === b) && (a === c) && (a === d));
    }

    /* get tiles and check for winner */
    const checkWinner = (currentTiles) => {
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 4; row++) {
                if (checkCol(currentTiles[col][row], currentTiles[col][row + 1], currentTiles[col][row + 2], currentTiles[col][row + 3])) {
                    return currentTiles[col][row];
                }
            }
        }
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                if (checkCol(currentTiles[col][row], currentTiles[col + 1][row], currentTiles[col + 2][row], currentTiles[col + 3][row])) {
                    return currentTiles[col][row];
                }
            }
        }
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                if (checkCol(currentTiles[col][row], currentTiles[col + 1][row + 1], currentTiles[col + 2][row + 2], currentTiles[col + 3][row + 3])) {
                    return currentTiles[col][row];
                }
            }
        }
        for (let row = 0; row < 4; row++) {
            for (let col = 3; col < 6; col++) {
                if (checkCol(currentTiles[col][row], currentTiles[col - 1][row + 1], currentTiles[col - 2][row + 2], currentTiles[col - 3][row + 3])) {
                    return currentTiles[col][row];
                }
            }
        }
        return "";
    }
    /* set game mode on button click */
    const selectedGame = (mode) => {
        setState(prevState => ({
            ...prevState,
            gameMode: mode,
            gameSelected: true, 
            showTitle: false,
            current_move: 0,
            boardState: new Array(7).fill(new Array(6).fill(null)),
            history: [{playerTurn: 'Red', currentBoard: new Array(7).fill(new Array(6).fill(null))}],
            win_history: [],
        }));
    }

    /* move only if winner doesn't exist */
    const handleClick = (slatID) => {
        if(state.winner === ''){
            makeMove(slatID);
        }
    }
    
    /* move slat */
    const makeMove = (slatID) => {
        const boardCopy = state.boardState.map((arr) => {
            return arr.slice();
        });

        if(boardCopy[slatID].indexOf(null) !== -1 ) {
            let newSlat = boardCopy[slatID].reverse();
            newSlat[newSlat.indexOf(null)] = state.playerTurn;
            newSlat.reverse();

            if(state.playerTurn === 'Red') {
                setState(prevState => ({
                    ...prevState,
                    current_move: state.current_move + 1, 
                    history: [...state.history, {playerTurn: state.playerTurn, currentBoard: boardCopy}],
                }));
            }

            setState(prevState => ({
                ...prevState,
                playerTurn: (state.playerTurn === 'Red') ? 'Blue' : 'Red',
                boardState: boardCopy, 
            }));
        }
    }

    /* jump to previous turn*/
    const jumpTo = (turnIndex, board) => {
        setState(prevState => ({
            ...prevState,
            history: state.history.slice(0, turnIndex),
            boardState: board
        }));
    }
    
    const generateBoard = () => {
        
        return state.boardState.map((x, i) => {
            console.log(i);
            return(
                <Tile 
                    key={i}
                    holes={state.boardState[i]}
                    handleClick={() => handleClick(i)}
                ></Tile>
            )
        });
    }

    const generateMoves = () => {
        return state.history.map((turn, i) => {
            let moveNum = i + 1;
            const desc =  i === 0 ? 'Go to game start' : 'Go to Turn #' + moveNum;
            return (
                <li key={moveNum}>
                    <button onClick={() => jumpTo(moveNum, turn.currentBoard)}>{desc}</button>
                </li>
            );
        });
    }

    const goToMenu = () => {
        setState(prevState => ({
            ...prevState,
            boardState: new Array(7).fill(new Array(6).fill(null)),
            playerTurn: 'Red',
            gameMode: '',
            gameSelected: false,
            showTitle: true,
            winner: '',
            current_move: 0,
            history: [],
            win_history : []
        }));
    }

    const generateWinners = () => {
        return state.win_history.map((winner, i) => {
            if(winner === "") {
                return;
            }
            if(winner === "Red") {
                return(<li key={i} className="redTitle">{winner} wins</li>);
            } else {
                return(<li key={i} className="blueTitle">{winner} wins</li>);
            }
        });

    }

    const generateBanner = () => {
        let newWinMsg = "winMsg"
        if(state.winner !== ""){
            newWinMsg = "winMsg show";
        }
        return newWinMsg;
    }

    useEffect(() => {
        let winner = checkWinner(state.boardState)
        if(state.winner !== winner) {
            setState(prevState => ({
                ...prevState, 
                winner: winner, 
                win_history: [...state.win_history, winner],
            }));
        } else if(state.gameMode === 'ai' && state.playerTurn === 'Blue') {
            let validMove = -1;
            while(validMove === -1) {
                let tile = Math.floor((Math.random() * 7));
                if(state.boardState[tile].indexOf(null) !== -1) {
                    validMove = tile;
                } else{
                    validMove = -1;
                }
            }
            makeMove(validMove);
        }
    }, [checkWinner, state.boardState, state.winner, state.gameMode, state.playerTurn, state.win_history, makeMove]);

    return (
        <div className="GameBoard row">
            {state.gameSelected &&
                <div className="BoardContainer row">
                    <div className="Game-Moves column">
                        <h4 className="MovesTitle ">Game Moves</h4>
                        <ol className="MovesList">
                            {generateMoves()}
                        </ol>
                    </div>
                    <div className="double-column">
                        <div className="Board">
                            {generateBoard()}
                        </div>
                    </div>
                    <div className="Game-History column">
                        <h4 className="WinTitle">Win History</h4>
                        <ol className="WinList">
                            {generateWinners()}
                        </ol>
                    </div>
                </div>
            }
            <div className={generateBanner()}>{state.winner} wins</div>
            {state.showTitle && 
                <div className="GameTitle"><h1>Connect 4 Game</h1></div> 
            }
            {(!state.gameSelected || state.winner !== '') ?
                <div className="ui-row row">
                    <button className="ui-button" onClick={() => selectedGame('human')}>Play Human</button>
                    <button className="ui-button" onClick={() => selectedGame('ai')}>Play AI</button>
                </div>
                :
                <div className="ui-row row">
                    <button className="ui-button" onClick={goToMenu}>Go To Menu</button>
                </div>
            }
            
        </div>
    )
}

export default Board;