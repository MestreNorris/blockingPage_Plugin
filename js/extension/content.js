/**
 * Escuta mensagens vindo de Background.
 */
chrome.runtime.onMessage.addListener(gotMessage);

/**
 * Realiza o bloqueio de todas as entrada de dados (inputs), menos as inseridas na ferramenta.
 * @param {String} request - Mensagem a ser recebida.
 * @param {*} sender
 * @param {Boolean} sendResponse - Envia true para confirmação de resposta e fechamento de ouvinte.
 * @returns - True para método síncrono.
 */
function gotMessage(request, sender, sendResponse) {
    if (request.msg == 'block') {

        const inputWords = [
            'user', 'username', 'usuario', 'email', 'usuário', 'usuário ou e-mail', 'cpf ou cnpj',
            'cpf', 'cnpj', 'session[username_or_email]', 'name', 'phone_number', 'login', 'register', 'user[login]'
        ];

        const inputs = document.querySelectorAll('input');
        if (inputs.length > 0) {
            for (let index = 0; index < inputs.length; index++) {
                if (inputs[index].type == 'text') {
                    const name = (inputs[index].name).toLowerCase();
                    const placeholder = (inputs[index].placeholder).toLowerCase();

                    for (let j = 0; j < inputWords.length; j++) {
                        if ((inputWords[j] == name) || (inputWords[j] == placeholder)) {
                            applyStyle(inputs[index]);
                        }
                    }
                } else if ((inputs[index].type == 'email') || (inputs[index].type == 'password') ||
                    (inputs[index].type == 'tel') || (inputs[index].type == 'number')) {
                    applyStyle(inputs[index]);
                }
            }
        }
    }
    sendResponse(true);
    return true;
}

/**
 * 
 * @param {HTMLInputElement} input - Entrada de dados aonde será realizado o bloqueio.
 */
function applyStyle(input) {
    input.placeholder = 'BlockingPage';
    input.style["border"] = "1px solid red";
    input.style["background"] = "rgb(255 0 0 / 2%)";
    input.style["-webkit-text-fill-color"] = "red";
    input.disabled = 'true';
}



