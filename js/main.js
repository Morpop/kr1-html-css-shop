// Ждем полной загрузки HTML страницы
document.addEventListener('DOMContentLoaded', () => {

    // 1. Находим все элементы
    const orderDialog = document.getElementById('order-dialog');
    const orderButtons = document.querySelectorAll('.product-card__button');
    const closeDialogButton = document.getElementById('close-order-dialog');
    const selectedProductInput = document.getElementById('selected-product');
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');

    let successTimeoutId = null;

    // Вспомогательная функция для сброса визуальных ошибок
    function clearFormErrors() {
        const formElements = Array.from(orderForm.elements);
        formElements.forEach((element) => {
            if (element.willValidate) {
                element.removeAttribute('aria-invalid');
            }
        });
    }

    // 2. Открытие модального окна при клике на "Заказать"
    orderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;

            // Записываем имя товара в скрытое поле
            if (selectedProductInput) {
                selectedProductInput.value = productName;
            }

            // Открываем модальное окно
            orderDialog.showModal();
        });
    });

    // 3. Закрытие окна при клике на кнопку "Закрыть"
    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', () => {
            orderDialog.close();
        });
    }

    // 4. Закрытие окна при клике на серый фон вокруг формы (backdrop)
    orderDialog.addEventListener('click', (event) => {
        if (event.target === orderDialog) {
            orderDialog.close();
        }
    });

    // 5. Полный сброс полей и ошибок при закрытии окна
    orderDialog.addEventListener('close', () => {
        orderForm.reset();
        clearFormErrors();
    });

    // 6. Валидация и отправка формы
    if (orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Запрещаем перезагрузку страницы

            clearFormErrors();

            // Если форма заполнена неверно
            if (!orderForm.checkValidity()) {
                const formElements = Array.from(orderForm.elements);
                formElements.forEach((element) => {
                    if (element.willValidate && !element.checkValidity()) {
                        element.setAttribute('aria-invalid', 'true');
                    }
                });

                // Показываем стандартную подсказку от браузера
                orderForm.reportValidity();
                return;
            }

            // Если всё правильно — имитируем успешную отправку:
            orderDialog.close();

            // Показываем сообщение об успехе на 4 секунды
            if (successMessage) {
                if (successTimeoutId) clearTimeout(successTimeoutId);
                successMessage.hidden = false;

                successTimeoutId = setTimeout(() => {
                    successMessage.hidden = true;
                }, 4000);
            }
        });
    }
});