/**
 * Script para a página de login
 */

// Elementos DOM
const formLogin = document.getElementById('form-login');

/**
 * Inicializa a página de login
 */
function inicializarLogin() {
    // Configurar envio do formulário
    if (formLogin) {
        formLogin.addEventListener('submit', autenticarUsuario);
    }
    
    console.log('Página de login inicializada');
}

/**
 * Realiza a autenticação do usuário
 * @param {Event} event - Evento de submit
 */
function autenticarUsuario(event) {
    event.preventDefault();
    
    // Obter valores dos campos
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validação básica
    if (!username || !password) {
        mostrarMensagem('Por favor, preencha todos os campos.');
        return;
    }
    
    // Em um ambiente real, enviaria os dados para o backend para autenticação
    // Aqui vamos apenas simular a autenticação para fins de demonstração
    
    // Simulate login
    console.log('Tentando login com:', { username, password });
    
    // Mostrar mensagem de loading
    const botao = formLogin.querySelector('button[type="submit"]');
    const textoOriginal = botao.textContent;
    botao.textContent = 'Entrando...';
    botao.disabled = true;
    
    // Simular chamada ao backend
    setTimeout(() => {
        // Simular credenciais de exemplo
        if (username === 'teste@teste.com' && password === 'senha123') {
            // Login bem-sucedido
            mostrarMensagem('Login bem-sucedido! Redirecionando...', 'sucesso');
            
            // Simular redirecionamento
            setTimeout(() => {
                window.location.href = 'agendamento.html';
            }, 1000);
        } else {
            // Login falhou
            mostrarMensagem('Usuário ou senha incorretos.');
            botao.textContent = textoOriginal;
            botao.disabled = false;
        }
    }, 1500);
}

/**
 * Mostra uma mensagem na tela
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem (erro, sucesso)
 */
function mostrarMensagem(texto, tipo = 'erro') {
    // Verificar se já existe uma mensagem
    let mensagemElement = document.querySelector('.mensagem-login');
    
    // Criar elemento se não existir
    if (!mensagemElement) {
        mensagemElement = document.createElement('div');
        mensagemElement.className = 'mensagem-login';
        formLogin.insertAdjacentElement('afterend', mensagemElement);
    }
    
    // Definir classe e texto
    mensagemElement.className = `mensagem-login ${tipo}`;
    mensagemElement.textContent = texto;
    
    // Adicionar estilos
    Object.assign(mensagemElement.style, {
        padding: '10px 15px',
        marginTop: '15px',
        borderRadius: '4px',
        textAlign: 'center',
        fontWeight: '500',
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
document.addEventListener('DOMContentLoaded', inicializarLogin); 