/**
 * Aciona audio de limpeza se tiver habilitado
 * @param {Object} config - Config.sounds == true (Ativado), Config.sounds == false (desativado). 
 */
const executeAudio = (config) => {
    if (config.sounds) {
        let audioElement = document.createElement("audio");
        audioElement.setAttribute("src", "../../audio/recycle.wav");
        audioElement.setAttribute("autoplay:false", "autoplay");
        audioElement.play();
    }
}