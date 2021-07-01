const configuracion = {
	moneda: "$",
	costoEnvio: 300,
	costoFinanciación: (costo) => costo * 0.1
};

const items = [{
	id: 'ccu',
	titulo: "Campera contraste urbana",
	stock: 10,
	precio: 1300,
	promocion3x2: false
}, {
	id: 'ztd',
	titulo: "Zapatillas textura diagonal",
	stock: 10,
	precio: 2800,
	promocion3x2: true
}, {
	id: 'bgb',
	titulo: "Bufanda gris basica",
	stock: 10,
	precio: 400,
	promocion3x2: false
}, {
	id: 'mcs',
	titulo: "Mochila cuero simple",
	stock: 10,
	precio: 4500,
	promocion3x2: false
}];

const usuario = {
	nombre: "Leandro Emanuel",
	apellido: "Quiroga",
	email: "info@rocketcode.com.ar"
};

const obtenerNombre = (user) => {
	return `${user.nombre} ${user.apellido}`;
};

const precioFormateado = (moneda, precio) => {
	return `${moneda} ${precio}`;
};

const obtenerTotal = (conceptos) => {
	return conceptos.reduce((total, concepto) => total + concepto)    
}; 

const calcularCostoEnvio = (subTotal, costoEnvio) => {
	return subTotal >= 8000  ?  0 : costoEnvio;
}

const calcularReintegroPromo3x2 = (id, cantidad) => {
	const item = items.find((item) => item.id === id)
	const cantidadaPromos = parseInt(cantidad / 3);

	if ((item.promocion3x2 ) && (cantidadaPromos > 0)){
			return item.precio * cantidadaPromos;
		}
	return 0;
}

const calcularReintegroPromo3x2Pedido = (items) => {
	if (!items.length) return 0;

	return items.map(item =>reintegroPromo3x2 = calcularReintegroPromo3x2(item.id, item.cantidad))
        .reduce((total, reintegro) =>  total + reintegro);
}

const calcularDescuentoCupon = (subTotal, cupon) => {
	if (cupon === "DESCUENTO20%") {
		return subTotal * 0.2
	} else if (cupon === "DESCUENTO10%") {
		return subTotal * 0.1
	}
	return 0
}

const obtenerElementoDOM = (id) => {
	return document.getElementById(id)
}

const actualizarElementoDOM = (id, texto) => {
	const elemento = obtenerElementoDOM(id);
	elemento.innerHTML = texto
}

const obtenerItemsDOM = () => {
	return document.querySelectorAll("#items > tr");
}

const obtenerCantidadDOM = (id) => {
	return document.querySelector(`#${id} .quantity__item input`).value;
}

const calcularSubTotal = (items) => {
    return items.map(item => item.precio * item.cantidad)
    .reduce((total, precio) => total + precio);
}

const valorPositivo = (valor) => {
	return valor * -1;
}

//obtiene la informacion de los items
const obtenerYActulizar = () => {
    const itemsDOM = obtenerItemsDOM();
    const info = [];

    itemsDOM.forEach((itemDOM) => {
        const item = items.find((item) => item.id === itemDOM.id);
        const cantidad = obtenerCantidadDOM(itemDOM.id)

        //muestra el precio en la lista
        actualizarElementoPrecioDom(`${item.id}-precio`, item.precio)
        actualizarElementoPrecioDom(`${item.id}-total`, item.precio * cantidad)

        // agremos a un propiedad obtenidas en cada ciclo del forEach al objeto nuevo
        info.push({
            ...item,
            cantidad: cantidad
        });
    })
    return info;
}

//obtiene el precio del DOM
const actualizarElementoPrecioDom = (id, precio) =>{
    const elemento = obtenerElementoDOM(id);
    elemento.innerHTML = precioFormateado(configuracion.moneda, precio)
    elemento.parentNode.style.display = null;


    if(precio < 0){
        elemento.classList.add("precio-positivo"); 
    } else if(precio === 0) {
        elemento.parentNode.style.display = "none"; // elimina los elementos con total = 0
    } else{
        elemento.classList.remove("precio-positivo") 
    }
}

// actualiza nombre
const actualizarNombre = () => {
    const nameComplete = obtenerNombre(usuario);
    actualizarElementoDOM("nombre", nameComplete);
}
// actualizar precio
const actualizarPrecio = () => {
    const items = obtenerYActulizar();

    const subTotal = calcularSubTotal(items);

    const envio = calcularCostoEnvio(subTotal, configuracion.costoEnvio);

    const finaciacion = configuracion.costoFinanciación(subTotal);
    
    const promocion3x2 = valorPositivo(calcularReintegroPromo3x2Pedido(items)); 

    const cupon = obtenerElementoDOM("cupon").value;

    const codigoCupon = valorPositivo(calcularDescuentoCupon(subTotal, cupon)); 
    
    const total = obtenerTotal([subTotal,envio, finaciacion, promocion3x2, codigoCupon]);
    
    actualizarElementoPrecioDom("subtotal", subTotal);
    actualizarElementoPrecioDom("costoEnvio", envio);
    actualizarElementoPrecioDom("costoFinanciacion", finaciacion);
    actualizarElementoPrecioDom("promocion3x2", promocion3x2);
    actualizarElementoPrecioDom("codigoCupon", codigoCupon);
    actualizarElementoPrecioDom("total", total);
}

// aplicar cupon
const aplicarCupon = () =>{
    actualizarPrecio();
}

/* Devuelve el nombre completo y el total del precio */
const init = () => {
    actualizarNombre();
    actualizarPrecio();
}   
init();
