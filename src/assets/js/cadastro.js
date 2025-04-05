/**
 * Script para a página de cadastro
 */

import { validarEmail, validarTelefone } from '../../utils/validators.js';
import { aplicarMascaraTelefone } from '../../utils/dom.js';

// Elementos DOM
const formCadastro = document.getElementById('form-cadastro');
const inputTelefone = document.getElementById('telefone');
const inputCPF = document.getElementById('cpf');
const inputSenha = document.getElementById('senha');
const inputConfirmarSenha = document.getElementById('confirmar-senha');

/**
 * Inicializa a página de cadastro
 */
function inicializarCadastro() {
    // Aplicar máscaras
    if (inputTelefone) {
        aplicarMascaraTelefone(inputTelefone);
    }
    
    if (inputCPF) {
        aplicarMascaraCPF(inputCPF);
    }
    
    // Configurar validação de senha
    if (inputSenha && inputConfirmarSenha) {
        inputConfirmarSenha.addEventListener('input', validarConfirmacaoSenha);
    }
    
    // Configurar envio do formulário
    if (formCadastro) {
        formCadastro.addEventListener('submit', cadastrarUsuario);
    }
    
    console.log('Página de cadastro inicializada');
}

/**
 * Aplica máscara ao input de CPF
 * @param {HTMLElement} elemento - Elemento input para aplicar a máscara
 */
function aplicarMascaraCPF(elemento) {
    elemento.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');
        
        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }
        
        if (valor.length > 9) {
            e.target.value = `${valor.substring(0, 3)}.${valor.substring(3, 6)}.${valor.substring(6, 9)}-${valor.substring(9)}`;
        } else if (valor.length > 6) {
            e.target.value = `${valor.substring(0, 3)}.${valor.substring(3, 6)}.${valor.substring(6)}`;
        } else if (valor.length > 3) {
            e.target.value = `${valor.substring(0, 3)}.${valor.substring(3)}`;
        } else {
            e.target.value = valor;
        }
    });
}

/**
 * Valida se a confirmação de senha está igual à senha
 */
function validarConfirmacaoSenha() {
    const senha = inputSenha.value;
    const confirmacao = inputConfirmarSenha.value;
    
    if (confirmacao && senha !== confirmacao) {
        inputConfirmarSenha.setCustomValidity('As senhas não conferem');
        
        // Adicionar classe de erro visual
        inputConfirmarSenha.classList.add('erro');
        
        // Adicionar mensagem de erro
        let mensagemErro = inputConfirmarSenha.nextElementSibling;
        if (!mensagemErro || !mensagemErro.classList.contains('mensagem-erro')) {
            mensagemErro = document.createElement('div');
            mensagemErro.className = 'mensagem-erro';
            mensagemErro.textContent = 'As senhas não conferem';
            mensagemErro.style.color = '#e53935';
            mensagemErro.style.fontSize = '0.8rem';
            mensagemErro.style.marginTop = '5px';
            inputConfirmarSenha.insertAdjacentElement('afterend', mensagemErro);
        }
    } else {
        inputConfirmarSenha.setCustomValidity('');
        
        // Remover classe de erro visual
        inputConfirmarSenha.classList.remove('erro');
        
        // Remover mensagem de erro
        const mensagemErro = inputConfirmarSenha.nextElementSibling;
        if (mensagemErro && mensagemErro.classList.contains('mensagem-erro')) {
            mensagemErro.remove();
        }
    }
}

/**
 * Realiza o cadastro do usuário
 * @param {Event} event - Evento de submit
 */
function cadastrarUsuario(event) {
    event.preventDefault();
    
    // Obter valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmacaoSenha = document.getElementById('confirmar-senha').value;
    const endereco = document.getElementById('endereco').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value;
    const aceitouTermos = document.querySelector('input[name="termos"]').checked;
    
    // Validação básica
    if (!nome || !cpf || !email || !telefone || !senha || !confirmacaoSenha || !endereco || !bairro || !cidade || !estado) {
        mostrarMensagem('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar email
    if (!validarEmail(email)) {
        mostrarMensagem('Por favor, insira um email válido.');
        return;
    }
    
    // Validar telefone
    if (!validarTelefone(telefone)) {
        mostrarMensagem('Por favor, insira um telefone válido.');
        return;
    }
    
    // Validar CPF
    if (!validarCPF(cpf)) {
        mostrarMensagem('Por favor, insira um CPF válido.');
        return;
    }
    
    // Validar senhas
    if (senha !== confirmacaoSenha) {
        mostrarMensagem('As senhas não conferem.');
        return;
    }
    
    // Validar termos
    if (!aceitouTermos) {
        mostrarMensagem('Você deve aceitar os termos de uso e política de privacidade.');
        return;
    }
    
    // Em um ambiente real, enviaria os dados para o backend para cadastro
    // Aqui vamos apenas simular o cadastro para fins de demonstração
    
    // Mostrar mensagem de loading
    const botao = formCadastro.querySelector('button[type="submit"]');
    const textoOriginal = botao.textContent;
    botao.textContent = 'Cadastrando...';
    botao.disabled = true;
    
    // Simular chamada ao backend
    setTimeout(() => {
        // Simular cadastro bem-sucedido
        mostrarMensagem('Cadastro realizado com sucesso! Redirecionando para o login...', 'sucesso');
        
        // Simular redirecionamento
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }, 1500);
}

/**
 * Valida um CPF
 * @param {string} cpf - CPF a ser validado (com ou sem formatação)
 * @returns {boolean} - Retorna true se o CPF for válido
 */
function validarCPF(cpf) {
    // Remove caracteres especiais
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }
    
    // Valida dígitos verificadores
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    
    soma = 0;
    
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    
    return true;
}

/**
 * Mostra uma mensagem na tela
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem (erro, sucesso)
 */
function mostrarMensagem(texto, tipo = 'erro') {
    // Verificar se já existe uma mensagem
    let mensagemElement = document.querySelector('.mensagem-cadastro');
    
    // Criar elemento se não existir
    if (!mensagemElement) {
        mensagemElement = document.createElement('div');
        mensagemElement.className = 'mensagem-cadastro';
        formCadastro.insertAdjacentElement('beforebegin', mensagemElement);
    }
    
    // Definir classe e texto
    mensagemElement.className = `mensagem-cadastro ${tipo}`;
    mensagemElement.textContent = texto;
    
    // Adicionar estilos
    Object.assign(mensagemElement.style, {
        padding: '10px 15px',
        marginBottom: '20px',
        borderRadius: '4px',
        textAlign: 'center',
        fontWeight: '500',
        width: '100%',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    if (tipo === 'erro') {
        Object.assign(mensagemElement.style, {
            backgroundColor: '#ffebee',
            color: '#c62828',
            border: '1px solid #ffcdd2'
        });
    } else if (tipo === 'sucesso') {
        Object.assign(mensagemElement.style, {
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            border: '1px solid #c8e6c9'
        });
    }
    
    // Rolar para o topo do formulário para exibir a mensagem
    mensagemElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Mostrar com fade in
    setTimeout(() => {
        mensagemElement.style.opacity = '1';
    }, 10);
    
    // Remover após alguns segundos se for sucesso
    if (tipo === 'sucesso') {
        setTimeout(() => {
            mensagemElement.style.opacity = '0';
            setTimeout(() => {
                mensagemElement.remove();
            }, 300);
        }, 3000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarCadastro); 