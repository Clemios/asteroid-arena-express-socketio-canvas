var SERVER_ADDRESS = document.URL;

    var ctx = document.getElementById("paper").getContext("2d");
    var playerListElem = document.getElementById("playerList");

    var name = prompt("Please enter a name:");
    if( name === null || name === "" || name === "null" ) {
        name = "Anonymous";
    }

    var keys = {};

    ctx.lineWidth = 2;
    ctx.font = "normal 14px sans-serif";

    function render( state )
    {
        ctx.clearRect( 0, 0, 1024, 768 );
        var newListHTML = "";
console.log('state', state);
        // Draw players
        for( var i = 0 ; i < state.p.length ; ++i )
        {
            ctx.save();
            ctx.strokeStyle = "#"+state.p[i][5];
            ctx.fillStyle = "#"+state.p[i][5];
            ctx.translate( state.p[i][0], state.p[i][1] );
            ctx.fillText( state.p[i][3], 12, -10 );
            ctx.rotate( state.p[i][2] );
            ctx.beginPath();
            ctx.moveTo( -12, -10 );
            ctx.lineTo( -12,  10 );
            ctx.lineTo(  12,   0 );
            ctx.lineTo( -12, -10 );
            ctx.lineTo( -12,   0 );
            ctx.closePath();
            ctx.stroke();
            if( i==state.i && keys[38] ) {
                ctx.beginPath();
                ctx.moveTo( -12, -4 );
                ctx.lineTo( -22,  0 );
                ctx.lineTo( -12,  4 );
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();

            newListHTML += "<li>"+state.p[i][3]+" - "+state.p[i][4]+"</li>";
        }

        // Draw bullets
        for( var i = 0 ; i < state.b.length ; ++i )
        {
            ctx.fillStyle = "#"+state.b[i][2];

            ctx.save();
            ctx.translate( state.b[i][0], state.b[i][1] );
            ctx.fillRect( -4, -4, 4, 4 );
            ctx.restore();
        }

        playerListElem.innerHTML = newListHTML;
    }

    // Connect to the server and bind events.
    var socket = io.connect( SERVER_ADDRESS );
    socket.on("connect", function ()
    {
        window.onkeydown = function(e) {
            keys[ e.keyCode ] = true;
            socket.send( JSON.stringify(keys) );
        }
        window.onkeyup = function(e) {
            delete keys[ e.keyCode ];
            socket.send( JSON.stringify(keys) );
        }

        socket.on("message", function(data) {
            var state = JSON.parse(data);
            render( state );
        });

        socket.send(JSON.stringify({name:name}));
    });