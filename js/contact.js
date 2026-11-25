/**
 * ==========================================================================
 * js/contact.js
 * Lógica Exclusiva de la Página de Contacto (contact.html):
 * 1. Copiar dirección de correo al portapapeles con feedback visual
 * 2. Validación de campos del formulario (nombre, email, asunto, mensaje)
 * 3. Envío sin backend hacia Cliente de Correo (mailto:)
 * 4. Envío directo hacia WhatsApp (wa.me)
 * 5. prueba
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuración de datos de contacto de Jonathan Joel Macías Rodríguez
  const CONTACT_CONFIG = {
    email: 'jonathan15-08@hotmail.com',
    whatsappNumber: '593980506339' // Código Ecuador (+593) + 980506339
  };

  // --------------------------------------------------------------------------
  // 1. Funcionalidad: Copiar Correo al Portapapeles
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(CONTACT_CONFIG.email);
        } else {
          // Método alternativo para compatibilidad
          const tempInput = document.createElement('textarea');
          tempInput.value = CONTACT_CONFIG.email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Feedback visual temporal en el botón
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = '¡Correo copiado!';
        copyEmailBtn.classList.add('btn-primary');
        copyEmailBtn.classList.remove('btn-secondary');

        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.classList.remove('btn-primary');
          copyEmailBtn.classList.add('btn-secondary');
        }, 2500);

      } catch (error) {
        console.error('Error al copiar el correo:', error);
        alert(`No se pudo copiar automáticamente. Mi correo es: ${CONTACT_CONFIG.email}`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Validación y Envío del Formulario
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (!contactForm) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const allInputs = [nameInput, emailInput, subjectInput, messageInput];

  // Función para mostrar mensajes de feedback (error, success o info)
  const showFeedback = (message, type = 'error') => {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
  };

  // Función para limpiar feedback y estilos de error
  const clearFeedback = () => {
    if (!formFeedback) return;
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
    allInputs.forEach((input) => {
      if (input) input.classList.remove('input-error');
    });
  };

  // Limpiar error al enfocar o escribir en cualquier campo
  allInputs.forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
      });
    }
  });

  // Validar formato de correo con expresión regular estándar
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación completa de los campos del formulario
  const validateForm = () => {
    clearFeedback();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      nameInput.classList.add('input-error');
      nameInput.focus();
      showFeedback('Por favor, ingresa tu nombre completo.', 'error');
      return null;
    }

    if (!email) {
      emailInput.classList.add('input-error');
      emailInput.focus();
      showFeedback('Por favor, ingresa tu correo electrónico.', 'error');
      return null;
    }

    if (!isValidEmail(email)) {
      emailInput.classList.add('input-error');
      emailInput.focus();
      showFeedback('El correo electrónico no tiene un formato válido (ejemplo: usuario@correo.com).', 'error');
      return null;
    }

    if (!subject) {
      subjectInput.classList.add('input-error');
      subjectInput.focus();
      showFeedback('Por favor, escribe el asunto de tu mensaje.', 'error');
      return null;
    }

    if (!message) {
      messageInput.classList.add('input-error');
      messageInput.focus();
      showFeedback('Por favor, redacta el contenido de tu mensaje.', 'error');
      return null;
    }

    return { name, email, subject, message };
  };

  // --------------------------------------------------------------------------
  // Envío Opción A: Cliente de Correo Nativo (mailto:)
  // --------------------------------------------------------------------------
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita la recarga de página

    const formData = validateForm();
    if (!formData) return;

    const emailSubject = encodeURIComponent(`[Portafolio Web] ${formData.subject}`);
    const emailBody = encodeURIComponent(
      `Hola Jonathan,\n\nMi nombre es: ${formData.name}\nMi correo de contacto: ${formData.email}\n\nMensaje:\n${formData.message}\n`
    );

    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${emailSubject}&body=${emailBody}`;

    showFeedback('¡Listo! Abriendo tu cliente de correo predeterminado...', 'success');

    // Redirige al cliente de correo del sistema operativo
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);
  });

  // --------------------------------------------------------------------------
  // Envío Opción B: Chat de WhatsApp (wa.me)
  // --------------------------------------------------------------------------
  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
      const formData = validateForm();
      if (!formData) return;

      const whatsappText = encodeURIComponent(
        `*Hola Jonathan, te contacto desde tu Portafolio Web*\n\n` +
        `👤 *Nombre:* ${formData.name}\n` +
        `✉️ *Correo:* ${formData.email}\n` +
        `📌 *Asunto:* ${formData.subject}\n` +
        `💬 *Mensaje:* ${formData.message}`
      );

      const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${whatsappText}`;

      showFeedback('¡Validación correcta! Redirigiendo a WhatsApp...', 'success');

      // Abre WhatsApp Web o la App móvil en una nueva pestaña
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 400);
    });
  }
});
