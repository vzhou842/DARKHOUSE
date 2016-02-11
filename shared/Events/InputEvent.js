(function() {
	var isBrowser = (typeof window !== 'undefined');

	var InputEventType = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		SPACE: 32,
	}

	/// @param type The InputEventType
	/// @param up true if keyUp, false if keyDown
	/// @param playerID The playerID (socketID) of the client this input is coming from
	function InputEvent(type, up, playerID) {
		this.type = type;
		this.up = up;
		this.playerID = playerID;
	}

	if (isBrowser) {
		window.InputEvent = InputEvent;
		window.InputEventType = InputEventType;
	} else {
		module.exports = {
			InputEvent: InputEvent,
			InputEventType: InputEventType,
		}
	}
})();