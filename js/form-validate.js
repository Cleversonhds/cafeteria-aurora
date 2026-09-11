/**
 * Validação do Formulário de Pedido - Cafeteria Aurora
 * Arquivo: js/form-validate.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.order-form form') || document.querySelector('form');
    if (!formulario) return;

    // Desativa a validação nativa do navegador para utilizar as mensagens personalizadas
    formulario.setAttribute('novalidate', 'true');

    const campoNome = document.getElementById('name');
    const campoTelefone = document.getElementById('phone');
    const campoEndereco = document.getElementById('address');
    const campoBebida = document.getElementById('drink');
    const campoQuantidade = document.getElementById('quantity');
    const opcoesPagamento = document.querySelectorAll('input[name="payment"]');
    const botaoEnviar = formulario.querySelector('.btn-submit') || formulario.querySelector('button[type="submit"]');

    // Desabilita o botão inicialmente
    if (botaoEnviar) {
        botaoEnviar.disabled = true;
    }

    /**
     * Cria ou obtém o elemento <span> de mensagem de erro abaixo do campo
     */
    function obterOuCriarElementoErro(elementoCampo, ehGrupoRadio = false) {
        let elementoPai = ehGrupoRadio 
            ? elementoCampo.closest('.options-group') 
            : elementoCampo.closest('.form-group');
        
        if (!elementoPai) elementoPai = elementoCampo.parentElement;

        let elementoErro = elementoPai.querySelector('.error-message');
        if (!elementoErro) {
            elementoErro = document.createElement('span');
            elementoErro.className = 'error-message';
            elementoErro.setAttribute('role', 'alert');
            elementoErro.setAttribute('aria-live', 'polite');
            elementoPai.appendChild(elementoErro);
        }
        return elementoErro;
    }

    /**
     * Exibe a mensagem de erro abaixo do campo
     */
    function exibirErro(elementoCampo, mensagem, ehGrupoRadio = false) {
        const elementoErro = obterOuCriarElementoErro(elementoCampo, ehGrupoRadio);
        elementoErro.textContent = mensagem;
        elementoErro.style.display = 'block';

        if (!ehGrupoRadio) {
            elementoCampo.classList.add('is-invalid');
            elementoCampo.classList.remove('is-valid');
        }
    }

    /**
     * Remove a mensagem de erro
     */
    function limparErro(elementoCampo, ehGrupoRadio = false) {
        let elementoPai = ehGrupoRadio 
            ? elementoCampo.closest('.options-group') 
            : elementoCampo.closest('.form-group');
        
        if (!elementoPai) elementoPai = elementoCampo.parentElement;
        
        const elementoErro = elementoPai ? elementoPai.querySelector('.error-message') : null;
        if (elementoErro) {
            elementoErro.textContent = '';
            elementoErro.style.display = 'none';
        }

        if (!ehGrupoRadio) {
            elementoCampo.classList.remove('is-invalid');
            elementoCampo.classList.add('is-valid');
        }
    }

    /**
     * 1. Validação do Nome Completo:
     * - Ter mais de 6 caracteres
     * - Não usar números e caracteres especiais (apenas letras e espaços)
     */
    function validarNome(exibirMensagemErro = false) {
        if (!campoNome) return true;
        const valor = campoNome.value.trim();
        const padraoApenasLetrasEEspacos = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/;

        if (valor.length === 0) {
            if (exibirMensagemErro) {
                exibirErro(campoNome, 'Por favor, preencha o seu nome completo.');
            }
            return false;
        }

        if (!padraoApenasLetrasEEspacos.test(valor)) {
            if (exibirMensagemErro) {
                exibirErro(campoNome, 'O nome não deve conter números ou caracteres especiais.');
            }
            return false;
        }

        if (valor.length <= 6) {
            if (exibirMensagemErro) {
                exibirErro(campoNome, 'O nome deve ter mais de 6 caracteres.');
            }
            return false;
        }

        if (exibirMensagemErro || campoNome.dataset.tocado === 'true') {
            limparErro(campoNome);
        }
        return true;
    }

    /**
     * 2. Máscara e Validação de Telefone:
     * - Permite apenas números ao digitar
     * - Aplica máscara dinâmica: (99) 9999-9999 ou (99) 99999-9999
     * - Valida se contém DDD + número completo (10 ou 11 dígitos)
     */
    function aplicarMascaraTelefone(evento) {
        let digitos = evento.target.value.replace(/\D/g, '').slice(0, 11);
        let formatado = '';

        if (digitos.length > 0) {
            formatado = '(' + digitos.slice(0, 2);
            if (digitos.length > 2) {
                formatado += ') ';
                if (digitos.length <= 10) {
                    // Formato fixo (10 dígitos): (99) 9999-9999
                    formatado += digitos.slice(2, 6);
                    if (digitos.length > 6) {
                        formatado += '-' + digitos.slice(6, 10);
                    }
                } else {
                    // Formato celular (11 dígitos): (99) 99999-9999
                    formatado += digitos.slice(2, 7) + '-' + digitos.slice(7, 11);
                }
            }
        }
        evento.target.value = formatado;
    }

    function validarTelefone(exibirMensagemErro = false) {
        if (!campoTelefone) return true;
        const digitos = campoTelefone.value.replace(/\D/g, '');

        if (digitos.length === 0) {
            if (exibirMensagemErro) {
                exibirErro(campoTelefone, 'Por favor, informe seu telefone de contato.');
            }
            return false;
        }

        if (digitos.length < 10 || digitos.length > 11) {
            if (exibirMensagemErro) {
                exibirErro(campoTelefone, 'Informe um telefone válido com DDD (mínimo 10 dígitos).');
            }
            return false;
        }

        if (exibirMensagemErro || campoTelefone.dataset.tocado === 'true') {
            limparErro(campoTelefone);
        }
        return true;
    }

    /**
     * 3. Validação do Endereço:
     * - Ter mais de 10 caracteres
     * - Aceita caracteres, texto e números
     */
    function validarEndereco(exibirMensagemErro = false) {
        if (!campoEndereco) return true;
        const valor = campoEndereco.value.trim();

        if (valor.length === 0) {
            if (exibirMensagemErro) {
                exibirErro(campoEndereco, 'Por favor, informe o endereço de entrega.');
            }
            return false;
        }

        if (valor.length <= 10) {
            if (exibirMensagemErro) {
                exibirErro(campoEndereco, 'O endereço deve ter mais de 10 caracteres.');
            }
            return false;
        }

        if (exibirMensagemErro || campoEndereco.dataset.tocado === 'true') {
            limparErro(campoEndereco);
        }
        return true;
    }

    /**
     * 4. Validação da Bebida:
     * - Tem que escolher uma opção
     */
    function validarBebida(exibirMensagemErro = false) {
        if (!campoBebida) return true;
        const valor = campoBebida.value;

        if (!valor || valor === '') {
            if (exibirMensagemErro) {
                exibirErro(campoBebida, 'Por favor, selecione uma opção de bebida.');
            }
            return false;
        }

        if (exibirMensagemErro || campoBebida.dataset.tocado === 'true') {
            limparErro(campoBebida);
        }
        return true;
    }

    /**
     * 5. Validação da Quantidade:
     * - Apenas números (sem texto ou caracteres especiais)
     * - Valor padrão: 1
     * - Mínimo: 1, Máximo: 99
     */
    function sanitizarQuantidade(evento) {
        let valor = evento.target.value.replace(/\D/g, '');
        if (valor !== '') {
            let numero = parseInt(valor, 10);
            if (numero > 99) {
                numero = 99;
            }
            evento.target.value = numero;
        } else {
            evento.target.value = '';
        }
    }

    function validarQuantidade(exibirMensagemErro = false) {
        if (!campoQuantidade) return true;
        const valorTexto = campoQuantidade.value.trim();

        if (valorTexto === '') {
            if (exibirMensagemErro) {
                exibirErro(campoQuantidade, 'Por favor, informe a quantidade.');
            }
            return false;
        }

        const numero = Number(valorTexto);
        if (!/^\d+$/.test(valorTexto) || isNaN(numero) || numero < 1 || numero > 99) {
            if (exibirMensagemErro) {
                exibirErro(campoQuantidade, 'A quantidade deve ser entre 1 e 99.');
            }
            return false;
        }

        if (exibirMensagemErro || campoQuantidade.dataset.tocado === 'true') {
            limparErro(campoQuantidade);
        }
        return true;
    }

    /**
     * 6. Validação da Forma de Pagamento:
     * - Obrigatório selecionar ao menos uma opção
     */
    function validarPagamento(exibirMensagemErro = false) {
        if (!opcoesPagamento || opcoesPagamento.length === 0) return true;
        const estaSelecionado = Array.from(opcoesPagamento).some(opcao => opcao.checked);
        const primeiroRadio = opcoesPagamento[0];

        if (!estaSelecionado) {
            if (exibirMensagemErro) {
                exibirErro(primeiroRadio, 'Por favor, selecione a forma de pagamento.', true);
            }
            return false;
        }

        limparErro(primeiroRadio, true);
        return true;
    }

    /**
     * 7. Atualiza o estado geral do formulário e habilita/desabilita o botão de envio
     */
    function verificarValidadeFormulario() {
        const nomeValido = validarNome(false);
        const telefoneValido = validarTelefone(false);
        const enderecoValido = validarEndereco(false);
        const bebidaValida = validarBebida(false);
        const quantidadeValida = validarQuantidade(false);
        const pagamentoValido = validarPagamento(false);

        const formularioValido = nomeValido && telefoneValido && enderecoValido && bebidaValida && quantidadeValida && pagamentoValido;

        if (botaoEnviar) {
            botaoEnviar.disabled = !formularioValido;
        }

        return formularioValido;
    }

    // --- Configuração dos Ouvintes de Eventos (Event Listeners) ---

    // Nome Completo
    if (campoNome) {
        campoNome.addEventListener('input', () => {
            if (campoNome.dataset.tocado === 'true') {
                validarNome(true);
            }
            verificarValidadeFormulario();
        });

        campoNome.addEventListener('blur', () => {
            campoNome.dataset.tocado = 'true';
            validarNome(true);
            verificarValidadeFormulario();
        });
    }

    // Telefone
    if (campoTelefone) {
        campoTelefone.addEventListener('input', (evento) => {
            aplicarMascaraTelefone(evento);
            if (campoTelefone.dataset.tocado === 'true') {
                validarTelefone(true);
            }
            verificarValidadeFormulario();
        });

        campoTelefone.addEventListener('blur', () => {
            campoTelefone.dataset.tocado = 'true';
            validarTelefone(true);
            verificarValidadeFormulario();
        });
    }

    // Endereço
    if (campoEndereco) {
        campoEndereco.addEventListener('input', () => {
            if (campoEndereco.dataset.tocado === 'true') {
                validarEndereco(true);
            }
            verificarValidadeFormulario();
        });

        campoEndereco.addEventListener('blur', () => {
            campoEndereco.dataset.tocado = 'true';
            validarEndereco(true);
            verificarValidadeFormulario();
        });
    }

    // Bebida
    if (campoBebida) {
        campoBebida.addEventListener('change', () => {
            campoBebida.dataset.tocado = 'true';
            validarBebida(true);
            verificarValidadeFormulario();
        });

        campoBebida.addEventListener('blur', () => {
            campoBebida.dataset.tocado = 'true';
            validarBebida(true);
            verificarValidadeFormulario();
        });
    }

    // Quantidade
    if (campoQuantidade) {
        // Bloqueia qualquer caractere que não seja número (impede texto e caracteres especiais)
        campoQuantidade.addEventListener('keydown', (evento) => {
            const teclasPermitidas = [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
            ];
            if (teclasPermitidas.includes(evento.key) || evento.ctrlKey || evento.metaKey) {
                return;
            }
            if (!/^\d$/.test(evento.key)) {
                evento.preventDefault();
            }
        });

        // Impede colar texto ou caracteres especiais
        campoQuantidade.addEventListener('paste', (evento) => {
            const textoColado = (evento.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(textoColado)) {
                evento.preventDefault();
                const apenasDigitos = textoColado.replace(/\D/g, '');
                if (apenasDigitos) {
                    let num = parseInt(apenasDigitos, 10);
                    if (num > 99) num = 99;
                    if (num < 1) num = 1;
                    campoQuantidade.value = num;
                    if (campoQuantidade.dataset.tocado === 'true') {
                        validarQuantidade(true);
                    }
                    verificarValidadeFormulario();
                }
            }
        });

        campoQuantidade.addEventListener('input', (evento) => {
            sanitizarQuantidade(evento);
            if (campoQuantidade.dataset.tocado === 'true') {
                validarQuantidade(true);
            }
            verificarValidadeFormulario();
        });

        campoQuantidade.addEventListener('blur', () => {
            campoQuantidade.dataset.tocado = 'true';
            if (campoQuantidade.value === '' || parseInt(campoQuantidade.value, 10) < 1) {
                campoQuantidade.value = '1';
            }
            validarQuantidade(true);
            verificarValidadeFormulario();
        });
    }

    // Forma de Pagamento
    opcoesPagamento.forEach(opcao => {
        opcao.addEventListener('change', () => {
            validarPagamento(true);
            verificarValidadeFormulario();
        });
    });

    // Submissão do Formulário
    formulario.addEventListener('submit', (evento) => {
        // Marca todos os campos como tocados para exibir erros pendentes caso o envio seja forçado
        if (campoNome) campoNome.dataset.tocado = 'true';
        if (campoTelefone) campoTelefone.dataset.tocado = 'true';
        if (campoEndereco) campoEndereco.dataset.tocado = 'true';
        if (campoBebida) campoBebida.dataset.tocado = 'true';
        if (campoQuantidade) campoQuantidade.dataset.tocado = 'true';

        const nomeValido = validarNome(true);
        const telefoneValido = validarTelefone(true);
        const enderecoValido = validarEndereco(true);
        const bebidaValida = validarBebida(true);
        const quantidadeValida = validarQuantidade(true);
        const pagamentoValido = validarPagamento(true);

        const formularioValido = nomeValido && telefoneValido && enderecoValido && bebidaValida && quantidadeValida && pagamentoValido;

        if (!formularioValido) {
            evento.preventDefault();
            verificarValidadeFormulario();
        }
    });

    // Verificação inicial ao carregar a página
    verificarValidadeFormulario();
});
