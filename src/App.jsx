import { useSearchParams } from "react-router-dom";
import './App.css';
import { getInfo, getItemInfo } from '../firebase/db';
import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function getData() {
      setBannerImg(await getInfo(email, 'banner'));
      setBannerTitle(await getInfo(email, 'title'));
      setBannerDescription(await getInfo(email, 'description'));
      setItems(Object.entries(await getInfo(email, 'data')))
    }

    getData();

    const time = setInterval(() => { getData() }, 5000);

    return () => clearInterval(time);
  }, [email])
  
  let filterItems = [];
  if (items) {
    filterItems = items.filter(([name, item]) => {return item.category == menuCategory;})
  }

  return (
    <>
      <div className="div-body">
        <div className="div-banner">
          <div className="div-banner-img" style={{ backgroundImage: `url(${bannerImg})` }} />
          <h1>{bannerTitle}</h1>
          <p>{bannerDescription}</p>
        </div>
        <div className="div-botton-menu">
          <div className="div-botton-left">
            <button className={menuCategory == 'Bebidas' ? 'active' : ''}  onClick={(e) => {setMenuCategory('Bebidas')}}>Bebidas</button>
            <button className={menuCategory == 'Tapas' ? 'active' : ''} onClick={(e) => {setMenuCategory('Tapas')}}>Tapas</button>
            <button className={menuCategory == 'Bocadillos' ? 'active' : ''} onClick={(e) => {setMenuCategory('Bocadillos')}}>Bocadillos</button>
            <button className={menuCategory == 'Platos' ? 'active' : ''} onClick={(e) => {setMenuCategory('Platos')}}>Platos</button>
            <button className={menuCategory == 'Postres' ? 'active' : ''} onClick={(e) => {setMenuCategory('Postres')}}>Postres</button>
          </div>
          <div className="div-botton-right">
            {filterItems.map(([name, item]) => {
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
    </>
  )
}

export default App
