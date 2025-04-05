/**
 * Script principal para inicialização da aplicação
 */

// Importar componentes
import { Menu } from '../../components/Menu.js';
import { Newsletter } from '../../components/Newsletter.js';
import { FormularioAgendamento } from '../../components/FormularioAgendamento.js';

// Inicialização da página atual
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando a aplicação...');

    // Identificar a página atual
    const paginaAtual = obterPaginaAtual();
    console.log(`Página atual: ${paginaAtual}`);

    // Inicializar componentes comuns
    inicializarComponentesComuns();

    // Inicializar componentes específicos da página
    switch (paginaAtual) {
        case 'landing':
            inicializarPaginaLanding();
            break;
        case 'login':
            // Script carregado separadamente
            break;
        case 'cadastro':
            // Script carregado separadamente
            break;
        case 'agendamento':
            // Script carregado separadamente
            break;
        default:
            console.log('Página não identificada para inicialização específica');
    }
    
    // Ativar os tooltips do Bootstrap
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

/**
 * Obtém o nome da página atual com base na URL
 * @returns {string} Nome da página sem extensão .html
 */
function obterPaginaAtual() {
    const path = window.location.pathname;
    const pagina = path.split('/').pop() || 'index.html';
    
    return pagina.replace('.html', '');
}

/**
 * Inicializa componentes comuns a todas as páginas
 */
function inicializarComponentesComuns() {
    // Inicializar menu - agora é tratado pelo Bootstrap
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        // Bootstrap 5 já cuida do comportamento do menu através de atributos data-bs-*
        console.log('Menu inicializado via Bootstrap');
    }

    // Inicializar newsletter
    const formNewsletter = document.getElementById('form-newsletter');
    if (formNewsletter) {
        formNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Obrigado por se inscrever! Em breve você receberá nossas novidades.');
                this.reset();
            }
        });
    }
}

/**
 * Inicializa componentes específicos da página landing
 */
function inicializarPaginaLanding() {
    // Adicionar animações de scroll com Bootstrap
    const elementosAnimados = document.querySelectorAll('.animate-on-scroll');
    
    if (elementosAnimados.length > 0) {
        // Configurar observador de interseção para animações ao rolar
        const observador = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Opcional: parar de observar após animar
                    // observador.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observar todos os elementos animados
        elementosAnimados.forEach(elemento => {
            observador.observe(elemento);
        });
    }
    
    // Adicionar comportamento de smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para compensar a navbar fixa
                    behavior: 'smooth'
                });
                
                // Atualizar links ativos na navbar
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Inicializar carrossel do Bootstrap, se existir
    if (typeof bootstrap !== 'undefined' && document.querySelector('.carousel')) {
        const carouselList = [].slice.call(document.querySelectorAll('.carousel'));
        carouselList.map(function (carouselEl) {
            return new bootstrap.Carousel(carouselEl, {
                interval: 5000
            });
        });
    }
}

// Exportar funções úteis para uso em outros scripts
export { obterPaginaAtual, inicializarComponentesComuns }; 