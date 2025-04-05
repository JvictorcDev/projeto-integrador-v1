/**
 * Componente de Menu
 * Gerencia o comportamento do menu principal da aplicação com Bootstrap 5
 */

/**
 * Inicializa o componente de menu usando Bootstrap
 */
export function inicializarMenu() {
    // Com o Bootstrap 5, o comportamento do menu móvel é gerenciado automaticamente 
    // através dos atributos data-bs-toggle e data-bs-target
    
    // Ativar o link correspondente à seção atual quando a página é carregada
    const secaoAtual = window.location.hash || '#inicio';
    const linkAtivo = document.querySelector(`.navbar-nav .nav-link[href="${secaoAtual}"]`);
    
    if (linkAtivo) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        linkAtivo.classList.add('active');
    }
    
    // Ativar mudança de link ativo ao scroll
    window.addEventListener('scroll', ativarLinkAoScroll);
}

/**
 * Ativa o link correspondente à seção visível na tela
 */
function ativarLinkAoScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Ajuste para compensar a navbar
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Classe Menu para uso com abordagem orientada a objetos
 */
export class Menu {
    constructor(container) {
        this.container = container;
    }
    
    inicializar() {
        inicializarMenu();
    }
} 