const ExtHandler = {

    // when extension is loaded
    onLoad(app, target) {},

    // when extension is unloaded
    onUnload(app) {
        // TODO
    },

    // when device is connected
    onConnect(app, device) {
        // TODO
    },

    // when device is disconnected
    onDisconnect(app, device) {
        // TODO
    },

    // when stop button is clicked
    onStopAll(app, device) {
        // TODO
    },

    // before switch to upload mode
    beforeChangeUploadMode(app, device) {
        // TODO
        return true;
    },

    // before switch to debug mode
    beforeChangeDebugMode(app, device) {
        // TODO
        return true;
    },

    // after switched to upload mode
    afterChangeUploadMode(app, device) {
        // TODO
        return true;
    },

    // after switched to debug mode
    afterChangeDebugMode(app, device) {
        // TODO
        return true;
    },

    // when device is selected
    onSelect(app, device) {
        // TODO
    },

    // when device is unselected
    onUnselect(app, device) {
        // TODO
    },

    // before upload code
    beforeCodeUpload(app, device) {
        // TODO
    },

    // after code uploaded
    afterCodeUpload(app, device) {
        // TODO
    },

    // when receiving and reading byte
    onRead(app, device) {
        // TODO
    }
}

export default ExtHandler;