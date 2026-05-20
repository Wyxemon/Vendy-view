// IMPORTS
import { useSearchParams } from "react-router-dom";
import './App.css';
import { getInfo, getItemInfo } from '../firebase/db';
import { useEffect, useState } from "react";

// Componente (La aplicacion)
function App() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  // UseState para guardar items
  const [items, setItems] = useState(null);

  // UseState del banner
  const [bannerImg, setBannerImg] = useState(null);
  const [bannerTitle, setBannerTitle] = useState(null);
  const [bannerDescription, setBannerDescription] = useState(null);

  // Menu
  const [menuCategory, setMenuCategory] = useState('Bebidas')

  // Peticion de datos
  useEffect(() => {
    async function getData() {
      // Pedir los datos y establecerlos (es como una variable)
      setBannerImg(await getInfo(email, 'banner')); 
      setBannerTitle(await getInfo(email, 'title'));
      setBannerDescription(await getInfo(email, 'description'));
      setItems(Object.entries(await getInfo(email, 'data')))
    }

    getData();

    // BUCLE de petición de datos cada 5 segundos

    // timepo para pedir otra vez los datos
    const time = setInterval(() => { getData() }, 5000);
    // limpiar
    return () => clearInterval(time);
  }, [email])

  let filterItems = []; // array/lista para guardar los items filtrados por categoria
  if (items) {
    filterItems = items.filter(([name, item]) => { return item.category == menuCategory; })
    // guardar en filter items = items filtrados por categoria (menuCategory)

    // para entenderlo hay que hacer un console.log de los items
    /*
    [
        "ejemplo", -> esto equivale a name
        {  -> esto equivale a item
            "category": "Bebidas",
            "description": "Coca-Cola es una bebida refrescante de cola, dulce y con gas, muy conocida en todo el mundo.",
            "img": "data:image/webp;base64,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",
            "name": "Coca Cola Pequeña",
            "price": 3.19
        }
    ],
     */
  }

  return (
    <>
      <div className="div-body">
        <div className="div-body-width">

          <div className="div-banner">
            <div className="div-banner-img" style={{ backgroundImage: `url(${bannerImg})` }} />
            <h1>{bannerTitle}</h1>
            <p>{bannerDescription}</p>
          </div>
          <div className="div-botton-menu">
            <div className="div-botton-left">
              <button className={menuCategory == 'Bebidas' ? 'active' : ''} onClick={(e) => { setMenuCategory('Bebidas') }}>Bebidas</button> 
              <button className={menuCategory == 'Tapas' ? 'active' : ''} onClick={(e) => { setMenuCategory('Tapas') }}>Tapas</button>
              <button className={menuCategory == 'Bocadillos' ? 'active' : ''} onClick={(e) => { setMenuCategory('Bocadillos') }}>Bocadillos</button>
              <button className={menuCategory == 'Platos' ? 'active' : ''} onClick={(e) => { setMenuCategory('Platos') }}>Platos</button>
              <button className={menuCategory == 'Postres' ? 'active' : ''} onClick={(e) => { setMenuCategory('Postres') }}>Postres</button>
            </div>
            <div className="div-botton-right">
              {filterItems.map(([name, item]) => { // bucle para mostrar los items filtrados por categoria (filterItems)
                return (
                  <div key={name} className="div-card">
                    <img src={item.img} alt="" />
                    <div>
                      <h3>{item.name}</h3>
                      <p id="p-description-data">{item.description}</p>
                    </div>
                    <p id="p-price">{item.price} €</p>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
