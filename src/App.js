import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [saint, setSaint] = useState('');
  const [saintInfo, setSaintInfo] = useState({
    biography: '',
    image: '',
    feastDay: '',
    quote: '',
    name: ''
  });

  const fetchSaintInfo = async (saintName) => {
    try {
      console.log('Buscando:', saintName);
      // Modificamos la URL para usar la API de Wikipedia en español y obtener el contenido correcto
      const response = await axios.get(
        `https://es.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: 'query',
          format: 'json',
          prop: 'extracts|pageimages',
          generator: 'search',
          gsrsearch: saintName,
          gsrlimit: 1,
          exintro: true,
          explaintext: true,
          piprop: 'thumbnail',
          pithumbsize: 300,
          origin: '*'
        })
      );
      
      console.log('Respuesta:', response.data);
      
      if (!response.data.query) {
        throw new Error('No se encontraron resultados');
      }

      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      const saintData = {
        biography: page.extract || 'No se encontró biografía disponible.',
        image: page.thumbnail ? page.thumbnail.source : '',
        name: page.title,
        feastDay: "Fecha de conmemoración pendiente",
        quote: "Frase memorable pendiente"
      };

      console.log('Datos encontrados:', saintData);
      setSaintInfo(saintData);
    } catch (error) {
      console.error('Error:', error);
      setSaintInfo({
        biography: 'No se pudo encontrar información sobre este santo. Intenta con otro nombre o verifica la ortografía.',
        image: '',
        feastDay: '',
        quote: '',
        name: 'No encontrado'
      });
    }
  };
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      fetchSaintInfo(saint);
    }
  };

  return (
    <div className="App">
      <h1>Vidas de Santos</h1>
      <div className="search-section">
        <input
          type="text"
          value={saint}
          onChange={(e) => setSaint(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="Ejemplo: San Francisco de Asís"
        />
        <button onClick={() => fetchSaintInfo(saint)}>Buscar</button>
      </div>

      <div className="search-tips">
        <p>Sugerencias de búsqueda:</p>
        <ul>
          {[
            "San Francisco de Asís",
            "Santa Teresa de Jesús",
            "San Juan Bosco",
            "Santa Rosa de Lima"
          ].map((saintName) => (
            <li 
              key={saintName} 
              onClick={() => {
                setSaint(saintName);
                fetchSaintInfo(saintName);
              }}
            >
              {saintName}
            </li>
          ))}
        </ul>
      </div>

      {saintInfo.name && (
        <div className="saint-card">
          <h2>{saintInfo.name}</h2>
          {saintInfo.image && (
            <div className="image-container">
              <img src={saintInfo.image} alt={saintInfo.name} />
            </div>
          )}
          <div className="saint-details">
            <p className="feast-day"><strong>Fecha de conmemoración:</strong> {saintInfo.feastDay}</p>
            <p className="quote"><strong>Frase memorable:</strong> "{saintInfo.quote}"</p>
          </div>
          <div className="biography">
            <h3>Biografía</h3>
            <p>{saintInfo.biography}</p>
            <p className="source">Fuente: Wikipedia</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;