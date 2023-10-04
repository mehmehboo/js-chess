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

let old = "";
let select = false;
let turn = "";
let highlighted = [];
let passant = [];
let passantPiece = [];
let castlePiece = [];
let castleRight = "";

let checks = "";
let invalid = "";
let kingPos = [];

const movementTypes = {"P" :  'pawnMovement',
                            "p" :  'pawnMovement',
                            "R" : 'rookMovement',
                            "r" : 'rookMovement',
                            "B" : 'bishopMovement',
                            "b" : 'bishopMovement',
                            "Q" : 'queenMovement',
                            "q" : 'queenMovement',
                            "K" : 'kingMovement',
                            "k" : 'kingMovement',
                            'N' : 'knightMovement',
                            'n' : 'knightMovement'};

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

    //let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0 0";
    let fen = "7p/8/8/3k4/4K3/8/8/P7 w - - 0 0";
    let x = 0;
    let y = 0;

    if (fen.includes(" w ")) {
        turn = "White";
    }
    else {
        turn = "Black";
    }
    //improve later
    if (fen.includes(" KQkq ")) {castleRight = "KQkq"}

    document.getElementById('turn').innerText = 'Turn: ' + turn;

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
                kingPos[0] = piece.id;
            }

            else if (board[n] == (King | Black)) {
                piece.src = "media/king-black.png";
                piece.id = "k" + id;
                kingPos[1] = piece.id;
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

function selectPiece() {
    let t = event.srcElement;
    let ls = (turn == "White") ? w : b ;
    if (old != "") {
        if (t.id == old.id) {
            for (let n = 0; n < highlighted.length; n++) {
                document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
            }

            highlighted = [];

            for (let n = 0; n < passant.length; n++) {
                document.getElementById(passant[n]).className = document.getElementById(passant[n]).className.substring(0, 19);
            }
            
            passant = [];

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

        for (let n = 0; n < passant.length; n++) {
            document.getElementById(passant[n]).className = document.getElementById(passant[n]).className.substring(0, 19);
        }
        
        passant = [];

        old = t;
        select = true;

        window[movementTypes[t.id.charAt(0)]](t);
    }
}

function move() {
    if (select==true & highlighted.length > 0) {
        var info = event.srcElement;
        
        if (info.id.substr(1) != old.id.substr(1)) {

            if (highlighted.includes(info.id)) {
                for (let n = 0; n < invalid.length; n++) {
                    document.getElementById(invalid[n]).className = document.getElementById(invalid[n]).className.substring(0, 19);
                }
                
                invalid = [];

                console.log(kingPos);

                lookForChecks(document.getElementById(kingPos[0]));
                lookForChecks(document.getElementById(kingPos[1]));

                console.log(invalid);
                
                for (let n = 0;n < 8;n++) {
                    if (document.getElementById(lets[n]+"5").childElementCount == 1) {document.getElementById(lets[n]+"5").childNodes[0].name = ""};
                    if (document.getElementById(lets[n]+"4").childElementCount == 1) {document.getElementById(lets[n]+"4").childNodes[0].name = ""};
                }

                if (old.id == "Ra1") {castleRight = castleRight.replace("Q", "")};
                if (old.id == "Rh1") {castleRight = castleRight.replace("K", "")};
                if (old.id == "rq8") {castleRight = castleRight.replace("q", "")};
                if (old.id == "rh8") {castleRight = castleRight.replace("k", "")};

                info.appendChild(old);

                let vara = [parseInt(old.id.charAt(2)),  parseInt(info.id.charAt(1))];

                if (old.id.charAt(0) == "p" | old.id.charAt(0) == "P") {
                    if (vara[0] == vara[1] + 2 | vara[0] == vara[1] - 2) {
                        old.name = "yup"
                    }
                }

                if (old.id.charAt(0) == "k") {
                    if (lets.indexOf(info.id.charAt(0))+1 < lets.indexOf(old.id.charAt(1))) {
                        if (castlePiece.includes(document.getElementById("a"+old.id.charAt(2)))) {
                            document.getElementById("d"+old.id.charAt(2)).appendChild(document.getElementById("ra"+old.id.charAt(2)));
                        }
                    }
                    else if (lets.indexOf(info.id.charAt(0)) > lets.indexOf(old.id.charAt(1))+1) {
                        if (castlePiece.includes(document.getElementById("h"+old.id.charAt(2)))) {
                            document.getElementById("f"+old.id.charAt(2)).appendChild(document.getElementById("rh"+old.id.charAt(2)));
                        }
                    }
                    castleRight = castleRight.replace("kq", "");
                    kingPos[1] = old.id;
                }
                if (old.id.charAt(0) == "K") {
                    if (lets.indexOf(info.id.charAt(0))+1 < lets.indexOf(old.id.charAt(1))) {
                        if (castlePiece.includes(document.getElementById("a"+old.id.charAt(2)))) {
                            document.getElementById("d"+old.id.charAt(2)).appendChild(document.getElementById("Ra"+old.id.charAt(2)));
                        }
                    }
                    else if (lets.indexOf(info.id.charAt(0)) > lets.indexOf(old.id.charAt(1))+1) {
                        if (castlePiece.includes(document.getElementById("h"+old.id.charAt(2)))) {
                            document.getElementById("f"+old.id.charAt(2)).appendChild(document.getElementById("Rh"+old.id.charAt(2)));
                        }
                    }
                    castleRight = castleRight.replace("KQ", "");
                    kingPos[0] = old.id;
                }
                
                old.id = old.id.charAt(0) + info.id;

                if (turn == "White") { //White
                    turn = "Black";
                }
                else if (turn == "Black") { //Black
                    turn = "White";
                }

                document.getElementById('turn').innerText = 'Turn: ' + turn;

                old = "";

                select = false;

                for (let n = 0; n < highlighted.length; n++) {
                    document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
                }
                
                highlighted = [];
            }

            if (passant.includes(info.id)) {
                info.appendChild(old);
                for (let n = 0; n < passantPiece.length; n++) {
                    if (passantPiece[n].id.charAt(1) == info.id.charAt(0)) {
                        document.getElementById(passantPiece[n].id.substr(1)).removeChild(passantPiece[n]);
                    }
                }

                old.id = old.id.charAt(0) + info.id;

                if (turn == "White") { //White
                    turn = "Black";
                }
                else if (turn == "Black") { //Black
                    turn = "White";
                }

                document.getElementById('turn').innerText = 'Turn: ' + turn;

                old = "";

                select = false;

                for (let n = 0; n < passant.length; n++) {
                    document.getElementById(passant[n]).className = document.getElementById(passant[n]).className.substring(0, 19);
                }
                
                passant = [];

                for (let n = 0; n < highlighted.length; n++) {
                    document.getElementById(highlighted[n]).className = document.getElementById(highlighted[n]).className.substring(0, 19);
                }
                
                highlighted = [];
            }
        }
    }
}
//-------------------en passant not done

function pawnMovement(t, j=highlighted.length) { // side = movement direction 
    let z = 0;
    let val = 0;
    
    let ls = (turn == "White") ? w : b;

    let side = (ls == w) ? 1 : -1;

    if (parseInt(t.id.charAt(2)) != 8 & parseInt(t.id.charAt(2)) != 0 ) { //check board top/bottom
        z = t.id.charAt(1) + `${parseInt(t.id.charAt(2)) + side}`;
        if (document.getElementById(z).childElementCount == 0) {
            highlighted[j] = z;
            document.getElementById(highlighted[j]).className += " viable";
            j++;
        }
    }
    
    val = ((side == 1) ? 2 : 7);
    if (t.id.charAt(2) == val) {
        z = t.id.charAt(1) + `${parseInt(t.id.charAt(2)) + side*2}`;
        if (document.getElementById(z).childElementCount == 0) {
            highlighted[j] = z;
            document.getElementById(highlighted[j]).className += " viable";
            j++;
        }
    }

    val = ((side == 1) ? 5 : 4);
    if (lets.indexOf(t.id.charAt(1)) != 7) {///////////////////
        z = lets[lets.indexOf(t.id.charAt(1))+1] + `${parseInt(t.id.charAt(2)) + side}`;
        if (document.getElementById(z).childElementCount == 1) {
            if (!ls.includes(document.getElementById(z).childNodes[0].id.charAt(0))) {
                highlighted[j] = z;
                document.getElementById(highlighted[j]).className += " viable";
                j++;
            }
        }

        passantPiece = [];

        z = lets[lets.indexOf(t.id.charAt(1))+1] + `${parseInt(t.id.charAt(2))}`;//en passant
        if (document.getElementById(z).childElementCount == 1) {
            if (!ls.includes(document.getElementById(z).childNodes[0].id.charAt(0)) & document.getElementById(z).childNodes[0].name == "yup") {
                passantPiece[passantPiece.length] = document.getElementById(z).childNodes[0];
                z = lets[lets.indexOf(t.id.charAt(1))+1] + `${parseInt(t.id.charAt(2)) + side}`;
                if (document.getElementById(z).childElementCount == 0 & t.id.charAt(2) == val) {
                    passant[passant.length] = z;
                    document.getElementById(z).className += " viable";
                }
                else {
                    passantPiece[passantPiece.length-1] = "";
                }
            }
        }
    }

    if (lets.indexOf(t.id.charAt(1)) != 0) {
        z = lets[lets.indexOf(t.id.charAt(1))-1] + `${parseInt(t.id.charAt(2)) + side}`;
        if (document.getElementById(z).childElementCount == 1) {
            if (!ls.includes(document.getElementById(z).childNodes[0].id.charAt(0))) {
                highlighted[j] = z;
                document.getElementById(highlighted[j]).className += " viable";
                j++;
            }
        }
        z = lets[lets.indexOf(t.id.charAt(1))-1] + `${parseInt(t.id.charAt(2))}`;//en passant
        if (document.getElementById(z).childElementCount == 1) {
            if (!ls.includes(document.getElementById(z).childNodes[0].id.charAt(0)) & document.getElementById(z).childNodes[0].name == "yup") {
                z = lets[lets.indexOf(t.id.charAt(1))-1] + `${parseInt(t.id.charAt(2)) + side}`;
                if (document.getElementById(z).childElementCount == 0 & t.id.charAt(2) == val) {
                    passant[passant.length] = z;
                    document.getElementById(z).className += " viable";
                }
            }
        }
    }
}

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
    let z = 0;
    let ls = "";
    let long = lets.indexOf(t.id.charAt(1));
    let lat = parseInt(t.id.charAt(2));

    ls = (w.includes(t.id.charAt(0))) ? b : w;
    
    let side = (ls == w) ? 1 : -1;

    if (lat != 8 & long != 0) { //----------------up-left
        z = lets[long - 1] + `${lat + 1}`;
        movement(z, ls);
    }
    if (lat != 1 & long != 7) { //-------------------down-right
        z = lets[long + 1] + `${lat - 1}`;
        movement(z, ls);
    }
    if (lat != 8 & long != 7) { //----------------up-right
        z = lets[long + 1] + `${lat + 1}`;
        movement(z, ls);
    }
    if (lat != 1 & long != 0) { //-------------------down-left
        z = lets[long - 1] + `${lat - 1}`;
        movement(z, ls);
    }
    if (lat != 1) {//--------------down
        z = lets[long] + `${lat-1}`;
        movement(z, ls);
    }
    if (lat != 8) {//------------up
        z = lets[long] + `${lat+1}`;
        movement(z, ls);
    }
    if (long != 0) {//--------------left
        z = lets[long-1] + `${lat}`;
        movement(z, ls);
    }
    if (long != 7) {//------------right
        z = lets[long+1] + `${lat}`;
        movement(z, ls);
    }

    castlePiece = [];

    ///////////////
    if (side == -1) {
        if (document.getElementById("b1").childElementCount == 0) {
            if (document.getElementById("c1").childElementCount == 0) {
                if (document.getElementById("d1").childElementCount == 0 & castleRight.includes("Q")) {
                    z = lets[2] + "1";
                    highlighted[highlighted.length] = z;
                    document.getElementById(z).className += " viable";
    
                    z = lets[0] + "1";
                    castlePiece[castlePiece.length] = document.getElementById(z);
                }
            }
        }

        if (document.getElementById("f1").childElementCount == 0) {
            if (document.getElementById("g1").childElementCount == 0 & castleRight.includes("K")) {
                z = lets[6] + "1";
                highlighted[highlighted.length] = z;
                document.getElementById(z).className += " viable";
        
                z = lets[7] + "1";
                castlePiece[castlePiece.length] = document.getElementById(z);
            }
        }
    }
    else if (side == 1) {
        if (document.getElementById("b8").childElementCount == 0) {
            if (document.getElementById("c8").childElementCount == 0) {
                if (document.getElementById("d8").childElementCount == 0 & castleRight.includes("q")) {
                    z = lets[2] + "8";
                    highlighted[highlighted.length] = z;
                    document.getElementById(z).className += " viable";
    
                    z = lets[0] + "8";
                    castlePiece[castlePiece.length] = document.getElementById(z);
                }
            }
        }

        if (document.getElementById("f8").childElementCount == 0) {
            if (document.getElementById("g8").childElementCount == 0 & castleRight.includes("k")) {
                z = lets[6] + "8";
                highlighted[highlighted.length] = z;
                document.getElementById(z).className += " viable";
        
                z = lets[7] + "8";
                castlePiece[castlePiece.length] = document.getElementById(z);
            }
        }
    }
    ///castling
}

function knightMovement(t, j=highlighted.length) {
    let z = 0;
    let ls = "";
    let long = lets.indexOf(t.id.charAt(1));
    let lat = parseInt(t.id.charAt(2));

    ls = (w.includes(t.id.charAt(0))) ? b : w;
    

    if (lat < 7 & long > 0) { //----------------up-left
        z = lets[long - 1] + `${lat + 2}`;
        movement(z, ls);
    }
    if (lat < 7 & long < 7) { //----------------up-right
        z = lets[long + 1] + `${lat + 2}`;
        movement(z, ls);
    }

    if (lat < 8 & long > 1) { //----------------left-up
        z = lets[long - 2] + `${lat + 1}`;
        movement(z, ls);
    }
    if (lat < 8 & long < 6) { //----------------right-up
        z = lets[long + 2] + `${lat + 1}`;
        movement(z, ls);
    }

    if (lat > 2 & long > 0) { //----------------down-left
        z = lets[long - 1] + `${lat - 2}`;
        movement(z, ls);
    }
    if (lat > 2 & long < 7) { //----------------down-right
        z = lets[long + 1] + `${lat - 2}`;
        movement(z, ls);
    }
    if (lat > 1 & long > 1) { //----------------left-down
        z = lets[long - 2] + `${lat - 1}`;
        movement(z, ls);
    }
    if (lat > 1 & long < 6) { //----------------right-down
        z = lets[long + 2] + `${lat - 1}`;
        movement(z, ls);
    }
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

    

function lookForChecks(t) {
    let z = 0;
    let ls = "";
    let long = lets.indexOf(t.id.charAt(1));
    let lat = parseInt(t.id.charAt(2));

    ls = (w.includes(t.id.charAt(0))) ? b : w;
    

    if (lat < 7 & long > 0) { //----------------up-left
        z = lets[long - 1] + `${lat + 2}`;
        invalid[invalid.length] = z;
    }
    if (lat < 7 & long < 7) { //----------------up-right
        z = lets[long + 1] + `${lat + 2}`;
        invalid[invalid.length] = z;
    }

    if (lat < 8 & long > 1) { //----------------left-up
        z = lets[long - 2] + `${lat + 1}`;
        invalid[invalid.length] = z;
    }
    if (lat < 8 & long < 6) { //----------------right-up
        z = lets[long + 2] + `${lat + 1}`;
        invalid[invalid.length] = z;
    }

    if (lat > 2 & long > 0) { //----------------down-left
        z = lets[long - 1] + `${lat - 2}`;
        invalid[invalid.length] = z;
    }
    if (lat > 2 & long < 7) { //----------------down-right
        z = lets[long + 1] + `${lat - 2}`;
        invalid[invalid.length] = z;
    }
    if (lat > 1 & long > 1) { //----------------left-down
        z = lets[long - 2] + `${lat - 1}`;
        invalid[invalid.length] = z;
    }
    if (lat > 1 & long < 6) { //----------------right-down
        z = lets[long + 2] + `${lat - 1}`;
        invalid[invalid.length] = z;
    }

    for (let n = 1; n < 8; n++) { //----------------up-left--------------------------------------
        if (long-n == -1) break;
        if (lat+n == 9) break;

        z = lets[long - n] + `${lat + n}`;
    }
    for (let n = 1; n < 8; n++) { //----------------down-right
        if (lat-n == 0) break;
        if (long+n == 8) break;

        z = lets[long + n] + `${lat - n}`;
    }

    for (let n = 1; n < 8; n++) { //----------------up-right
        if (long+n == 8) break;
        if (lat+n == 9) break;

        z = lets[long + n] + `${lat + n}`;
    }
    for (let n = 1; n < 8; n++) { //----------------down-left-----------------------------------------
        if (lat-n == 0) break;
        if (long-n == -1) break;

        z = lets[long - n] + `${lat - n}`;
    }
    for (let n = 1; n < (9-lat); n++) { //----------------up
        z = t.id.charAt(1) + `${lat + n}`;
    }
    for (let n = 1; n < 8; n++) { //------------down
        if (lat-n == 0) break;
        z = t.id.charAt(1) + `${lat - n}`;
    }

    for (let n = 1; n < 8; n++) { //---------left
        if (long-n == -1) break;
        z = lets[long-n] + `${lat}`;
    }

    for (let n = 1; n < 8; n++) {//----------------right
        if (long+n == 8) break;
        z = lets[long+n] + `${lat}`;
    }
}