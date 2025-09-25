// Элементы DOM и логика модалки/формы + переключатель темы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');
let lastActive = null;

// Открытие модалки
openBtn?.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal();
  
  // Фокусировка на первом интерактивном элементе с задержкой для гарантии отображения модалки
  setTimeout(() => {
    const focusableElement = dlg.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
    focusableElement?.focus();
  }, 10);
});

// Закрытие модалки
closeBtn?.addEventListener('click', () => {
  dlg.close('cancel');
  lastActive?.focus();
});

// Обработка закрытия модалки по клику вне ее области
dlg?.addEventListener('click', (e) => {
  if (e.target === dlg) {
    dlg.close('cancel');
    lastActive?.focus();
  }
});

// Обработка нажатия Escape
dlg?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    dlg.close('cancel');
    lastActive?.focus();
  }
});

// Обработка отправки формы
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Сброс кастомных сообщений об ошибках
  [...form.elements].forEach(el => {
    if (el.setCustomValidity) {
      el.setCustomValidity('');
    }
  });

  // Проверка валидности формы
  if (!form.checkValidity()) {
    // Установка кастомных сообщений об ошибках
    const email = form.elements.email;
    if (email?.validity.typeMismatch) {
      email.setCustomValidity('Введите корректный e-mail, например name@example.com');
    }

    const phone = form.elements.phone;
    if (phone?.validity.patternMismatch) {
      phone.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
    }

    // Обновление состояния валидации
    [...form.elements].forEach(el => {
      if (el.willValidate) {
        el.toggleAttribute('aria-invalid', !el.validity.valid);
      }
    });

    // Показ ошибок
    form.reportValidity();
    return;
  }

  // Если форма валидна
  alert('Форма успешно отправлена!');
  dlg.close('success');
  form.reset();
  
  // Сброс состояний ошибок
  [...form.elements].forEach(el => {
    el.removeAttribute('aria-invalid');
  });
  
  // Возврат фокуса
  lastActive?.focus();
});

// Обработка закрытия модалки
dlg?.addEventListener('close', () => {
  // Дополнительная логика при закрытии модалки
});

// Переключатель темы
const KEY = 'theme';
const btn = document.querySelector('.theme-toggle');
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
  document.body.classList.add('theme-dark');
  btn?.setAttribute('aria-pressed', 'true');
}
btn?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('theme-dark');
  btn.setAttribute('aria-pressed', String(isDark));
  localStorage.setItem(KEY, isDark ? 'dark' : 'light');
});
