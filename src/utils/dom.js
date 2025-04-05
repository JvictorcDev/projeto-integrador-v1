/**
 * Utilitários para manipulação do DOM
 * Este arquivo contém funções para manipulação do DOM e animações compatíveis com Bootstrap 5
 */

/**
 * Anima elementos quando eles entram na área visível da tela
 * @param {string} seletores - Seletores CSS para os elementos a serem animados
 * @param {string} classeAnimacao - Classe CSS para animar (padrão: 'animate__animated')
 */
export function animarElementosVisíveis(seletores, classeAnimacao = 'animate__animated') {
    const elementos = document.querySelectorAll(seletores);
    
    // Cria um observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Quando o elemento entra no viewport
            if (entry.isIntersecting) {
                const elemento = entry.target;
                
                // Verifica se o elemento tem um tipo específico de animação definido
                const tipoAnimacao = elemento.dataset.animacao || 'animate__fadeIn';
                
                // Aplica as classes de animação
                elemento.classList.add(classeAnimacao, tipoAnimacao);
                
                // Após a animação terminar, podemos parar de observar
                observer.unobserve(elemento);
            }
        });
    }, {
        threshold: 0.1 // Gatilho quando pelo menos 10% do elemento está visível
    });
    
    // Observa todos os elementos selecionados
    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}

/**
 * Aplica mask ao input telefone
 * @param {HTMLElement} elemento - Elemento input para aplicar a máscara
 */
export function aplicarMascaraTelefone(elemento) {
    elemento.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');
        
        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }
        
        if (valor.length > 7) {
            e.target.value = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
        } else if (valor.length > 2) {
            e.target.value = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
        } else if (valor.length > 0) {
            e.target.value = `(${valor}`;
        }
    });
}

/**
 * Implementa scroll suave para links internos usando Bootstrap 5
 */
export function implementarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just a # link
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular offset considerando possíveis elementos fixos
                const navbarHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 0;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight - 20, // 20px de margem adicional
                    behavior: 'smooth'
                });
                
                // Atualizar a URL com o hash, mas sem fazer o scroll automático
                history.pushState(null, null, targetId);
                
                // Se tiver um menu de navegação que colapsa no mobile, feche-o após clicar
                const navbarToggler = document.querySelector('.navbar-collapse.show');
                if (navbarToggler) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarToggler);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    } else {
                        navbarToggler.classList.remove('show');
                    }
                }
            }
        });
    });
}

/**
 * Adiciona classe ativa ao link do menu quando a seção estiver visível
 * Compatível com o sistema de navegação do Bootstrap 5
 */
export function destacarMenuAtivo() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (!navLinks.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove a classe active de todos os links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Adiciona a classe active ao link correspondente
                const linkAtivo = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
                if (linkAtivo) {
                    linkAtivo.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-80px 0px -80% 0px', // Considerando navbar fixa no topo
        threshold: 0
    });
    
    // Observa todas as seções que têm um link no menu
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#') && targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                observer.observe(targetElement);
            }
        }
    });
}

/**
 * Inicializa tooltips do Bootstrap 5
 * @param {string} seletor - Seletor para os elementos que terão tooltip (padrão: '[data-bs-toggle="tooltip"]')
 */
export function inicializarTooltips(seletor = '[data-bs-toggle="tooltip"]') {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = document.querySelectorAll(seletor);
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
}

/**
 * Ativa os controles de acessibilidade baseados no Bootstrap 5
 */
export function ativarControlesAcessibilidade() {
    // Aplica roles ARIA apropriados para elementos Bootstrap
    document.querySelectorAll('.alert').forEach(alert => {
        if (!alert.hasAttribute('role')) {
            alert.setAttribute('role', 'alert');
        }
    });
    
    // Melhora o foco visual para elementos interativos
    const estiloFoco = document.createElement('style');
    estiloFoco.textContent = `
        .btn:focus, .form-control:focus, .form-select:focus, .form-check-input:focus {
            box-shadow: 0 0 0 0.25rem rgba(108, 43, 217, 0.25) !important;
        }
    `;
    document.head.appendChild(estiloFoco);
} 