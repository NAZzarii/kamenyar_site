// Чекаємо, поки завантажиться вся сторінка
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    // Якщо проскролили більше 50 пікселів — додаємо клас 'scrolled'
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 1. Коли сторінка повністю завантажилася, додаємо клас 'loaded', щоб вона плавно з'явилася
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});

// 2. Робимо плавний перехід при кліку на посилання
const links = document.querySelectorAll('nav a'); // Беремо всі посилання в меню

links.forEach(link => {
    link.addEventListener('click', function(e) {
        const target = this.getAttribute('href');

        // Якщо це просто якір (наприклад, #services на тій же сторінці) - ігноруємо, хай просто скролить
        if (target.startsWith('#')) return;

        // Зупиняємо миттєвий перехід
        e.preventDefault(); 
        
        // Робимо сторінку знову прозорою (плавно ховаємо)
        document.body.classList.remove('loaded'); 

        // Чекаємо 500 мілісекунд (поки йде анімація CSS) і тільки потім переходимо на іншу сторінку
        setTimeout(() => {
            window.location.href = target;
        }, 500); 
    });
});


// --- Логіка галереї для сторінки товару ---
const mainImage = document.getElementById('main-product-img');
const thumbnails = document.querySelectorAll('.thumb');

if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // 1. Змінюємо джерело (src) великої картинки на те, по якому клікнули
            mainImage.src = this.src;

            // 2. Забираємо золоту рамку (клас active-thumb) у всіх мініатюр
            thumbnails.forEach(t => t.classList.remove('active-thumb'));

            // 3. Додаємо золоту рамку тільки тій мініатюрі, по якій клікнули
            this.classList.add('active-thumb');
            
            // Ефект легкого моргання для плавності
            mainImage.style.opacity = 0.5;
            setTimeout(() => {
                mainImage.style.opacity = 1;
            }, 150);
        });
    });
}

// --- Відправка заявки в Telegram ---
document.addEventListener('DOMContentLoaded', function() {
    const telegramForm = document.getElementById('telegram-form');

    if (telegramForm) {
        telegramForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Зупиняємо стандартне перезавантаження сторінки

            // === ТВОЇ ДАНІ З TELEGRAM ===
            // Встав сюди токен від BotFather (в лапках)
            const BOT_TOKEN = '8762025445:AAG2yvgdbe3mKnq1iOPsbfdFxkuGkQXAorA'; 
            
            // Встав сюди свій ID від userinfobot (в лапках)
            const CHAT_ID = '1604970941'; 

            // Збираємо те, що клієнт ввів у форму
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const message = document.getElementById('user-message').value;

            // Гарно оформлюємо текст повідомлення, який прийде в телеграм
            const text = `🔥 <b>Нова заявка з сайту KAMENYARDREV!</b>\n\n👤 <b>Ім'я:</b> ${name}\n📞 <b>Телефон:</b> ${phone}\n💬 <b>Запит:</b> ${message}`;

            // Готуємо URL для відправки на сервери Telegram
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=HTML`;

            // Робимо кнопку неактивною і пишемо "Відправляємо..." щоб клієнт не клацав 100 разів
            const submitBtn = telegramForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Відправляємо...';
            submitBtn.disabled = true;

            // Відправляємо магічний запит
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        // Якщо все пройшло супер
                        telegramForm.reset(); // Очищаємо поля форми
                        document.getElementById('success-msg').style.display = 'block'; // Показуємо повідомлення "Дякуємо"
                        submitBtn.innerText = 'Відправлено!';
                        
                        // Через 4 секунди ховаємо повідомлення і повертаємо кнопку як було
                        setTimeout(() => {
                            document.getElementById('success-msg').style.display = 'none';
                            submitBtn.innerText = originalBtnText;
                            submitBtn.disabled = false;
                        }, 4000);
                    } else {
                        alert('Щось пішло не так. Спробуйте ще раз або зателефонуйте нам.');
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Помилка відправки:', error);
                    alert('Помилка підключення. Перевірте інтернет.');
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
// --- РОЗУМНА ГАЛЕРЕЯ (для багатьох товарів на сторінці) ---
function initGalleries(root) {
    const scope = root || document;
    const galleries = scope.querySelectorAll('.product-gallery');

    galleries.forEach(gallery => {
        const mainImg = gallery.querySelector('.main-product-img');
        const thumbs = gallery.querySelectorAll('.thumb');

        if (mainImg && thumbs.length > 0) {
            thumbs.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    mainImg.src = this.src;
                    thumbs.forEach(t => t.classList.remove('active-thumb'));
                    this.classList.add('active-thumb');
                    mainImg.style.opacity = 0.5;
                    setTimeout(() => { mainImg.style.opacity = 1; }, 150);
                });
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initGalleries(document);
});

// --- ПІДСТАВЛЯЄМО НАЗВУ ТОВАРУ В ФОРМУ КОНТАКТІВ (?product=...) ---
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    const messageField = document.getElementById('user-message');

    if (product && messageField) {
        messageField.value = `Цікавить: ${product}`;
    }
});

// --- РЕНДЕР ТОВАРІВ З data/products.json (для сторінок з #products-container) ---
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('products-container');
    if (!container) return;

    const category = container.getAttribute('data-category');

    fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
            const items = (data && data[category]) || [];

            if (items.length === 0) {
                container.innerHTML = '<p style="text-align:center; padding: 40px 0;">Товари цієї категорії скоро з\'являться. Зателефонуйте нам для консультації.</p>';
                return;
            }

            container.innerHTML = items.map((item, index) => {
                const images = (item.images && item.images.length > 0) ? item.images : ['img/stone.jpg'];
                const mainImage = images[0];

                const thumbsHtml = images.map((img, i) =>
                    `<img src="${img}" class="thumb${i === 0 ? ' active-thumb' : ''}" alt="Фото ${i + 1}">`
                ).join('');

                const featuresHtml = (item.features || []).map(f =>
                    `<li><strong>${f.label}:</strong> ${f.value}</li>`
                ).join('');

                const titleAccentHtml = item.titleAccent ? `<span> ${item.titleAccent} </span>` : '';

                const productNameForUrl = encodeURIComponent(`${item.title} ${item.titleAccent || ''}`.trim());
                const orderHref = `contact.html?product=${productNameForUrl}#order-form`;

                const dividerHtml = index < items.length - 1 ? '<hr class="product-divider">' : '';

                return `
                <div class="product-item">
                    <div class="product-layout">
                        <div class="product-gallery">
                            <div class="main-image-box">
                                <img class="main-product-img" src="${mainImage}" alt="${item.title}">
                            </div>
                            <div class="thumbnails">
                                ${thumbsHtml}
                            </div>
                        </div>
                        <div class="product-details">
                            <h2>${item.title}${titleAccentHtml}</h2>
                            <p class="price">${item.price || 'Уточнюйте'}</p>
                            <div class="description">
                                <p>${item.description || ''}</p>
                                <ul>${featuresHtml}</ul>
                            </div>
                            <a href="${orderHref}" class="btn order-btn">Замовити прорахунок</a>
                        </div>
                    </div>
                </div>
                ${dividerHtml}`;
            }).join('');

            initGalleries(container);
        })
        .catch(err => {
            console.error('Не вдалося завантажити товари:', err);
            container.innerHTML = '<p style="text-align:center; padding: 40px 0;">Не вдалося завантажити товари. Спробуйте оновити сторінку.</p>';
        });
});