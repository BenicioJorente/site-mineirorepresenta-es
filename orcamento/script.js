// Funções de validação
function validateNomeCompleto() {
    const nomeInput = document.getElementById('nome');
    const nomeValue = nomeInput.value.trim();
    const palavras = nomeValue.split(' ').filter(p => p.length > 0);
    
    if (palavras.length < 2 || nomeValue.replace(/\s/g, '').length < 5) {
        nomeInput.setCustomValidity('Digite nome e sobrenome (mínimo 5 caracteres)');
        return false;
    }
    nomeInput.setCustomValidity('');
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(emailInput.value)) {
        emailInput.setCustomValidity('Digite um e-mail válido');
        return false;
    }
    emailInput.setCustomValidity('');
    return true;
}

function validateTelefone() {
    const telefoneInput = document.getElementById('telefone');
    const numeros = telefoneInput.value.replace(/\D/g, '');
    
    if (numeros.length < 10) {
        telefoneInput.setCustomValidity('DDD + número (10 dígitos)');
        return false;
    }
    telefoneInput.setCustomValidity('');
    return true;
}

function validateMensagem() {
    const mensagemInput = document.getElementById('mensagem');
    if (mensagemInput.value.trim().length < 10) {
        mensagemInput.setCustomValidity('A mensagem deve ter pelo menos 10 caracteres.');
        return false;
    }
    mensagemInput.setCustomValidity('');
    return true;
}

// Lógica para feedback visual e submissão do formulário
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    const form = document.getElementById('formOrcamento');
    const formMessage = document.getElementById('form-message');
    const formContainer = document.querySelector('.form-feedback');

    if (!form || !formContainer) return;

    // Função para exibir as mensagens de erro
    function showFieldValidation(field, validator) {
        const isValid = validator();
        const errorMessage = field.nextElementSibling;
        
        if (!isValid) {
            field.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = field.validationMessage;
                errorMessage.style.display = 'block';
            }
        } else {
            field.classList.remove('invalid');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
    }

    // Mapeia os campos e seus validadores
    const fieldValidators = [
        { field: document.getElementById('nome'), validator: validateNomeCompleto },
        { field: document.getElementById('email'), validator: validateEmail },
        { field: document.getElementById('telefone'), validator: validateTelefone },
        { field: document.getElementById('mensagem'), validator: validateMensagem }
    ];

    // Adiciona validação em tempo real para todos os campos
    fieldValidators.forEach(item => {
        if (item.field) {
            item.field.addEventListener('input', () => {
                showFieldValidation(item.field, item.validator);
            });
        }
    });

    form.addEventListener('submit', function(e) {
        let isFormValid = true;

        fieldValidators.forEach(item => {
            if (item.field) {
                const isValid = item.validator();
                showFieldValidation(item.field, item.validator);
                if (!isValid) {
                    isFormValid = false;
                }
            }
        });

        if (!isFormValid) {
            e.preventDefault();
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });

    // Mensagem de sucesso na URL (Para o Formsubmit)
    if (window.location.search.includes('success=true')) {
        formMessage.textContent = 'Mensagem enviada, logo retornaremos!';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Esconde a seção do formulário e seu título
        document.querySelector('.form-title').style.display = 'none';
        document.querySelector('.formulario-orcamento').style.display = 'none';
    }
});