$(document).ready(function() {

    // ======================================================
    // 1. MENU HORIZONTAL CON SMOOTH SCROLL
    // ======================================================
    // Delegamos el evento porque el menú puede ser dinámico (Ej 13)
    $(document).on('click', 'a[href^="#"]', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            // Animación smooth scroll
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 800, function(){
                // Opcional: window.location.hash = hash;
            });
        }
    });

    // ======================================================
    // 2. ANIMACIÓN BANNER (DESLIZAR DESDE FUERA)
    // 5. CARGA AJAX DEL BANNER (Combinado)
    // ======================================================
    $.ajax({
        url: 'data/banner.json',
        dataType: 'json',
        success: function(data) {
            var bannerContent = `
                <h1 style="font-size: 3em;">${data.titular}</h1>
                <p style="font-size: 1.5em;">${data.descripcion}</p>
            `;
            var $banner = $('#banner-container');
            
            $banner.html(bannerContent);
            $banner.css('background-color', data.color); // O imagen de fondo si hubiera
            
            // EJERCICIO 2: Deslizar desde arriba
            // Inicialmente está en top: -100% (en CSS)
            $banner.animate({
                top: '0'
            }, 1000, 'swing');
        },
        error: function() {
            $('#banner-container').text('Error cargando banner');
        }
    });

    // ======================================================
    // 3. SLIDER AUTOMÁTICO (FADE)
    // ======================================================
    var $slides = $('.slider-box .slide');
    var currentSlide = 0;
    
    setInterval(function() {
        var $active = $slides.eq(currentSlide);
        // Ocultar actual
        $active.fadeOut(1000).removeClass('active');
        
        currentSlide = (currentSlide + 1) % $slides.length;
        
        // Mostrar siguiente
        $slides.eq(currentSlide).fadeIn(1000).addClass('active');
    }, 2000); // Cambio cada 2 segundos

    // ======================================================
    // 4. MENU STICKY
    // ======================================================
    var navOffset = $('#main-nav').offset().top;
    
    $(window).scroll(function() {
        var scrollPos = $(window).scrollTop();
        
        if (scrollPos > navOffset) {
            $('#main-nav').addClass('sticky');
        } else {
            $('#main-nav').removeClass('sticky');
        }
    });

    // ======================================================
    // 6. DETECTAR FINAL DE PAGINA Y MOSTRAR MODAL
    // ======================================================
    var modalShown = false;
    $(window).scroll(function() {
        // Detectar si llegamos al fondo (con margen de error de 5px)
        if($(window).scrollTop() + $(window).height() >= $(document).height() - 5) {
            if(!modalShown) {
                $('#end-modal').fadeIn();
                modalShown = true;
            }
        }
    });

    $('.close-modal').click(function() {
        $('#end-modal').fadeOut();
    });

    // ======================================================
    // 7. ANIMACIÓN ENCADENADA
    // ======================================================
    $('#btn-animate-box').click(function() {
        $('#chain-box')
            .animate({ width: '200px', height: '200px' }, 1000) // 1. Aumenta tamaño
            .animate({ opacity: 0.5 }, 500)                     // 2. Cambia opacidad
            .animate({ width: '100px', height: '100px', opacity: 1 }, 1000); // 3. Regresa
    });

    // ======================================================
    // 8. TABLA PRODUCTOS CON AJAX Y SLIDEDOWN
    // ======================================================
    $.ajax({
        url: 'data/products.json',
        dataType: 'json',
        success: function(products) {
            var $tbody = $('#products-table tbody');
            $.each(products, function(index, p) {
                var row = `<tr style="display:none;">
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>$${p.precio}</td>
                </tr>`;
                
                var $row = $(row);
                $tbody.append($row);
                
                // Animación slideDown con pequeño retraso por fila
                setTimeout(function() {
                    $row.slideDown();
                }, index * 200);
            });
        }
    });

    // ======================================================
    // 9. MENU HAMBURGUESA
    // ======================================================
    $('#hamburger-btn').click(function() {
        $('.menu-items').fadeToggle();
    });

    // ======================================================
    // 10. FETCH + TARJETAS + PARPADEO
    // ======================================================
    fetch('data/products.json') // Reutilizo el JSON de productos
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cards-container');
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <h3>${item.nombre}</h3>
                    <p class="price">$${item.precio}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => console.error(err));

    // Delegación de evento jQuery para el parpadeo
    $('#cards-container').on('click', '.card', function() {
        $(this).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    });

    // ======================================================
    // 11. NOTIFICACIONES (SIMULACIÓN INTERVALO)
    // ======================================================
    var notifCounter = 0; // Contador local que inicia en 0

    setInterval(function() {
        $.ajax({
            url: 'data/notificaciones.json',
            dataType: 'json',
            success: function(data) {
                notifCounter++; 
                $('#notif-count').text(notifCounter);
                
                // Animación de vibración
                $('#notification-area')
                    .animate({ left: '-=10px' }, 100)
                    .animate({ left: '+=20px' }, 100)
                    .animate({ left: '-=10px' }, 100);
            }
        });
    }, 5000); // Se ejecuta cada 5 segundos

    // ======================================================
    // 12. CARRUSEL MANUAL
    // ======================================================
    var carouselIndex = 0;
    var imageWidth = 300; // Ancho definido en CSS
    
    $('.next').click(function() {
        if(carouselIndex < 3) { // 4 imágenes (0,1,2,3)
            carouselIndex++;
            $('.carousel-track').animate({ left: '-=' + imageWidth }, 500);
        }
    });
    
    $('.prev').click(function() {
        if(carouselIndex > 0) {
            carouselIndex--;
            $('.carousel-track').animate({ left: '+=' + imageWidth }, 500);
        }
    });

    // ======================================================
    // 13. MENU DINÁMICO + HOVER EFFECT
    // ======================================================
    $.ajax({
        url: 'data/menu.json',
        dataType: 'json',
        success: function(data) {
            var $menu = $('#dynamic-menu');
            $menu.empty(); // Limpiar estáticos
            
            $.each(data.menu, function(i, item) {
                var li = `<li><a href="${item.url}">${item.texto}</a></li>`;
                $menu.append(li);
            });
            
            $menu.find('a').hover(
                function() { $(this).addClass('highlight'); }, 
                function() { $(this).removeClass('highlight'); } 
            );
        }
    });

    // ======================================================
    // 14. LISTA USUARIOS + VER PERFIL (SLIDETOGGLE)
    // ======================================================
    $.ajax({
        url: 'data/usuarios.json',
        dataType: 'json',
        success: function(users) {
            var $list = $('#users-list');
            $.each(users, function(i, u) {
                var html = `
                <div class="user-item">
                    <h4>${u.nombre}</h4>
                    <button class="btn-primary view-profile">Ver Perfil</button>
                    <div class="user-details">
                        <p>Email: ${u.email}</p>
                        <p>Ciudad: ${u.ciudad}</p>
                    </div>
                </div>`;
                $list.append(html);
            });
        }
    });

    // Delegación evento para slideToggle
    $('#users-list').on('click', '.view-profile', function() {
        $(this).next('.user-details').slideToggle();
    });

    // ======================================================
    // 15. MODULO COMPLETO (TIENDA + BUSCADOR + ANIMACIONES)
    // ======================================================
    // 1. Cargar datos
    $.ajax({
        url: 'data/data.json',
        dataType: 'json',
        success: function(items) {
            var $container = $('#shop-container');
            $.each(items, function(i, item) {
                var card = `
                <div class="card shop-card">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <h3 class="p-name">${item.nombre}</h3>
                    <p class="price">$${item.precio}</p>
                    <button class="btn-primary add-cart">Agregar</button>
                </div>`;
                $container.append(card);
            });
        }
    });

    // 3. Buscador en tiempo real
    $('#shop-search').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('.shop-card').filter(function() {
            $(this).toggle($(this).find('.p-name').text().toLowerCase().indexOf(value) > -1);
        });
    });

    // 4 & 5. Agregar al carrito y animaciones
    var cartCount = 0;
    $('#shop-container').on('click', '.add-cart', function() {
        var $card = $(this).closest('.card');
        
        // Animación de "salto"
        $card.animate({ top: "-=10px" }, 150)
             .animate({ top: "+=10px" }, 150);
             
        // Actualizar contador
        cartCount++;
        var $counter = $('#cart-counter');
        
        // Efecto fadeOut/fadeIn en contador
        $counter.fadeOut(200, function() {
            $(this).text(cartCount).fadeIn(200);
        });
    });

});