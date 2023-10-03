
let board = [];

let lets = "abcdefgh".split("");
let nums = "87654321".split("");

let w = "PRNKQB";
let b = "prnkqb";

const None = 0;
const King = 1;
const Pawn = 2;
const Knight = 3;
const Bishop = 4;
const Rook = 5;
const Queen = 6;

const White = 8;
const Black = 16;

const pieces = {k: King | Black,
                K: King | White,
                p: Pawn | Black,
                P: Pawn | White,
                n: Knight | Black,
                N: Knight | White,
                b: Bishop | Black,
                B: Bishop | White,
                r: Rook | Black,
                R: Rook | White,
                q: Queen | Black,
                Q: Queen | White};

function gen() {
    updateBoard();

    for (let n = 0; n < 64; n++) {
        board[n] = None;
    }

    let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    //let fen = "8/8/8/3Q4/4q3/8/8/8";
    let x = 0;
    let y = 0;

    for (let i = 0; i < fen.length; i++) {
        board[y*8+x] = pieces[fen[i]];
        if ("012345678".includes(fen[i])) {
            x += parseInt(fen[i]);
        }
        else if ('rnkbqpPRNKQB'.includes(fen[i])) {
            x ++;
        }
        if (x > 8) {
            x -= 8;
            y ++;
        }

    };

    updatePieces();
}

function updateBoard(){
    let parent = document.getElementById("board");
    parent.innerText = "";

    for(let y = 0; y < 8; y++) {

        let row = document.createElement("div");

        row.setAttribute("class", "row");

        for (let x = 0; x < 8; x++) {

            let tile = document.createElement("div");
            tile.setAttribute("onclick", "move()");
            let boxId = lets[x] + nums[y];

            if ((x + y) % 2 == 0) {
                tile.setAttribute("class", "piece-box white-box");
            }
    
            else {
                tile.setAttribute("class", "piece-box black-box");
            }
            tile.setAttribute("id", boxId);
            row.appendChild(tile);
        }

        parent.appendChild(row);
    }

    parent.setAttribute("cellspacing", "0");
    document.getElementById("mid").appendChild(parent);

}

function updatePieces() {
    for (let n = 0; n < 64; n++) {
        
        if (board[n] > 0) {
            let id = lets[n-Math.trunc(n/8)*8]+nums[Math.trunc(n/8)];
            let piece = document.createElement("img");
            piece.setAttribute("class", "piece");
            piece.setAttribute("onclick", "selectPiece()");

            if (board[n] == (Pawn | White)) {
                piece.src = "media/pawn-white.png";
                piece.id = "P" + id;
            }

            else if (board[n] == (Pawn | Black)) {
                piece.src = "media/pawn-black.png";
                piece.id = "p" + id;
            }

            else if (board[n] == (Bishop | White)) {
                piece.src = "media/bishop-white.png";
                piece.id = "B" + id;
            }

            else if (board[n] == (Bishop | Black)) {
                piece.src = "media/bishop-black.png";
                piece.id = "b" + id;
            }

            else if (board[n] == (King | White)) {
                piece.src = "media/king-white.png";
                piece.id = "K" + id;
            }

            else if (board[n] == (King | Black)) {
                piece.src = "media/king-black.png";
                piece.id = "k" + id;
            }

            else if (board[n] == (Queen | White)) {
                piece.src = "media/queen-white.png";
                piece.id = "Q" + id;
            }

            else if (board[n] == (Queen | Black)) {
                piece.src = "media/queen-black.png";
                piece.id = "q" + id;
            }

            else if (board[n] == (Rook | White)) {
                piece.src = "media/rook-white.png";
                piece.id = "R" + id;
            }

            else if (board[n] == (Rook | Black)) {
                piece.src = "media/rook-black.png";
                piece.id = "r" + id;
            }

            else if (board[n] == (Knight | White)) {
                piece.src = "media/knight-white.png";
                piece.id = "N" + id;
            }

            else if (board[n] == (Knight | Black)) {
                piece.src = "media/knight-black.png";
                piece.id = "n" + id;
            }

            document.getElementById(id).appendChild(piece);
        }
    }
}

let old = "";
let select = false;
let turn = "White";
let highlighted = [];

function selectPiece() {
    let t = event.srcElement;
    let ls = (turn == "White") ? w : b ;
    if (old != "") {
        if (t.id == old.id) {
            for (let n = 0; n < highlighted.length; n++) {
                document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
            }

            highlighted = [];

            old = "";
            select = false;
        }
        else if (highlighted.includes(t.id.substr(1))) {
            let g = t.parentNode;
            g.removeChild(t);
            g.appendChild(old);
            old.id = old.id.charAt(0) + g.id;

            if (b.includes(t.id.charAt(0))) { //White
                turn = "Black";
            }
            else if (w.includes(t.id.charAt(0))) { //Black
                turn = "White";
            }

            old = "";

            select = false;

            for (let n = 0; n < highlighted.length; n++) {
                document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
            }

            highlighted = [];
        }
        else {
            pieceHandeler(ls, t);
        }
    }

    else {
        pieceHandeler(ls, t);
    }
}

function pieceHandeler(ls, t) {
    if (ls.includes(t.id.charAt(0))) {
        for (let n = 0; n < highlighted.length; n++) {
            document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
        }

        highlighted = [];

        old = t;
        select = true;

        (t.id.charAt(0) == "P") ? pawnMovement(1, t) : null; //pawn
        (t.id.charAt(0) == "R") ? rookMovement(t) : null; // rook
        (t.id.charAt(0) == "B") ? bishopMovement(t) : null; // bishop
        (t.id.charAt(0) =="Q") ? queenMovement(t) : null; // queen

        (t.id.charAt(0) == "p") ? pawnMovement(-1, t) : null; //pawn
        (t.id.charAt(0) == "r") ? rookMovement(t) : null; // rook
        (t.id.charAt(0) == "b") ? bishopMovement(t) : null; // bishop
        (t.id.charAt(0) =="q") ? queenMovement(t) : null; // queen
    }
}

function move() {
    if (select==true & highlighted.length > 0) {
        var info = event.srcElement;
        
        if (info.id.substr(1) != old.id.substr(1) & highlighted.includes(info.id)) {
            info.appendChild(old);
            old.id = old.id.charAt(0) + info.id;

            if (turn == "White") { //White
                turn = "Black";
            }
            else if (turn == "Black") { //Black
                turn = "White";
            }

            old = "";

            select = false;

            for (let n = 0; n < highlighted.length; n++) {
                document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
            }
            
            highlighted = [];
        }
    }
}
//-------------------en passant not done

function rookMovement(t, j=highlighted.length) {
    let z = 0;
    let ls = "";
    let long = lets.indexOf(t.id.charAt(1));
    let lat = parseInt(t.id.charAt(2));

    ls = (w.includes(t.id.charAt(0))) ? b : w;
    

    for (let n = 1; n < (9-lat); n++) { //----------------up
        z = t.id.charAt(1) + `${lat + n}`;

        if (movement(z, ls) == 1) break;
    }
    for (let n = 1; n < 8; n++) { //------------down
        if (lat-n == 0) break;
        z = t.id.charAt(1) + `${lat - n}`;

        if (movement(z, ls) == 1) break;
    }

    for (let n = 1; n < 8; n++) { //---------left
        if (long-n == -1) break;
        z = lets[long-n] + `${lat}`;

        if (movement(z, ls) == 1) break;
    }

    for (let n = 1; n < 8; n++) {//----------------right
        if (long+n == 8) break;
        z = lets[long+n] + `${lat}`;

        if (movement(z, ls) == 1) break;
    }
}

function bishopMovement(t, j=highlighted.length) {
    let z = 0;
    let ls = "";
    let long = lets.indexOf(t.id.charAt(1));
    let lat = parseInt(t.id.charAt(2));

    ls = (w.includes(t.id.charAt(0))) ? b : w;
    

    for (let n = 1; n < 8; n++) { //----------------up-left
        if (long-n == -1) break;
        if (lat+n == 9) break;

        z = lets[long - n] + `${lat + n}`;

        if (movement(z, ls) == 1) break;
    }
    for (let n = 1; n < 8; n++) { //----------------down-right
        if (lat-n == 0) break;
        if (long+n == 8) break;

        z = lets[long + n] + `${lat - n}`;

        if (movement(z, ls) == 1) break;
    }

    for (let n = 1; n < 8; n++) { //----------------up-right
        if (long+n == 8) break;
        if (lat+n == 9) break;

        z = lets[long + n] + `${lat + n}`;

        if (movement(z, ls) == 1) break;
    }
    for (let n = 1; n < 8; n++) { //----------------down-left
        if (lat-n == 0) break;
        if (long-n == -1) break;

        z = lets[long - n] + `${lat - n}`;

        if (movement(z, ls) == 1) break;
    }
}

function kingMovement(t, j=highlighted.length) {
    null;
}

function queenMovement(t, j=highlighted.length) {
    rookMovement(t, j);
    bishopMovement(t);
}

function movement(z, ls) {
    let j = highlighted.length;

    if (document.getElementById(z).childElementCount == 0) {
        highlighted[j] = z;
        document.getElementById(highlighted[j]).className += " viable";
    }
    else {
        if (ls.includes(document.getElementById(z).childNodes[0].id.charAt(0))) {
            highlighted[j] = z;
            document.getElementById(highlighted[j]).className += " viable";
        }
        return 1;
    }
    return 0;
}