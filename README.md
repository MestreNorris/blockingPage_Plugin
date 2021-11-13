# BlockingPage
Este projeto propõe o desenvolvimento de um plugin para detecção e bloqueio de links de phising utilizados em listas negras. A abordagem de detecção destes links envolve a utilização de banco de dados de listas negras existentes, para bloqueio e remoção de qualquer tipo de página maliciosa acessada pelos usuários.

A ferramenta também apresenta uma abordagem para proteção dos dados, limitando a inserção de dados sensíveis do usuário à apenas páginas seguras. Quanto a proteção de dados sensíveis como senhas, é proposto um bloqueio de entrada de dados à todas as páginas acessadas pelo usuário sendo sua liberação realizada somente após a inserção do link deste na ferramenta.

# Arquitetura
O repositório apresentado contempla apenas parte da ferramenta, este da qual pode ser identificado através do diagrama de arquitetura de alto nível, pelo nome de BlockingPage.

<img src="images/arquitetura.png" alt="Arquitetura do sistema" width="90%" height="90%">

A ferramenta foi desenvolvida em duas partes.

Part1 (BlockingPage_Extensão) - Plugin desenvolvido para navegador para identificação, bloqueio, remoção e notificação de links de phising. Ela também contempla a limitação de inserção de dados sensíveis do usuário a somente páginas seguras que o usuário descrever.

Part 2 (BlockingPage_API) - Api para extração de links de phising em apis externas, utilizado para fornecer dados de páginas inseguras para plugin bloquear.

## Requisitos
* Navegador Google Chrome