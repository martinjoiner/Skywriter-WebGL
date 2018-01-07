
document.addEventListener("keydown", function(e){
    switch(e.key) {
        case 't': plane.toggleSmoke(); break;
        case 'w': plane.pitchUp(); break;
        case 's': plane.pitchDown(); break;
        // Switch plane mode between controls and path
        case 'p': pilot.toggleMode(); break;
    }
}, false);
