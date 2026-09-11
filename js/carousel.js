/**
 * Carousel de Depoimentos - Cafeteria Aurora
 * Gerencia a exibição e a navegação circular dos depoimentos de clientes.
 */

// 1. Base de dados dos 4 depoimentos dos clientes
const testimonials = [
    {
        id: 1,
        name: "Mariana Costa",
        role: "Designer de Interiores",
        quote: "O melhor cappuccino da cidade! Peço todo dia de manhã a caminho do trabalho e a entrega é impecável, chega super quentinho.",
        avatar: "assets/img/avatar-mariana.jpg",
        alt: "Foto da cliente Mariana Costa",
        rating: 5
    },
    {
        id: 2,
        name: "Lucas Fernandes",
        role: "Desenvolvedor de Software",
        quote: "O café espresso deles tem uma torra perfeita, com notas marcantes e zero amargor excessivo. Virou parada obrigatória antes de começar a codar!",
        avatar: "assets/img/avatar-lucas.jpg",
        alt: "Foto do cliente Lucas Fernandes",
        rating: 5
    },
    {
        id: 3,
        name: "Beatriz Mendes",
        role: "Arquiteta",
        quote: "Ambiente maravilhoso e atendimento nota 10. O Mocha com chocolate cremoso é simplesmente inesquecível. Recomendo de olhos fechados!",
        avatar: "assets/img/avatar-beatriz.jpg",
        alt: "Foto da cliente Beatriz Mendes",
        rating: 5
    },
    {
        id: 4,
        name: "Rodrigo Silveira",
        role: "Empreendedor",
        quote: "A rapidez e o cuidado com a embalagem para delivery me surpreenderam. O café chega sempre fresco, preservando todo o aroma e o sabor especial.",
        avatar: "assets/img/avatar-rodrigo.jpg",
        alt: "Foto do cliente Rodrigo Silveira",
        rating: 5
    }
];

// 2. Estado do Carousel
let currentIndex = 0;
let isAnimating = false;

// 3. Inicialização e Seleção de Elementos do DOM
document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".testimonial-card");
    const prevBtn = document.querySelector(".btn-carousel-prev");
    const nextBtn = document.querySelector(".btn-carousel-next");
    const dotsContainer = document.querySelector(".carousel-dots");

    if (!card) return;

    function generateStars(rating) {
        let starsHtml = "";
        for (let i = 0; i < rating; i++) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        }
        return starsHtml;
    }

    // Monta a estrutura interna do card com os dados do array
    function renderCardContent(data) {
        card.innerHTML = `
            <img src="${data.avatar}" alt="${data.alt}" class="testimonial-avatar">
            <div class="testimonial-stars">
                ${generateStars(data.rating || 5)}
            </div>
            <p class="testimonial-quote">"${data.quote.replace(/^"|"$/g, '')}"</p>
            <h4 class="testimonial-name">${data.name}</h4>
            <span class="testimonial-role">${data.role}</span>
        `;
    }

    function renderDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        testimonials.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("carousel-dot");
            dot.setAttribute("aria-label", `Ir para depoimento ${index + 1}`);
            if (index === currentIndex) {
                dot.classList.add("active");
            }
            dot.addEventListener("click", () => {
                if (index !== currentIndex && !isAnimating) {
                    const direction = index > currentIndex ? "next" : "prev";
                    currentIndex = index;
                    displayTestimonial(direction);
                }
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Atualiza o estado ativo dos dots
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function displayTestimonial(direction = "next") {
        if (isAnimating) return;
        isAnimating = true;

        const outClass = direction === "next" ? "slide-next-out" : "slide-prev-out";
        const inClass = direction === "next" ? "slide-next-in" : "slide-prev-in";

        card.classList.add(outClass);

        setTimeout(() => {
            renderCardContent(testimonials[currentIndex]);
            updateDots();

            // Prepara a transição de entrada
            card.classList.remove(outClass);
            card.classList.add(inClass);

            // Força o reflow do navegador
            void card.offsetWidth;

            // Remove a classe de entrada para completar a transição suave
            card.classList.remove(inClass);
            isAnimating = false;
        }, 220);
    }

    // Navegação: Próximo depoimento (circular)
    function nextTestimonial() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % testimonials.length;
        displayTestimonial("next");
    }

    // Navegação: Depoimento anterior (circular)
    function prevTestimonial() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        displayTestimonial("prev");
    }

    if (nextBtn) nextBtn.addEventListener("click", nextTestimonial);
    if (prevBtn) prevBtn.addEventListener("click", prevTestimonial);

    // Navegação por teclado (Setas Esquerda e Direita quando a seção estiver em foco)
    const testimonialSection = document.getElementById("depoimentos");
    if (testimonialSection) {
        testimonialSection.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") nextTestimonial();
            else if (e.key === "ArrowLeft") prevTestimonial();
        });
    }

    // Suporte para Gestos Touch (Swipe no Mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    card.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    card.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 45) {
            if (diffX > 0) nextTestimonial();
            else prevTestimonial();
        }
    }, { passive: true });

    // Render inicial dos indicadores e estrelas
    renderDots();
    renderCardContent(testimonials[0]);
});
