// Элементы DOM
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');
let lastActive = null;

// Открытие модалки
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    // Фокус на первое поле
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Закрытие модалки
closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Обработка отправки формы
form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));
    
    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();
        
        // Кастомные сообщения об ошибках
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        
        const phone = form.elements.phone;
        if (phone?.validity.patternMismatch) {
            phone.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
        }
        
        form.reportValidity();
        
        // Подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) {
                el.toggleAttribute('aria-invalid', !el.checkValidity());
            }
        });
        return;
    }
    
    // 3) Успешная отправка
    e.preventDefault();
    alert('Форма успешно отправлена!');
    dlg.close('success');
    form.reset();
    
    // Сброс состояния ошибок
    [...form.elements].forEach(el => {
        el.removeAttribute('aria-invalid');
    });
});

// Восстановление фокуса при закрытии модалки
dlg.addEventListener('close', () => {
    lastActive?.focus();
});

// Легкая маска телефона (дополнительно)
phoneInput?.addEventListener('input', (e) => {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }
    
    if (value.startsWith('7')) {
        value = value.slice(1);
    }
    
    let formattedValue = '+7';
    
    if (value.length > 0) {
        formattedValue += ' (' + value.slice(0, 3);
    }
    if (value.length > 3) {
        formattedValue += ') ' + value.slice(3, 6);
    }
    if (value.length > 6) {
        formattedValue += '-' + value.slice(6, 8);
    }
    if (value.length > 8) {
        formattedValue += '-' + value.slice(8, 10);
    }
    
    input.value = formattedValue;
});

// Валидация при вводе (снимаем ошибку при исправлении)
form?.addEventListener('input', (e) => {
    const el = e.target;
    if (el.willValidate) {
        el.setCustomValidity('');
        el.removeAttribute('aria-invalid');
    }
});