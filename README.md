# BlockingPage
 Este projeto propõe o desenvolvimento de um plugin para detecção e bloqueio de links de phising utilizados em listas negras. A abordagem de detecção destes links envolve a utilização de banco de dados de listas negras existentes, para bloqueio e remoção de qualquer tipo de página maliciosa acessada pelos usuários. A ferramenta também apresenta uma abordagem para proteção dos dados, limitando a inserção de dados sensíveis do usuário à apenas páginas seguras. Quanto a proteção de dados sensíveis como senhas, é proposto um bloqueio de entrada de dados à todas as páginas acessadas pelo usuário sendo sua liberação realizada somente após a inserção do link deste na ferramenta.

# Arquitetura
<img src="images/arquitetura.png" alt="Arquitetura do sistema" width="90%" height="90%">

## Requisitos
* Navegador Google Chrome