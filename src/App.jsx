import React, { useState } from 'react';
import './App.css';
 

function App() {
  const catalogoProductos = [
    { id: 1, nombre: "Cuaderno de peluches - 100 hojas", precio: 9000, imagen: "https://http2.mlstatic.com/D_NQ_NP_788107-MCO93556656796_102025-O.webp" },
    { id: 2, nombre: "Caja lapiceros offi escoEsfero - Negro", precio: 12000, imagen: "https://labodegaeconomica.com/cdn/shop/products/Esfero-semi-gel-07mm-OFFIESCO-Caja-x12-Color-Negro_jpg_ab99b186-6a72-43fd-8f29-864f6ebd374a.jpg?v=1660687661" },
    { id: 3, nombre: "Caja lapiceros offi escoEsfero - Surtidos", precio: 15000, imagen: "https://http2.mlstatic.com/D_NQ_NP_814952-MLA96415590060_102025-O.webp" },
    { id: 4, nombre: "Caja de borradores NATA Pelikan", precio: 12000, imagen: "https://tauro.com.co/wp-content/uploads/2020/07/12884.jpg" },
    { id: 5, nombre: "Colores Norma Linea Premium - 24 unidades", precio: 52000, imagen: "https://panamericana.vtexassets.com/arquivos/ids/420541/colores-norma-x24-premium-7702111588592.jpg?v=637751189754830000" },
    { id: 6, nombre: "Juego de Reglas Geométricas JVC", precio: 8000, imagen: "https://media.cartabon.com/product/juego-de-reglas-escolares-keyroad-800x800.jpg?width=1200" },
    { id: 7, nombre: "Bloc de notas A4 - 100 hojas", precio: 5000, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVQGJXd-r7tbuksab5y5S6YuPjJxApzdkCEQZ0Of8b5-tC072e8HB6cJo&s=10" },
    { id: 8, nombre: "Caja de resaltadores Pelikan", precio: 18000, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThC8Jt-HdAhr5t6bzqv2Z_fMfnMghdeoh4fRlXiOD2zLcEC5T-IZx5RWU&s=10" }
  ];

  // --- ESTADOS ---
  const [busqueda, setBusqueda] = useState("");
  const [pedidoActual, setPedidoActual] = useState({
    cliente: "",
    destino: "",
    metodoPago: "Efectivo",
    clienteFrecuente: false,
    items: []
  });
  
  // Estado para guardar el historial de pedidos
  const [historialPedidos, setHistorialPedidos] = useState([]);

  // --- LÓGICA DE BÚSQUEDA ---
  const productosFiltrados = catalogoProductos.filter(prod => 
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- LÓGICA DEL CARRITO ---
  const agregarAlPedido = (producto) => {
    const itemsExistentes = [...pedidoActual.items];
    const indice = itemsExistentes.findIndex(item => item.id === producto.id);
    if (indice >= 0) {
      itemsExistentes[indice].cantidad += 1;
    } else {
      itemsExistentes.push({ ...producto, cantidad: 1 });
    }
    setPedidoActual({ ...pedidoActual, items: itemsExistentes });
  };

  const quitarDelPedido = (id) => {
    const nuevosItems = pedidoActual.items.filter(item => item.id !== id);
    setPedidoActual({ ...pedidoActual, items: nuevosItems });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPedidoActual({ ...pedidoActual, [name]: type === 'checkbox' ? checked : value });
  };

  const subtotal = pedidoActual.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const descuentoAplicado = pedidoActual.clienteFrecuente ? subtotal * 0.10 : 0;
  const total = subtotal - descuentoAplicado;

  // --- PROCESAR PEDIDO ---
  const registrarPedido = (e) => {
    e.preventDefault();
    if (pedidoActual.items.length === 0) return alert("Agrega productos al pedido primero.");
    if (!pedidoActual.cliente || !pedidoActual.destino) return alert("Por favor completa los datos del cliente.");
    
    // número de pedido único 
    const numeroPedido = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaActual = new Date().toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const nuevoPedidoHistorial = {
      numero: numeroPedido,
      fecha: fechaActual,
      cliente: pedidoActual.cliente,
      destino: pedidoActual.destino,
      metodoPago: pedidoActual.metodoPago,
      items: pedidoActual.items,
      total: total
    };

    
    setHistorialPedidos([nuevoPedidoHistorial, ...historialPedidos]);
    
    
    setPedidoActual({ cliente: "", destino: "", metodoPago: "Efectivo", clienteFrecuente: false, items: [] });
    
    alert(`¡Pedido ${numeroPedido} registrado con éxito!`);
  };

  return (
    <div className="tienda-layout">
      <header className="header-tienda">
        <div className="header-logo">
          <span className="logo-icon"></span>
          <h1>Papelería Prismapapel</h1>
        </div>
        <div className="header-banner">
          🚚 ¡Envío GRATIS en compras superiores a $50.000!
        </div>
      </header>

      <div className="main-content">
        {/* CATÁLOGO E HISTORIAL */}
        <div className="seccion-catalogo">
          
          {/* BARRA DE BÚSQUEDA */}
          <div className="barra-herramientas">
            <input 
              type="text" 
              placeholder="🔍 Buscar producto por nombre..." 
              className="buscador"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <h2 className="seccion-titulo">Catálogo de Productos</h2>
          <div className="grid-productos">
            {productosFiltrados.length === 0 ? (
              <p className="text-vacio">No se encontraron productos.</p>
            ) : (
              productosFiltrados.map(prod => (
                <div key={prod.id} className="tarjeta-producto" onClick={() => agregarAlPedido(prod)}>
                  <div>
                    <div className="producto-imagen-container">
                      <img src={prod.imagen} alt={prod.nombre} className="producto-imagen" />
                    </div>
                    <h3>{prod.nombre}</h3>
                    <p className="producto-precio">${prod.precio}</p>
                  </div>
                  <button className="btn-agregar">+ Agregar</button>
                </div>
              ))
            )}
          </div>

          {/* HISTORIAL DE PEDIDOS (NUEVO) */}
          <div className="historial-seccion mt-30">
            <h2 className="seccion-titulo">Historial de Pedidos</h2>
            {historialPedidos.length === 0 ? (
              <p className="text-vacio">Aún no hay pedidos registrados hoy.</p>
            ) : (
              <div className="lista-historial">
                {historialPedidos.map((pedido, index) => (
                  <div key={index} className="tarjeta-historial">
                    <div className="historial-header">
                      <strong>Pedido {pedido.numero}</strong>
                      <span className="historial-fecha">{pedido.fecha}</span>
                    </div>
                    <div className="historial-body">
                      <p><strong>Cliente:</strong> {pedido.cliente}</p>
                      <p><strong>Dirección:</strong> {pedido.destino}</p>
                      <p><strong>Pago:</strong> {pedido.metodoPago}</p>
                      <div className="historial-productos">
                        {pedido.items.map((item, i) => (
                          <span key={i} className="badge-producto">{item.cantidad}x {item.nombre}</span>
                        ))}
                      </div>
                    </div>
                    <div className="historial-footer">
                      <span>Total pagado:</span>
                      <strong>${pedido.total}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* GESTOR DE PEDIDOS */}
        <div className="seccion-gestor">
          <div className="panel-estadisticas">
            <div className="stat-card">
              <span className="stat-label">Pedidos Hoy</span>
              <span className="stat-value">{historialPedidos.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Ventas</span>
              <span className="stat-value">${historialPedidos.reduce((acc, p) => acc + p.total, 0)}</span>
            </div>
          </div>

          <div className="ticket-pedido sticky-ticket">
            <div className="ticket-header-gestor">
              <h2 className="ticket-titulo">Nuevo Pedido</h2>
              <span className="badge-ticket">{pedidoActual.items.length} ítems</span>
            </div>
            
            <form onSubmit={registrarPedido}>
              <div className="form-group">
                <label>Cliente:</label>
                <input type="text" name="cliente" className="form-input" value={pedidoActual.cliente} onChange={handleInputChange} placeholder="Nombre completo" />
              </div>
              <div className="form-group">
                <label>Dirección de entrega:</label>
                <input type="text" name="destino" className="form-input" value={pedidoActual.destino} onChange={handleInputChange} placeholder="Dirección" />
              </div>

              <hr className="separador" />

              <div className="lista-ticket">
                {pedidoActual.items.length === 0 ? (
                  <div className="ticket-vacio">
                    <span className="icono-vacio">🛒</span>
                    <p>El carrito está vacío</p>
                  </div>
                ) : (
                  pedidoActual.items.map(item => (
                    <div key={item.id} className="item-ticket">
                      <div className="item-info">
                        <span className="item-cantidad">{item.cantidad}x</span>
                        <span className="item-nombre">{item.nombre}</span>
                      </div>
                      <div className="item-acciones">
                        <span>${item.precio * item.cantidad}</span>
                        <button type="button" className="btn-eliminar" onClick={() => quitarDelPedido(item.id)}>✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <hr className="separador" />

              <div className="ticket-totales">
                <div className="fila-total">
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                {pedidoActual.clienteFrecuente && (
                  <div className="fila-total descuento">
                    <span>Descuento (10%):</span>
                    <span>- ${descuentoAplicado}</span>
                  </div>
                )}
                <div className="fila-total total-final">
                  <span>Total a pagar:</span>
                  <span>${total}</span>
                </div>
              </div>

              <label className="form-label-checkbox mt-15">
                <input type="checkbox" name="clienteFrecuente" checked={pedidoActual.clienteFrecuente} onChange={handleInputChange} />
                ¿Es cliente frecuente? (10% off)
              </label>

              <select name="metodoPago" className="form-input mt-15" value={pedidoActual.metodoPago} onChange={handleInputChange}>
                <option value="Efectivo">Efectivo contra entrega</option>
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Transferencia">Transferencia</option>
              </select>

              <button type="submit" className="boton-pagar mt-15">
                Procesar Pedido
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;