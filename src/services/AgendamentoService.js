/**
 * Serviço de Agendamento
 * Gerencia a comunicação com o backend para agendamentos
 */

/**
 * Verifica os horários disponíveis para uma data específica
 * @param {string} data - A data no formato YYYY-MM-DD
 * @returns {Promise<Array>} - Promise com array de horários disponíveis
 */
export async function verificarHorariosDisponiveis(data) {
    // Em uma implementação real, isso seria uma chamada a uma API
    // Aqui vamos simular o comportamento
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const dataObj = new Date(data);
            const diaSemana = dataObj.getDay(); // 0 = Domingo, 6 = Sábado
            
            if (diaSemana === 0) {
                resolve([]); // Domingo não tem horários disponíveis
            } else if (diaSemana === 6) {
                resolve(['09:00', '10:00', '11:00', '12:00']); // Sábado tem horário reduzido
            } else {
                resolve(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']); // Dias úteis
            }
        }, 300); // Simulando um pequeno delay de rede
    });
}

/**
 * Envia um agendamento para o servidor
 * @param {Object} dadosAgendamento - Objeto com os dados do agendamento
 * @returns {Promise<Object>} - Promise com resultado do agendamento
 */
export async function enviarAgendamento(dadosAgendamento) {
    // Em uma implementação real, isso seria uma chamada POST a uma API
    // Aqui vamos simular o comportamento
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Dados de agendamento enviados:', dadosAgendamento);
            
            // Simulando uma resposta bem-sucedida
            resolve({
                sucesso: true,
                mensagem: 'Agendamento realizado com sucesso!',
                codigoAgendamento: Math.random().toString(36).substring(2, 10).toUpperCase(),
                data: dadosAgendamento.data,
                horario: dadosAgendamento.horario
            });
        }, 700); // Simulando um pequeno delay de rede
    });
}

/**
 * Cancela um agendamento existente
 * @param {string} codigoAgendamento - O código do agendamento a ser cancelado
 * @returns {Promise<Object>} - Promise com resultado do cancelamento
 */
export async function cancelarAgendamento(codigoAgendamento) {
    // Em uma implementação real, isso seria uma chamada DELETE a uma API
    // Aqui vamos simular o comportamento
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Solicitação de cancelamento para o código:', codigoAgendamento);
            
            // Simulando uma resposta bem-sucedida
            resolve({
                sucesso: true,
                mensagem: 'Agendamento cancelado com sucesso!'
            });
        }, 500); // Simulando um pequeno delay de rede
    });
} 