/**
 * Script para a página de agendamento
 */

import { aplicarMascaraTelefone } from '../../utils/dom.js';
import { verificarHorariosDisponiveis } from '../../services/AgendamentoService.js';

// Elementos DOM
const selectServico = document.getElementById('servico');
const inputData = document.getElementById('data');
const selectHorario = document.getElementById('horario');
const radioConsultorio = document.querySelector('input[value="consultorio"]');
const radioDomiciliar = document.querySelector('input[value="domiciliar"]');
const campoEndereco = document.querySelector('.endereco-domiciliar');
const formularioAgendamento = document.getElementById('formulario-agendamento');
const detalhesServicos = [
    document.getElementById('detalhes-consulta'),
    document.getElementById('detalhes-medicamentos'),
    document.getElementById('detalhes-curativos'),
    document.getElementById('detalhes-domiciliar')
];

const diasCalendario = document.getElementById('dias-calendario');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');

// Variáveis de estado
let currentDate = new Date();
let selectedDate = null;
let diasDisponiveis = [];

/**
 * Inicializa a página de agendamento
 */
function inicializarAgendamento() {
    // Configurar evento para exibir detalhes do serviço selecionado
    if (selectServico) {
        selectServico.addEventListener('change', atualizarDetalhesServico);
    }

    // Configurar eventos de tipo de atendimento
    if (radioDomiciliar && radioConsultorio) {
        radioDomiciliar.addEventListener('change', toggleEnderecoField);
        radioConsultorio.addEventListener('change', toggleEnderecoField);
    }

    // Configurar calendário
    renderizarCalendario(currentDate);
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', () => mudarMes(-1));
    }
    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', () => mudarMes(1));
    }

    // Configurar seleção de data
    if (inputData) {
        inputData.addEventListener('change', async () => {
            if (inputData.value) {
                selectedDate = new Date(inputData.value);
                renderizarCalendario(selectedDate);
                await carregarHorariosDisponiveis();
            }
        });
    }

    // Configurar envio do formulário
    if (formularioAgendamento) {
        formularioAgendamento.addEventListener('submit', enviarFormulario);
    }
    
    // Configurar data mínima (hoje)
    if (inputData) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        inputData.min = `${ano}-${mes}-${dia}`;
    }
    
    // Mostrar detalhes do primeiro serviço por padrão
    atualizarDetalhesServico();
    
    console.log('Página de agendamento inicializada');
}

/**
 * Alterna a exibição do campo de endereço domiciliar
 */
function toggleEnderecoField() {
    if (radioDomiciliar.checked) {
        campoEndereco.classList.remove('d-none');
    } else {
        campoEndereco.classList.add('d-none');
    }
}

/**
 * Atualiza os detalhes do serviço selecionado
 */
function atualizarDetalhesServico() {
    const servicoSelecionado = selectServico ? selectServico.value : 'consulta';
    
    // Esconde todos os detalhes
    detalhesServicos.forEach(item => {
        if (item) item.classList.add('d-none');
    });
    
    // Mostra apenas o detalhe do serviço selecionado
    if (servicoSelecionado) {
        const detalheItem = document.getElementById(`detalhes-${servicoSelecionado}`);
        if (detalheItem) {
            detalheItem.classList.remove('d-none');
        } else if (detalhesServicos[0]) {
            // Fallback para o primeiro serviço se o selecionado não for encontrado
            detalhesServicos[0].classList.remove('d-none');
        }
    }
}

/**
 * Carrega os horários disponíveis para a data selecionada
 */
async function carregarHorariosDisponiveis() {
    if (!inputData.value) return;
    
    try {
        selectHorario.innerHTML = '<option value="">Carregando horários...</option>';
        const horariosDisponiveis = await verificarHorariosDisponiveis(inputData.value);
        
        selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
        
        if (horariosDisponiveis.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum horário disponível';
            selectHorario.appendChild(option);
        } else {
            horariosDisponiveis.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                selectHorario.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar horários:', error);
        selectHorario.innerHTML = '<option value="">Erro ao carregar horários</option>';
    }
}

/**
 * Renderiza o calendário para o mês especificado
 * @param {Date} date - Data a ser exibida no calendário
 */
function renderizarCalendario(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Atualiza o título do mês
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    currentMonthElement.textContent = `${meses[month]} ${year}`;
    
    // Limpa o calendário
    diasCalendario.innerHTML = '';
    
    // Obtém o primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    
    // Obtém o último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Cria a primeira linha da tabela
    let row = document.createElement('tr');
    
    // Adiciona dias vazios para alinhar com o dia da semana correto
    for (let i = 0; i < startingDay; i++) {
        const cell = document.createElement('td');
        row.appendChild(cell);
    }
    
    // Simula dias disponíveis (em uma implementação real, esses dados viriam do backend)
    carregarDiasDisponiveis(year, month);
    
    // Adiciona todos os dias do mês
    let currentDay = 1;
    for (let i = startingDay; i < 7; i++) {
        if (currentDay > totalDays) break;
        const cell = criarCelulaDia(currentDay, month, year);
        row.appendChild(cell);
        currentDay++;
    }
    
    // Adiciona a primeira linha à tabela
    diasCalendario.appendChild(row);
    
    // Adiciona as demais linhas da tabela
    while (currentDay <= totalDays) {
        row = document.createElement('tr');
        
        for (let i = 0; i < 7; i++) {
            if (currentDay > totalDays) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            } else {
                const cell = criarCelulaDia(currentDay, month, year);
                row.appendChild(cell);
                currentDay++;
            }
        }
        
        diasCalendario.appendChild(row);
    }
}

/**
 * Cria uma célula de tabela representando um dia do calendário
 * @param {number} day - Dia do mês
 * @param {number} month - Mês (0-11)
 * @param {number} year - Ano
 * @returns {HTMLTableCellElement} Célula da tabela
 */
function criarCelulaDia(day, month, year) {
    const cell = document.createElement('td');
    const dayElement = document.createElement('div');
    
    dayElement.textContent = day;
    dayElement.classList.add('p-2');
    
    const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const checkDate = new Date(currentDateString);
    
    // Verifica se é um dia passado
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (checkDate < hoje) {
        dayElement.classList.add('text-muted');
        dayElement.style.backgroundColor = '#f5f5f5';
        dayElement.style.cursor = 'default';
    } 
    // Verifica se é um dia disponível
    else if (ehDiaDisponivel(day, month, year)) {
        dayElement.classList.add('rounded-circle');
        dayElement.style.backgroundColor = 'var(--bg-medium)';
        dayElement.style.color = 'var(--color-primary)';
        dayElement.style.cursor = 'pointer';
        
        // Adiciona evento para seleção de data
        dayElement.addEventListener('click', () => selecionarData(day, month, year));
    } 
    // Dias não disponíveis
    else {
        dayElement.classList.add('text-muted');
        dayElement.style.backgroundColor = '#f9f9f9';
        dayElement.style.cursor = 'default';
    }
    
    // Verifica se é a data selecionada
    if (selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year) {
        dayElement.classList.add('rounded-circle');
        dayElement.style.backgroundColor = 'var(--color-success)';
        dayElement.style.color = 'white';
        dayElement.style.fontWeight = 'bold';
    }
    
    cell.appendChild(dayElement);
    return cell;
}

/**
 * Carrega os dias disponíveis para o mês (simulado)
 * @param {number} year - Ano
 * @param {number} month - Mês (0-11)
 */
function carregarDiasDisponiveis(year, month) {
    // Em uma implementação real, isso seria carregado do backend
    // Por enquanto, vamos simular dias disponíveis (dias úteis)
    diasDisponiveis = [];
    
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= ultimoDia; i++) {
        const data = new Date(year, month, i);
        const diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado
        
        // Verifica se é um dia útil (seg-sex) ou sábado
        if (diaSemana !== 0) { // Não é domingo
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            // Só adiciona se não for um dia passado
            if (data >= hoje) {
                diasDisponiveis.push(i);
            }
        }
    }
}

/**
 * Verifica se um dia específico está disponível para agendamento
 */
function ehDiaDisponivel(day, month, year) {
    return diasDisponiveis.includes(day);
}

/**
 * Seleciona uma data no calendário e atualiza o input de data
 */
function selecionarData(day, month, year) {
    const data = new Date(year, month, day);
    
    // Atualiza a data selecionada
    selectedDate = data;
    
    // Atualiza o input de data
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    inputData.value = formattedDate;
    
    // Recarrega o calendário para mostrar a seleção
    renderizarCalendario(data);
    
    // Carrega horários disponíveis
    carregarHorariosDisponiveis();
}

/**
 * Navega entre os meses do calendário
 */
function mudarMes(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderizarCalendario(currentDate);
}

/**
 * Processa o envio do formulário de agendamento
 * @param {Event} event - Evento de submit do formulário
 */
function enviarFormulario(event) {
    event.preventDefault();
    
    // Validar formulário
    const servico = selectServico.value;
    const data = inputData.value;
    const horario = selectHorario.value;
    const tipoAtendimento = document.querySelector('input[name="tipo-atendimento"]:checked').value;
    
    if (!servico || !data || !horario) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (tipoAtendimento === 'domiciliar') {
        const endereco = document.getElementById('endereco').value;
        if (!endereco) {
            alert('Para atendimento domiciliar, é necessário informar o endereço.');
            return;
        }
    }
    
    // Aqui seria feita a requisição para o backend para salvar o agendamento
    // Por enquanto, apenas simulamos o sucesso
    alert('Agendamento realizado com sucesso!');
    
    // Limpar formulário ou redirecionar para confirmação
    // window.location.href = 'confirmacao-agendamento.html';
}

// Inicializa a página quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarAgendamento); 