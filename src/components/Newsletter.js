/**
 * Componente de Newsletter
 * Gerencia o comportamento do formulário de newsletter com Bootstrap 5
 */

import { validarEmail } from '../utils/validators.js';

/**
 * Inicializa o componente de newsletter
 */
export function inicializarNewsletter() {
    const formNewsletter = document.getElementById('form-newsletter');
    if (formNewsletter) {
        formNewsletter.addEventListener('submit', validarFormularioNewsletter);
        
        // Adicionar validação em tempo real para formulários Bootstrap
        const emailInput = formNewsletter.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    this.classList.remove('is-valid');
                    this.classList.remove('is-invalid');
                } else if (validarEmail(this.value.trim())) {
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

/**
 * Valida o formulário de newsletter
 * @param {Event} event - O evento de submit
 */
function validarFormularioNewsletter(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const emailNewsletter = emailInput.value.trim();
    
    if (!emailNewsletter) {
        // Feedback visual com Bootstrap
        emailInput.classList.add('is-invalid');
        
        // Usar toast do Bootstrap se disponível, ou fallback para alert
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            mostrarToast('Por favor, insira seu email para se inscrever.', 'danger');
        } else {
            alert('Por favor, insira seu email para se inscrever.');
        }
        return;
    }
    
    // Validar email
    if (!validarEmail(emailNewsletter)) {
        // Feedback visual com Bootstrap
        emailInput.classList.add('is-invalid');
        
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            mostrarToast('Por favor, insira um email válido.', 'danger');
        } else {
            alert('Por favor, insira um email válido.');
        }
        return;
    }
    
    // Feedback visual positivo
    emailInput.classList.add('is-valid');
    emailInput.classList.remove('is-invalid');
    
    // Simular envio
    enviarInscricaoNewsletter(emailNewsletter);
}

/**
 * Envia a inscrição de newsletter (simulação)
 * @param {string} email - O email para inscrição
 */
function enviarInscricaoNewsletter(email) {
    console.log('Inscrevendo email na newsletter:', email);
    
    // Simulação de envio bem-sucedido
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        mostrarToast('Obrigado por se inscrever na nossa newsletter!', 'success');
    } else {
        alert('Obrigado por se inscrever na nossa newsletter!');
    }
    
    // Limpar formulário
    document.getElementById('form-newsletter').reset();
}

/**
 * Mostra um toast Bootstrap
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo de toast (success, danger, warning, etc)
 */
function mostrarToast(mensagem, tipo = 'primary') {
    // Criar um elemento toast se não existir
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Criar o toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    // Inicializar e mostrar o toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    
    toast.show();
}

/**
 * Classe Newsletter para uso com abordagem orientada a objetos
 */
export class Newsletter {
    constructor(container) {
        this.container = container;
    }
    
    inicializar() {
        inicializarNewsletter();
    }
} 