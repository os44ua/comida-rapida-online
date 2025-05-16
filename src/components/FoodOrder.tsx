import React, { useState, useContext } from 'react';
import type { MenuItem } from '../entities/entities';
import './FoodOrder.css';
import { foodItemsContext, cartUpdateContext } from '../App'; 

interface FoodOrderProps {
  food: MenuItem;
  onReturnToMenu: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const FoodOrder = ({ food, onReturnToMenu }: FoodOrderProps) => {
  const [totalAmount, setTotalAmount] = useState(food.price); // precio unitario * cantidad
  const [quantity, setQuantity] = useState(1); // cantidad pedida
  const [isOrdered, setIsOrdered] = useState(false); // si está pedido
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  
  //Contextos
  const menuItems = useContext(foodItemsContext);
  const updateCart = useContext(cartUpdateContext);
  
  const handleClick = () => {
    setIsOrdered(true);
    
    // refresh la cantidad de productos
    menuItems.map((item: MenuItem) => {
      if (item.id === food.id) {
        item.quantity = item.quantity - quantity;
      }
    });
    
    // refresh carrito
    updateCart(food.id, quantity);
  };

  // Actualizar el precio total cuando cambia la cantidad
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setTotalAmount(food.price * newQuantity);
  };

  return (
    <div className="foodOrderContainer">
      <p className="foodOrderTitle">Comida Rápida Online</p>
      <h2>{food.name}</h2>

      {/*<img src={`/images/${food.image}`} alt={food.name} className="foodOrderImg" />*/}
      {/*para publicacion en GitPages cambiamos la ruta de imagenes*/}
      <img src={`${import.meta.env.VITE_APP_BASE_URL || '/'}images/${food.image}`} alt={food.name} />

      <p className="foodOrderDesc">{food.desc}</p>
      <p className="foodOrderPrice">{food.price}€ por unidad</p>
      <p>Total: {totalAmount}€</p>

      <div className="foodOrderForm">
        <label>
          Cantidad:
          <input
            className="foodOrderInput"
            type="number"
            value={quantity}
            min={1}
            max={food.quantity}
            onChange={handleQuantityChange}
          />
        </label>

        <input
          className="foodOrderInput"
          type="text"
          placeholder="Tu nombre"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          className="foodOrderInput"
          type="tel"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="foodOrderButtons">
        <button className="btnConfirm" onClick={handleClick}>
          Enviar pedido
        </button>
        <button className="btnBack" onClick={onReturnToMenu}>
          Volver al menú
        </button>
      </div>

      {isOrdered && (
        <div className="confirmationBox">
          Pedido enviado. <strong>Recibirás un SMS una vez esté listo para recoger.</strong>
        </div>
      )}
    </div>
  );
};

export default FoodOrder;