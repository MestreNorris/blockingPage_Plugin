/**
 * Cria data atual com fuso horário brasileiro. 
 * @returns - Data atual formatada em string com fuso horário brasileiro.
 */
const dateNow = () => {
    const date = new Date().toLocaleString("pt-br", { timeZone: "America/Sao_Paulo" });
    return (date.split(' ')[0]);
}

/**
 * Gerador de ids únicos
 * @returns - retorna id
 */
const uid = () => { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

