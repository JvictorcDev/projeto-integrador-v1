/**
 * Componente de Formulário de Agendamento
 * Gerencia o comportamento do formulário de agendamento com Bootstrap 5
 */

import { validarEmail, validarTelefone, validarDataFutura, validarCamposObrigatorios } from '../utils/validators.js';
import { aplicarMascaraTelefone } from '../utils/dom.js';
import { verificarHorariosDisponiveis, enviarAgendamento } from '../services/AgendamentoService.js';

/**
 * Inicializa o componente de formulário de agendamento
 */
export function inicializarFormularioAgendamento() {
    const formularioAgendamento = document.getElementById('formulario-agendamento');
    const inputTelefone = document.getElementById('telefone');
    const inputData = document.getElementById('data');
    const selectHorario = document.getElementById('horario');
    const radioConsultorio = document.getElementById('tipo-consultorio');
    const radioDomiciliar = document.getElementById('tipo-domiciliar');
    const campoEndereco = document.querySelector('.endereco-domiciliar');
    
    // Aplicar máscara ao telefone
    if (inputTelefone) {
        aplicarMascaraTelefone(inputTelefone);
    }
    
    // Atualizar horários disponíveis quando a data for alterada
    if (inputData && selectHorario) {
        inputData.addEventListener('change', async () => {
            await atualizarHorariosDisponiveis();
        });
    }
    
    // Mostrar/ocultar campo de endereço baseado no tipo de atendimento
    if (radioDomiciliar && radioConsultorio && campoEndereco) {
        radioDomiciliar.addEventListener('change', () => {
            if (radioDomiciliar.checked) {
                campoEndereco.classList.remove('d-none');
            }
        });
        
        radioConsultorio.addEventListener('change', () => {
            if (radioConsultorio.checked) {
                campoEndereco.classList.add('d-none');
            }
        });
    }
    
    // Validação do formulário na submissão
    if (formularioAgendamento) {
        formularioAgendamento.addEventListener('submit', validarFormulario);
        
        // Adicionar validação em tempo real para os campos
        const camposValidaveis = formularioAgendamento.querySelectorAll('.form-control, .form-select');
        camposValidaveis.forEach(campo => {
            campo.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    this.classList.remove('is-valid');
                    this.classList.remove('is-invalid');
                    return;
                }
                
                let valido = true;
                
                // Validações específicas por tipo de campo
                if (this.type === 'email') {
                    valido = validarEmail(this.value.trim());
                } else if (this.id === 'telefone') {
                    valido = validarTelefone(this.value.trim());
                } else if (this.type === 'date') {
                    valido = validarDataFutura(this.value);
                }
                
                // Aplicar classes de validação do Bootstrap
                if (valido) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                } else {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            });
        });
    }
}

/**
 * Valida o formulário de agendamento
 * @param {Event} event - O evento de submit
 */
async function validarFormulario(event) {
    event.preventDefault();
    
    // Obter formulário
    const form = event.target;
    
    // Aplicar classe 'was-validated' para ativar estilos de validação do Bootstrap
    form.classList.add('was-validated');
    
    // Obter valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const tipoAtendimento = document.querySelector('input[name="tipo-atendimento"]:checked').value;
    const endereco = document.getElementById('endereco')?.value.trim() || '';
    const observacoes = document.getElementById('observacoes').value.trim();
    
    // Validar campos obrigatórios
    if (!validarCamposObrigatorios({nome, email, telefone, servico, data, horario})) {
        mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
    }
    
    // Validar email
    if (!validarEmail(email)) {
        document.getElementById('email').classList.add('is-invalid');
        mostrarMensagem('Por favor, insira um email válido.', 'danger');
        return;
    }
    
    // Validar telefone
    if (!validarTelefone(telefone)) {
        document.getElementById('telefone').classList.add('is-invalid');
        mostrarMensagem('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.', 'danger');
        return;
    }
    
    // Validar data
    if (!validarDataFutura(data)) {
        document.getElementById('data').classList.add('is-invalid');
        mostrarMensagem('Por favor, selecione uma data futura para o agendamento.', 'danger');
        return;
    }
    
    // Validar endereço para atendimento domiciliar
    if (tipoAtendimento === 'domiciliar' && !endereco) {
        document.getElementById('endereco').classList.add('is-invalid');
        mostrarMensagem('Para atendimento domiciliar, é necessário informar o endereço.', 'danger');
        return;
    }
    
    // Se tudo estiver válido, enviar para o serviço
    try {
        // Mostrar indicador de carregamento
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonOriginalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        
        const resultado = await enviarAgendamento({
            nome,
            email,
            telefone,
            servico,
            data,
            horario,
            tipoAtendimento,
            endereco,
            observacoes
        });
        
        // Restaurar botão
        submitButton.disabled = false;
        submitButton.innerHTML = buttonOriginalText;
        
        if (resultado.sucesso) {
            mostrarMensagem(`${resultado.mensagem} Seu código de agendamento é: ${resultado.codigoAgendamento}`, 'success');
            form.reset();
            form.classList.remove('was-validated');
            
            // Limpar classes de validação
            form.querySelectorAll('.is-valid, .is-invalid').forEach(campo => {
                campo.classList.remove('is-valid');
                campo.classList.remove('is-invalid');
            });
        } else {
            mostrarMensagem('Ocorreu um erro ao realizar o agendamento. Por favor, tente novamente.', 'danger');
        }
    } catch (erro) {
        console.error('Erro ao enviar agendamento:', erro);
        mostrarMensagem('Ocorreu um erro ao realizar o agendamento. Por favor, tente novamente.', 'danger');
        
        // Restaurar botão em caso de erro
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Confirmar Agendamento';
    }
}

/**
 * Atualiza os horários disponíveis com base na data selecionada
 */
async function atualizarHorariosDisponiveis() {
    const inputData = document.getElementById('data');
    const selectHorario = document.getElementById('horario');
    
    if (!inputData.value) {
        return;
    }
    
    try {
        // Limpar horários atuais
        selectHorario.innerHTML = '<option value="">Carregando horários...</option>';
        
        const dataEscolhida = new Date(inputData.value);
        const diaSemana = dataEscolhida.getDay(); // 0 = Domingo
        
        if (diaSemana === 0) {
            mostrarMensagem('Não atendemos aos domingos. Por favor, selecione outra data.', 'warning');
            inputData.value = '';
            selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
            return;
        }
        
        // Buscar horários disponíveis usando o serviço
        const horariosDisponiveis = await verificarHorariosDisponiveis(inputData.value);
        
        // Limpar mensagem de carregamento
        selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
        
        // Adicionar opções de horários
        if (horariosDisponiveis.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Nenhum horário disponível";
            selectHorario.appendChild(option);
            
            mostrarMensagem('Não há horários disponíveis para esta data. Por favor, selecione outra data.', 'warning');
        } else {
            horariosDisponiveis.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                selectHorario.appendChild(option);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar horários:', erro);
        selectHorario.innerHTML = '<option value="">Erro ao carregar horários</option>';
        mostrarMensagem('Erro ao carregar horários disponíveis. Por favor, tente novamente.', 'danger');
    }
}

/**
 * Exibe uma mensagem para o usuário usando o sistema de alertas do Bootstrap
 * @param {string} mensagem - A mensagem a ser exibida
 * @param {string} tipo - O tipo de alerta (success, danger, warning, info)
 */
function mostrarMensagem(mensagem, tipo = 'primary') {
    // Criar um elemento de alerta Bootstrap
    const alertaContainer = document.createElement('div');
    alertaContainer.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertaContainer.setAttribute('role', 'alert');
    
    alertaContainer.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Inserir o alerta no topo do formulário
    const form = document.getElementById('formulario-agendamento');
    form.parentNode.insertBefore(alertaContainer, form);
    
    // Configurar auto-hide
    if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
        const bsAlert = new bootstrap.Alert(alertaContainer);
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            bsAlert.close();
        }, 5000);
    }
}

/**
 * Classe FormularioAgendamento para uso com abordagem orientada a objetos
 */
export class FormularioAgendamento {
    constructor(container) {
        this.container = container;
    }
    
    inicializar() {
        inicializarFormularioAgendamento();
    }
} 