document.addEventListener('DOMContentLoaded', () => {
    // CURSOR
    const punto = document.getElementById('cursor-punto');
    const anillo = document.getElementById('cursor-anillo');
    let cursorIniciado = false;
    let mouseX = 0;
    let mouseY = 0;
    let animationFrameId = null;

    if (punto && anillo) {
        function updateCursorPosition() {
            punto.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            anillo.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            animationFrameId = null;
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!cursorIniciado) {
                document.body.classList.add('custom-cursor-active');
                punto.style.opacity = '1';
                anillo.style.opacity = '1';
                cursorIniciado = true;
            }
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateCursorPosition);
            }
        });
    }

    // NAV DOTS
    const dots = document.querySelectorAll('.dot');
    const secciones = document.querySelectorAll('section');

    if (dots.length > 0 && secciones.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dots.forEach(dot => dot.classList.remove('activo'));
                    const dotActivo = document.querySelector(`.dot[data-section="${entry.target.id}"]`);
                    if (dotActivo) dotActivo.classList.add('activo');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '-50% 0px -50% 0px'
        });

        secciones.forEach(seccion => observer.observe(seccion));

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const id = dot.getAttribute('data-section');
                const seccion = document.getElementById(id);
                if (seccion) {
                    seccion.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // CARRUSEL
    const VELOCIDAD_CARRUSEL = 100;
    const track = document.querySelector('.carrusel-track');
    
    if (track) {
        const items = document.querySelectorAll('.logo-item');

        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        function iniciarCarrusel() {
            let totalWidth = 0;
            items.forEach(item => {
                totalWidth += item.offsetWidth;
            });

            track.style.setProperty('--scroll-width', `-${totalWidth}px`);
            const duracion = totalWidth / VELOCIDAD_CARRUSEL;
            track.style.animationDuration = `${duracion}s`;
            track.classList.add('animado');
        }

        window.addEventListener('load', iniciarCarrusel);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(iniciarCarrusel, 250);
        });
    }

    // PARTICLES (activado también en móviles, con menos partículas para no afectar el rendimiento)
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {

        const esMobile = window.innerWidth < 768;

        particlesJS("particles-js", {
            particles: {
                number: { value: esMobile ? 30 : 70 },
                color: { value: "#0057ff" },
                shape: { type: "circle" },
                opacity: { value: 0.3 },
                size: { value: 3 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#0057ff",
                    opacity: 0.15,
                    width: 1
                },
                move: { enable: true, speed: 2 }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: !esMobile, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 180 },
                    push: { particles_nb: 4 }
                }
            }
        });
    }

    // FORMULARIO DE CONTACTO (AJAX)
    const formContacto = document.getElementById('contacto-form');
    if (formContacto) {
        const btnTexto = formContacto.querySelector('.btn-texto');
        const btnLoading = formContacto.querySelector('.btn-loading');
        const formSuccess = formContacto.querySelector('.form-success');
        const formError = formContacto.querySelector('.form-error');

        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();

            formSuccess.style.display = 'none';
            formError.style.display = 'none';
            btnTexto.style.display = 'none';
            btnLoading.style.display = 'inline-block';

            const formData = new FormData(formContacto);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(data.message || 'Hubo un error al enviar. Intentá de nuevo.');
                }
                window.location.href = 'gracias.html';
            })
            .catch(err => {
                formError.textContent = `❌ ${err.message || 'Hubo un error al enviar. Intentá de nuevo.'}`;
                formError.style.display = 'block';
            })
            .finally(() => {
                btnTexto.style.display = 'inline-block';
                btnLoading.style.display = 'none';
            });
        });
    }

    // MENÚ MÓVIL
    const btnMenu = document.querySelector('.menu-hamburguesa');
    const menuMovil = document.querySelector('.menu-movil');
    const linksMovil = document.querySelectorAll('.menu-movil a');

    if (btnMenu && menuMovil) {
        btnMenu.setAttribute('role', 'button');
        btnMenu.setAttribute('aria-expanded', 'false');

        btnMenu.addEventListener('click', () => {
            const esActivo = btnMenu.classList.toggle('activo');
            menuMovil.classList.toggle('activo');
            
            btnMenu.setAttribute('aria-expanded', esActivo ? 'true' : 'false');
        });

        linksMovil.forEach(link => {
            link.addEventListener('click', () => {
                btnMenu.classList.remove('activo');
                menuMovil.classList.remove('activo');
                btnMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }
});