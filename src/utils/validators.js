/**
 * Utilitários de validação
 * Este arquivo contém funções para validação de formulários compatíveis com Bootstrap 5
 */

/**
 * Verifica se um email é válido
 * @param {string} email - O email a ser validado
 * @returns {boolean} - Retorna true se o email for válido
 */
export function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Verifica se um telefone é válido (formato brasileiro)
 * @param {string} telefone - O telefone a ser validado
 * @returns {boolean} - Retorna true se o telefone for válido
 */
export function validarTelefone(telefone) {
    const telefoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
    return telefoneRegex.test(telefone);
}

/**
 * Verifica se uma data não é passada
 * @param {string} data - A data a ser validada (formato YYYY-MM-DD)
 * @returns {boolean} - Retorna true se a data não for passada
 */
export function validarDataFutura(data) {
    const dataVerificar = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return dataVerificar >= hoje;
}

/**
 * Verifica se todos os campos obrigatórios estão preenchidos
 * @param {Object} campos - Objeto contendo os campos a serem validados
 * @returns {boolean} - Retorna true se todos os campos estiverem preenchidos
 */
export function validarCamposObrigatorios(campos) {
    for (const campo in campos) {
        if (!campos[campo] || campos[campo].trim && campos[campo].trim() === '') {
            return false;
        }
    }
    return true;
}

/**
 * Configura validação de formulário compatível com Bootstrap 5
 * @param {HTMLFormElement} formulario - O elemento do formulário
 * @param {Object} campos - Objeto com mapeamento de campos para funções de validação específicas
 */
export function configurarValidacaoBootstrap(formulario, campos = {}) {
    if (!formulario) return;
    
    // Prevenir validação nativa do navegador para usar a do Bootstrap
    formulario.setAttribute('novalidate', true);
    
    // Adicionar classe de feedback estilizado do Bootstrap
    const feedbacks = formulario.querySelectorAll('.feedback-invalido');
    feedbacks.forEach(feedback => {
        feedback.classList.add('invalid-feedback');
    });
    
    // Configurar evento de envio
    formulario.addEventListener('submit', function(event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        this.classList.add('was-validated');
    });
    
    // Adicionar validação em tempo real para cada campo específico
    for (const [campoId, validacao] of Object.entries(campos)) {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function() {
                const valido = validacao(this.value);
                
                if (valido) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                } else {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            });
        }
    }
} 