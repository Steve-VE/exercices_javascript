if(!!navigator.getGamepads){
    // Browser supports the Gamepad API
    window.addEventListener("gamepadconnected", gamepadHandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
}

let controller = null;
let buttonsPressed = [];
let gamepads;


function gamepadHandler(e) {
    console.log("Gamepad connected");
    
    gamepads = navigator.getGamepads();
    
    if(gamepads !== null){
        //controller = e.gamepad; // Fonctionne aussi, fait référence au gamepad qui déclenche l'event
        controller = navigator.getGamepads()[0];
        
        let buttonsName = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'select', 'start'];
        let buttonsValue = {
            'a': null, 
            'b': null, 
            'x': null, 
            'y': null, 
            'lb': null, 
            'rb': null, 
            'lt': null, 
            'rt': null, 
            'select': null, 
            'start': null
        };
        controller.buttons_name = buttonsValue;
        
        for(let i = 0; i < controller.buttons.length; i++){
            if(buttonsName[i] !== null){
                controller.buttons_name[buttonsName[i]] = controller.buttons[i];
                // controller.buttons_name[a] = controller.buttons[i];
            }
        }
        console.log(controller);
    }
}

function disconnecthandler(e) {
    console.log("Gamepad disconnect");
    controller = {};
    buttonsPressed = [];
    gamepads = null;
}
  

function gamepadUpdateHandler() {
    if(controller !== null){

        buttonsPressed = [];
        
        if(controller.id != "xinput"){ // Si on est pas sur firefox...
            controller = navigator.getGamepads()[0]; // ... on a besoin de recharger le gamepad pour mettre à jour la valeur des boutons
        }
        
        if(controller.buttons) {
            for(let b = 0; b < controller.buttons.length; b++) {
                if(controller.buttons[b].pressed) {
                    buttonsPressed.push(b);
                    console.log(b);
                }
            }
        }
    }
}


function gamepadButtonPressedHandler(button) {
    let press = false;

    for(let i = 0; i < buttonsPressed.length; i++) {
        if(buttonsPressed[i] == button) {
            press = true;
        }
    }
    return press;
}



