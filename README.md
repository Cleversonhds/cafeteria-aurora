# ☕ Cafeteria Aurora 

Projeto desenvolvido como parte do Desafio Web, focado na criação de uma interface moderna, responsiva e interativa para uma cafeteria artesanal. 
 O projeto evoluiu de uma simples página estática para um sistema de pedidos funcional utilizando apenas tecnologias nativas do navegador.

---

## ✨ Funcionalidades e Destaques

* **Layout Responsivo:** Design adaptável para Mobile, Tablet e Desktop utilizando CSS Grid e Flexbox.
* **Carrossel Dinâmico:** Seção de depoimentos gerada e controlada 100% via JavaScript (Vanilla),
     com suporte a navegação por botões, teclado (setas) e gestos em dispositivos móveis (swipe).
* **Sistema de Pedidos Avançado:**
  * Adição dinâmica de múltiplas bebidas (limite de 5 itens).
  * Validação inteligente que impede a duplicação do mesmo item no pedido, alertando o usuário e
     direcionando o foco para a quantidade do item já existente.
  * Máscara de telefone aplicada em tempo real (Regex).
  * Proteção contra caracteres inválidos no campo numérico de quantidade.
  * Validação completa de todos os campos antes da liberação do botão de envio.
    
---

## 🚀 Tecnologias Utilizadas

* **HTML5:** Semântica e acessibilidade.
* **CSS3:** Variáveis nativas (Custom Properties), animações (keyframes) e Media Queries.
* **JavaScript (ES6+):** Manipulação de DOM, Event Listeners e validação de formulários sem uso de bibliotecas externas.
* **Font Awesome:** Iconografia vetorial.
* **Google Fonts:** Tipografia 'Poppins'.

---

## 📁 Estrutura do Projeto

```text
/cafeteria-aurora/
│
├── index.html            → Página principal da cafeteria
├── obrigado.html         → Página de confirmação de pedido
│
├── css/
│   └── style.css         → Folha de estilos centralizada
│
├── assets/
│   └── img/              → Logotipo, avatares de clientes e imagem de fundo
│
├── js/
│   ├── carousel.js       → Lógica do carrossel dinâmico
│   └── form-validate.js  → Validação, máscaras e gerador dinâmico de bebidas
│
└── README.md             → Documentação do projeto

Agradecimentos Especiais & Créditos
Um agradecimento especial pelo apoio técnico e mentoria no desenvolvimento:

Arthur Cezar — Dev Pleno • Mobile & Angular

Licença
Projeto desenvolvido para fins didáticos e práticos de desenvolvimento web.
