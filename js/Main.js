// ---------- Efectos parallax ----------
// data-speed: movimiento horizontal con el scroll (+ derecha, - izquierda)
// data-vy:    movimiento vertical con el scroll (- sube más rápido)
// data-rot:   giro (grados por píxel de scroll)
// data-depth: cuánto sigue el movimiento del mouse (+/- cambia la dirección)
const capas = document.querySelectorAll("[data-speed], [data-vy], [data-depth], [data-rot]");
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (capas.length && !sinMovimiento) {
    let mouseX = 0, mouseY = 0, suaveX = 0, suaveY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    });

    function animar() {
        const scroll = window.scrollY;
        // Suaviza el movimiento del mouse para que se sienta fluido
        suaveX += (mouseX - suaveX) * 0.08;
        suaveY += (mouseY - suaveY) * 0.08;

        capas.forEach((capa) => {
            const d = capa.dataset;
            const x = scroll * (d.speed || 0) + suaveX * (d.depth || 0);
            const y = scroll * (d.vy || 0) + suaveY * (d.depth || 0);
            const giro = scroll * (d.rot || 0);
            capa.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${giro}deg)`;
        });
        requestAnimationFrame(animar);
    }
    animar();
}

// ---------- Elementos que aparecen al hacer scroll ----------
const apariciones = document.querySelectorAll(".aparece");
if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });
    apariciones.forEach((el) => observador.observe(el));
} else {
    apariciones.forEach((el) => el.classList.add("visible"));
}

// ---------- Encabezado que cambia al bajar ----------
const encabezado = document.querySelector("header");
const marcarEncabezado = () => encabezado.classList.toggle("scrolled", window.scrollY > 40);
marcarEncabezado();
window.addEventListener("scroll", marcarEncabezado, { passive: true });

// ---------- Onda al hacer clic en los botones ----------
document.querySelectorAll(".boton").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        const r = boton.getBoundingClientRect();
        const t = Math.max(r.width, r.height);
        const onda = document.createElement("span");
        onda.className = "onda";
        onda.style.cssText = `width:${t}px;height:${t}px;left:${e.clientX - r.left - t / 2}px;top:${e.clientY - r.top - t / 2}px`;
        boton.appendChild(onda);
        setTimeout(() => onda.remove(), 600);
    });
});

// ---------- Tarjetas que se inclinan con el mouse ----------
if (!sinMovimiento && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt, .tarjeta-interna").forEach((tarjeta) => {
        tarjeta.addEventListener("mousemove", (e) => {
            const r = tarjeta.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            tarjeta.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
        });
        tarjeta.addEventListener("mouseleave", () => { tarjeta.style.transform = ""; });
    });
}

// ---------- Formulario de contacto (envía a WhatsApp) ----------
const formulario = document.querySelector("#formContacto");

if (formulario) {
    // Cambia este número: código de país + número, sin espacios ni signos
    const NUMERO_WHATSAPP = "573000000000";

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.querySelector("#nombre").value.trim();
        const correo = document.querySelector("#correo").value.trim();
        const mensaje = document.querySelector("#mensaje").value.trim();

        const texto = `Hola, soy ${nombre} (${correo}). ${mensaje}`;
        window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank");
        formulario.reset();
    });
}