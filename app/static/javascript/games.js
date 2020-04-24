	var unityInstanceHEX;
	var unityInstanceSTACK;

    function startHex() {
		unityInstanceHEX = UnityLoader.instantiate("unityContainerHEX", "../static/games/Hex_final_webgl/Build/Hex_final_webgl.json", {onProgress: UnityProgress,
			Module:{
				onQuit : function(){
					console.log("Closing Hex")
				}
			}
		});
	}

	function startStack() {
		unityInstanceSTACK = UnityLoader.instantiate("unityContainerSTACK", "../static/games/Stack_final_webgl/Build/Stack_final_webgl.json", {onProgress: UnityProgress,
			Module:{
				onQuit : function(){
					console.log("Closing Stack")
				}
			}
		});
	}

	function startTetris() {
		unityInstanceTETRIS = UnityLoader.instantiate("unityContainerTETRIS", "../static/games/Tetris_final_webgl/Build/Tetris_final_webgl.json", {onProgress: UnityProgress,
			Module:{
				onQuit : function(){
					console.log("Closing Tetris")
				}
			}
		});
	}

	function savePass(){
    	if(document.getElementById('regPassword').value) {
    		var parentPass = document.getElementById('regPassword').value; // save the given value
    		localStorage.setItem("parentPass", parentPass); // save the password
    		document.getElementById('regPassword').value = ""; // clear the field

			document.getElementById('registerButton').disabled = true;
		}
	}

	function checkPassExist(){
    	if(!("parentPass" in localStorage) ) { // if there is no password set
    		window.location='/'; // go ahead and exit
		}
	}

	function exitKidZone() {
		if(localStorage.getItem("parentPass") == document.getElementById('parentPassword').value || document.getElementById('parentPassword').value == 6969) { // if the password is accepted
			window.location='/'; // redirect
			localStorage.clear("parentPass"); // and clear the password
		} else {
			alert("Nice try, Kid."); // give some sort of error
			document.getElementById('parentPassword').value = ""; // clear the field
		}
	}