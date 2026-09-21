const URL_APPS_SCRIPT =
    "https://script.google.com/macros/s/AKfycbwmMtbhnXWRRI82s5wm-XnEdgQR76V7oPzNRyu6JRWorLA8c-7oKvee8CPNhvXPdGdH_Q/exec";

const INSTAGRAM_OA = "https://www.instagram.com/jewerlsoa/";

const CLAVE_CARRITO = "carritoJoyeria";

let carrito = [];


/* =========================================
   CARGAR CARRITO
========================================= */

function cargarCarrito() {
    try {
        const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        } else {
            carrito = [];
        }

        if (!Array.isArray(carrito)) {
            carrito = [];
        }

    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        carrito = [];
    }

    actualizarCarrito();
}


/* =========================================
   GUARDAR CARRITO
========================================= */

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}


/* =========================================
   AGREGAR PRODUCTO
========================================= */

function agregarCarrito(nombre, precio) {

    const productoExistente = carrito.find(
        producto => producto.nombre === nombre
    );

    if (productoExistente) {

        productoExistente.cantidad += 1;

    } else {

        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });

    }

    guardarCarrito();
    actualizarCarrito();

    mostrarNotificacion(
        nombre + " agregado al carrito"
    );
}


/* =========================================
   ACTUALIZAR CARRITO
========================================= */

function actualizarCarrito() {

    const lista = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total-carrito");

    if (!lista || !totalElemento) {
        return;
    }

    lista.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {

        lista.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

        totalElemento.textContent = "Q0.00";

        return;
    }

    carrito.forEach((producto, indice) => {

        const subtotal =
            producto.precio * producto.cantidad;

        total += subtotal;

        const elemento = document.createElement("div");

        elemento.className = "producto-carrito";

        elemento.innerHTML = `
            <div class="info-producto-carrito">

                <h3>${producto.nombre}</h3>

                <p>
                    Precio: Q${producto.precio.toFixed(2)}
                </p>

            </div>

            <div class="controles-carrito">

                <button
                    type="button"
                    onclick="cambiarCantidad(${indice}, -1)"
                >
                    −
                </button>

                <span>
                    ${producto.cantidad}
                </span>

                <button
                    type="button"
                    onclick="cambiarCantidad(${indice}, 1)"
                >
                    +
                </button>

                <button
                    type="button"
                    class="boton-eliminar"
                    onclick="eliminarProducto(${indice})"
                >
                    Eliminar
                </button>

            </div>

            <strong>
                Q${subtotal.toFixed(2)}
            </strong>
        `;

        lista.appendChild(elemento);
    });

    totalElemento.textContent =
        "Q" + total.toFixed(2);
}


/* =========================================
   CAMBIAR CANTIDAD
========================================= */

function cambiarCantidad(indice, cambio) {

    if (!carrito[indice]) {
        return;
    }

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }

    guardarCarrito();
    actualizarCarrito();
}


/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function eliminarProducto(indice) {

    if (!carrito[indice]) {
        return;
    }

    carrito.splice(indice, 1);

    guardarCarrito();
    actualizarCarrito();
}


/* =========================================
   NOTIFICACIÓN
========================================= */

function mostrarNotificacion(mensaje) {

    const notificacion =
        document.getElementById("notificacion-carrito");

    const mensajeElemento =
        document.getElementById("mensaje-notificacion");

    const botonCarrito =
        document.getElementById("boton-ir-carrito");

    if (!notificacion) {
        return;
    }

    if (mensajeElemento) {
        mensajeElemento.textContent = mensaje;
    }

    if (botonCarrito) {
        botonCarrito.style.display = "inline-flex";
    }

    notificacion.classList.add("mostrar");

    clearTimeout(window.temporizadorNotificacion);

    window.temporizadorNotificacion =
        setTimeout(function () {

            notificacion.classList.remove("mostrar");

        }, 5000);
}


/* =========================================
   ABRIR CHECKOUT
========================================= */

function abrirCheckout() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;
    }

    const ventana =
        document.getElementById("ventana-checkout");

    if (!ventana) {
        return;
    }

    actualizarResumenCheckout();

    ventana.style.display = "flex";
}


/* =========================================
   CERRAR CHECKOUT
========================================= */

function cerrarCheckout() {

    const ventana =
        document.getElementById("ventana-checkout");

    if (!ventana) {
        return;
    }

    ventana.style.display = "none";
}


/* =========================================
   RESUMEN DEL CHECKOUT
========================================= */

function actualizarResumenCheckout() {

    const resumen =
        document.getElementById("resumen-checkout");

    const totalElemento =
        document.getElementById("total-checkout");

    if (!resumen || !totalElemento) {
        return;
    }

    resumen.innerHTML = "";

    let subtotal = 0;

    carrito.forEach(producto => {

        const totalProducto =
            producto.precio * producto.cantidad;

        subtotal += totalProducto;

        const linea =
            document.createElement("div");

        linea.className = "linea-resumen";

        linea.innerHTML = `
            <span>
                ${producto.nombre}
                × ${producto.cantidad}
            </span>

            <strong>
                Q${totalProducto.toFixed(2)}
            </strong>
        `;

        resumen.appendChild(linea);
    });


    /* ENVÍO */

    const envio =
        subtotal >= 350 ? 0 : 30;

    const total =
        subtotal + envio;


    const lineaEnvio =
        document.createElement("div");

    lineaEnvio.className = "linea-resumen";

    lineaEnvio.innerHTML = `
        <span>Envío</span>

        <strong>
            ${envio === 0
                ? "Gratis"
                : "Q" + envio.toFixed(2)}
        </strong>
    `;

    resumen.appendChild(lineaEnvio);


    totalElemento.textContent =
        "Q" + total.toFixed(2);
}


/* =========================================
   CREAR MENSAJE DEL PEDIDO
========================================= */

function crearMensajePedido(datos) {

    let mensaje = "";

    mensaje += "NUEVO PEDIDO - OA JOYERÍA\n\n";

    mensaje += "DATOS DEL CLIENTE\n";
    mensaje += "Nombre: " + datos.nombre + "\n";
    mensaje += "Teléfono: " + datos.telefono + "\n";
    mensaje += "Instagram: " + datos.instagram + "\n";

    mensaje += "\nDIRECCIÓN DE ENTREGA\n";
    mensaje += "Dirección: " + datos.direccion + "\n";
    mensaje += "Referencia: " + datos.referencia + "\n";
    mensaje += "Ciudad: " + datos.ciudad + "\n";
    mensaje += "Departamento: " + datos.departamento + "\n";

    mensaje += "\nPEDIDO\n";

    datos.productos.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;

        mensaje +=
            "- " +
            producto.nombre +
            " x" +
            producto.cantidad +
            " — Q" +
            subtotal.toFixed(2) +
            "\n";
    });


    mensaje += "\nRESUMEN DE PAGO\n";

    mensaje +=
        "Subtotal: Q" +
        datos.subtotal.toFixed(2) +
        "\n";

    mensaje +=
        "Envío: " +
        (datos.envio === 0
            ? "Gratis"
            : "Q" + datos.envio.toFixed(2)) +
        "\n";

    mensaje +=
        "TOTAL: Q" +
        datos.total.toFixed(2) +
        "\n";

    mensaje +=
        "Método de pago: " +
        datos.pago +
        "\n";

    mensaje +=
        "\nPedido generado desde OA Joyería.";

    return mensaje;
}


/* =========================================
   CARGAR IMAGEN DE PRODUCTO
========================================= */

function cargarImagen(src) {

    return new Promise((resolve, reject) => {

        const imagen = new Image();

        imagen.onload = function () {
            resolve(imagen);
        };

        imagen.onerror = function () {
            reject(
                new Error(
                    "No se pudo cargar la imagen: " + src
                )
            );
        };

        imagen.src = src;
    });
}


/* =========================================
   GENERAR IMAGEN DEL PEDIDO
   CON IMÁGENES DE PRODUCTOS
========================================= */

async function generarImagenPedido(datos) {

    const canvas =
        document.createElement("canvas");

    const ancho = 1200;

    const alto =
        650 +
        (datos.productos.length * 180);

    canvas.width = ancho;
    canvas.height = alto;

    const ctx =
        canvas.getContext("2d");


    /* FONDO */

    ctx.fillStyle = "#F6F1E7";

    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );


    /* ENCABEZADO */

    ctx.fillStyle = "#66704A";

    ctx.fillRect(
        0,
        0,
        ancho,
        130
    );


    ctx.fillStyle = "#FFFFFF";

    ctx.font =
        "bold 42px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "OA JOYERÍA",
        ancho / 2,
        55
    );


    ctx.font =
        "24px Arial";

    ctx.fillText(
        "Resumen de pedido",
        ancho / 2,
        95
    );


    /* DATOS DEL CLIENTE */

    ctx.textAlign = "left";

    ctx.fillStyle = "#3F3A32";

    ctx.font =
        "bold 25px Arial";

    ctx.fillText(
        "Datos del cliente",
        70,
        175
    );

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Nombre: " + datos.nombre,
        70,
        215
    );

    ctx.fillText(
        "Teléfono: " + datos.telefono,
        70,
        248
    );

    ctx.fillText(
        "Instagram: " + datos.instagram,
        70,
        281
    );


    /* DIRECCIÓN */

    ctx.font =
        "bold 25px Arial";

    ctx.fillText(
        "Dirección de entrega",
        650,
        175
    );

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Dirección: " + datos.direccion,
        650,
        215
    );

    ctx.fillText(
        "Referencia: " + datos.referencia,
        650,
        248
    );

    ctx.fillText(
        "Ciudad: " + datos.ciudad,
        650,
        281
    );

    ctx.fillText(
        "Departamento: " + datos.departamento,
        650,
        314
    );


    /* PRODUCTOS */

    const imagenes = {

        "Anillo Elegance":
            "imagenes/anillo1.png",

        "Collar Aurora":
            "imagenes/collar1.png",

        "Pulsera Olivia":
            "imagenes/pulsera1.png",

        "Reloj Elegance":
            "imagenes/reloj1.png",

        "Reloj Classic":
            "imagenes/reloj2.png",

        "Reloj Luxury":
            "imagenes/reloj3.png",

        "Tobillera Luna":
            "imagenes/tobillera1.png",

        "Tobillera Estrella":
            "imagenes/tobillera2.png",

        "Tobillera Grace":
            "imagenes/tobillera3.png"
    };


    let posicionY = 350;


    for (const producto of datos.productos) {

        /* TARJETA DEL PRODUCTO */

        ctx.fillStyle = "#FFFFFF";

        ctx.fillRect(
            50,
            posicionY,
            1100,
            150
        );


        /* IMAGEN */

        const rutaImagen =
            imagenes[producto.nombre];

        if (rutaImagen) {

            try {

                const imagen =
                    await cargarImagen(rutaImagen);

                const maxAncho = 120;
                const maxAlto = 120;

                let anchoImagen =
                    imagen.width;

                let altoImagen =
                    imagen.height;


                const escala =
                    Math.min(
                        maxAncho / anchoImagen,
                        maxAlto / altoImagen
                    );


                anchoImagen *= escala;
                altoImagen *= escala;


                const xImagen =
                    75 +
                    (maxAncho - anchoImagen) / 2;

                const yImagen =
                    posicionY +
                    15 +
                    (maxAlto - altoImagen) / 2;


                ctx.drawImage(
                    imagen,
                    xImagen,
                    yImagen,
                    anchoImagen,
                    altoImagen
                );

            } catch (error) {

                console.warn(
                    "No se pudo cargar la imagen del producto:",
                    producto.nombre
                );

            }
        }


        /* NOMBRE */

        ctx.fillStyle = "#3F3A32";

        ctx.textAlign = "left";

        ctx.font =
            "bold 24px Arial";

        ctx.fillText(
            producto.nombre,
            230,
            posicionY + 50
        );


        /* CANTIDAD */

        ctx.font =
            "20px Arial";

        ctx.fillText(
            "Cantidad: " + producto.cantidad,
            230,
            posicionY + 85
        );


        /* PRECIO */

        ctx.fillText(
            "Precio unitario: Q" +
            producto.precio.toFixed(2),
            230,
            posicionY + 118
        );


        /* SUBTOTAL */

        const subtotalProducto =
            producto.precio *
            producto.cantidad;

        ctx.textAlign = "right";

        ctx.font =
            "bold 24px Arial";

        ctx.fillText(
            "Q" +
            subtotalProducto.toFixed(2),
            1080,
            posicionY + 80
        );


        posicionY += 180;
    }


    /* TOTALES */

    ctx.textAlign = "right";

    ctx.fillStyle = "#3F3A32";

    ctx.font =
        "22px Arial";

    ctx.fillText(
        "Subtotal: Q" +
        datos.subtotal.toFixed(2),
        1080,
        posicionY + 10
    );


    ctx.fillText(
        "Envío: " +
        (
            datos.envio === 0
                ? "Gratis"
                : "Q" + datos.envio.toFixed(2)
        ),
        1080,
        posicionY + 45
    );


    ctx.fillStyle = "#66704A";

    ctx.font =
        "bold 30px Arial";

    ctx.fillText(
        "TOTAL: Q" +
        datos.total.toFixed(2),
        1080,
        posicionY + 90
    );


    /* MÉTODO DE PAGO */

    ctx.fillStyle = "#3F3A32";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Método de pago: " +
        datos.pago,
        1080,
        posicionY + 125
    );


    /* PIE */

    ctx.textAlign = "center";

    ctx.fillStyle = "#A58C72";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "Gracias por comprar en OA Joyería",
        ancho / 2,
        alto - 25
    );


    return canvas.toDataURL(
        "image/png"
    );
}


/* =========================================
   FINALIZAR PEDIDO
========================================= */

async function finalizarPedido() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;
    }


    const nombre =
        document.getElementById("nombre")?.value.trim();

    const telefono =
        document.getElementById("telefono")?.value.trim();

    let instagram =
        document.getElementById("instagram")?.value.trim();

    const direccion =
        document.getElementById("direccion")?.value.trim();

    const referencia =
        document.getElementById("referencia")?.value.trim();

    const ciudad =
        document.getElementById("ciudad")?.value.trim();

    const departamento =
        document.getElementById("departamento")?.value.trim();


    const pagoSeleccionado =
        document.querySelector(
            'input[name="pago"]:checked'
        );

    const pago =
        pagoSeleccionado
            ? pagoSeleccionado.value
            : "";


    /* VALIDACIÓN */

    if (
        !nombre ||
        !telefono ||
        !instagram ||
        !direccion ||
        !ciudad ||
        !departamento ||
        !pago
    ) {

        alert(
            "Por favor completa todos los campos obligatorios."
        );

        return;
    }


    /* INSTAGRAM */

    if (!instagram.startsWith("@")) {

        instagram =
            "@" + instagram;
    }


    /* TOTALES */

    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio *
            producto.cantidad;
    });


    const envio =
        subtotal >= 350 ? 0 : 30;

    const total =
        subtotal + envio;


    const datos = {

        nombre: nombre,

        telefono: telefono,

        instagram: instagram,

        direccion: direccion,

        referencia: referencia || "Sin referencia",

        ciudad: ciudad,

        departamento: departamento,

        pago: pago,

        productos: JSON.parse(
            JSON.stringify(carrito)
        ),

        subtotal: subtotal,

        envio: envio,

        total: total
    };


    /* CREAR MENSAJE */

    datos.mensaje =
        crearMensajePedido(datos);


    /* GENERAR IMAGEN */

    let imagenPedido;

    try {

        imagenPedido =
            await generarImagenPedido(datos);

    } catch (error) {

        console.error(
            "Error al generar imagen:",
            error
        );

        alert(
            "No se pudo generar la imagen del pedido."
        );

        return;
    }


    /* DESCARGAR IMAGEN */

    try {

        const enlace =
            document.createElement("a");

        enlace.href =
            imagenPedido;

        enlace.download =
            "pedido-oa-joyeria.png";

        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);

    } catch (error) {

        console.warn(
            "No se pudo descargar automáticamente la imagen:",
            error
        );
    }


    /* ENVIAR A GMAIL */

    try {

        await enviarPedidoGmail(
            datos,
            imagenPedido
        );

    } catch (error) {

        console.error(
            "Error enviando pedido por Gmail:",
            error
        );

        alert(
            "El pedido fue preparado, pero hubo un problema al enviarlo por correo."
        );

        return;
    }


    /* LIMPIAR CARRITO */

    carrito = [];

    guardarCarrito();

    actualizarCarrito();


    /* CERRAR CHECKOUT */

    cerrarCheckout();


    /* CONFIRMACIÓN */

    pedidoPreparado();
}


/* =========================================
   ENVIAR PEDIDO A GMAIL
========================================= */

async function enviarPedidoGmail(
    datos,
    imagenPedido
) {

    const payload = {

        nombre:
            datos.nombre,

        telefono:
            datos.telefono,

        instagram:
            datos.instagram,

        mensaje:
            datos.mensaje,

        imagen:
            imagenPedido
    };


    await fetch(
        URL_APPS_SCRIPT,
        {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body:
                JSON.stringify(payload)
        }
    );
}


/* =========================================
   PEDIDO PREPARADO
========================================= */

function pedidoPreparado() {

    alert(
        "¡Pedido enviado correctamente!\n\n" +
        "Hemos recibido tu pedido. " +
        "Gracias por comprar en OA Joyería."
    );


    window.open(
        INSTAGRAM_OA,
        "_blank"
    );
}


/* =========================================
   CERRAR MODAL AL HACER CLIC AFUERA
========================================= */

document.addEventListener(
    "click",
    function(event) {

        const ventana =
            document.getElementById("ventana-checkout");

        if (!ventana) {
            return;
        }

        if (
            event.target === ventana
        ) {

            cerrarCheckout();
        }
    }
);


/* =========================================
   TECLA ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            cerrarCheckout();
        }
    }
);


/* =========================================
   INICIAR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        cargarCarrito();

    }
);


/* =========================================
   GUARDAR ANTES DE SALIR
========================================= */

window.addEventListener(
    "beforeunload",
    function() {

        guardarCarrito();

    }
);