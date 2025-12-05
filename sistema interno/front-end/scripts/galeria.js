// Carrusel de imágenes con navegación manual y automática
class Carrusel {
    constructor() {
        this.galeriaTrack = document.querySelector('.galeria__track');
        this.imagenes = document.querySelectorAll('.galeria__imagen');
        this.botonIzquierdo = document.querySelector('.galeria__boton--izquierdo');
        this.botonDerecho = document.querySelector('.galeria__boton--derecho');
        this.indicadores = document.querySelectorAll('.galeria__indicador');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImagen = document.querySelector('.lightbox__imagen');
        this.cerrarLightbox = document.querySelector('.lightbox__cerrar');
        this.botonAnteriorLightbox = document.querySelector('.lightbox__boton--anterior');
        this.botonSiguienteLightbox = document.querySelector('.lightbox__boton--siguiente');
        
        this.imagenesOriginales = Array.from(this.imagenes).slice(0, 6); // Solo las primeras 6 (no duplicadas)
        this.indiceActual = 0;
        this.totalImagenes = this.imagenesOriginales.length;
        this.autoScrollActivo = true;
        this.scrollInterval = null;
        
        this.inicializarEventos();
        this.iniciarAutoScroll();
        this.actualizarIndicadores();
    }
    
    inicializarEventos() {
        // Navegación del carrusel
        this.botonIzquierdo.addEventListener('click', () => this.navegar(-1));
        this.botonDerecho.addEventListener('click', () => this.navegar(1));
        
        // Lightbox
        this.imagenes.forEach((imagen, index) => {
            imagen.addEventListener('click', () => this.abrirLightbox(index));
        });
        
        this.cerrarLightbox.addEventListener('click', () => this.cerrarLightboxFunc());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.cerrarLightboxFunc();
        });
        
        // Navegación en lightbox
        this.botonAnteriorLightbox.addEventListener('click', () => this.navegarLightbox(-1));
        this.botonSiguienteLightbox.addEventListener('click', () => this.navegarLightbox(1));
        
        // Indicadores
        this.indicadores.forEach((indicador, index) => {
            indicador.addEventListener('click', () => this.irAImagen(index));
        });
        
        // Pausar auto scroll al interactuar
        this.galeriaTrack.addEventListener('mouseenter', () => this.pausarAutoScroll());
        this.galeriaTrack.addEventListener('mouseleave', () => this.reanudarAutoScroll());
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => this.manejarTeclado(e));
    }
    
    navegar(direccion) {
        this.indiceActual = (this.indiceActual + direccion + this.totalImagenes) % this.totalImagenes;
        this.actualizarPosicion();
        this.actualizarIndicadores();
        this.reiniciarAutoScroll();
    }
    
    actualizarPosicion() {
        // Para navegación manual, movemos el track con transición suave
        const desplazamiento = -this.indiceActual * (350 + 20); // ancho imagen + gap
        this.galeriaTrack.style.transform = `translateX(${desplazamiento}px)`;
        this.galeriaTrack.style.animation = 'none'; // Desactivamos la animación automática temporalmente
    }
    
    irAImagen(indice) {
        this.indiceActual = indice;
        this.actualizarPosicion();
        this.actualizarIndicadores();
        this.reiniciarAutoScroll();
    }
    
    actualizarIndicadores() {
        this.indicadores.forEach((indicador, index) => {
            if (index === this.indiceActual) {
                indicador.classList.add('galeria__indicador--activo');
            } else {
                indicador.classList.remove('galeria__indicador--activo');
            }
        });
    }
    
    iniciarAutoScroll() {
        if (!this.autoScrollActivo) return;
        
        this.scrollInterval = setInterval(() => {
            this.indiceActual = (this.indiceActual + 1) % this.totalImagenes;
            this.actualizarPosicion();
            this.actualizarIndicadores();
        }, 4000); // Cambia cada 4 segundos
    }
    
    pausarAutoScroll() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }
    }
    
    reanudarAutoScroll() {
        if (this.autoScrollActivo && !this.scrollInterval) {
            this.iniciarAutoScroll();
        }
    }
    
    reiniciarAutoScroll() {
        this.pausarAutoScroll();
        this.reanudarAutoScroll();
    }
    
    abrirLightbox(indice) {
        this.indiceLightboxActual = indice;
        this.lightboxImagen.src = this.imagenesOriginales[indice].src;
        this.lightboxImagen.alt = this.imagenesOriginales[indice].alt;
        
        this.lightbox.style.display = 'flex';
        setTimeout(() => {
            this.lightbox.classList.add('mostrando');
        }, 10);
        
        // Pausar auto scroll cuando el lightbox está abierto
        this.pausarAutoScroll();
    }
    
    cerrarLightboxFunc() {
        this.lightbox.classList.remove('mostrando');
        setTimeout(() => {
            this.lightbox.style.display = 'none';
        }, 300);
        
        // Reanudar auto scroll cuando se cierra el lightbox
        this.reanudarAutoScroll();
    }
    
    navegarLightbox(direccion) {
        this.indiceLightboxActual = (this.indiceLightboxActual + direccion + this.totalImagenes) % this.totalImagenes;
        this.lightboxImagen.src = this.imagenesOriginales[this.indiceLightboxActual].src;
        this.lightboxImagen.alt = this.imagenesOriginales[this.indiceLightboxActual].alt;
    }
    
    manejarTeclado(e) {
        if (this.lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'ArrowLeft':
                    this.navegarLightbox(-1);
                    break;
                case 'ArrowRight':
                    this.navegarLightbox(1);
                    break;
                case 'Escape':
                    this.cerrarLightboxFunc();
                    break;
            }
        }
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Carrusel();
});