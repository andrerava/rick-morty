"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const LocationDetailPage = ({ params }) => {
  const [location, setLocation] = useState(null); // State per il luogo
  const [residents, setResidents] = useState([]); // State per l'elenco dei residenti
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://rickandmortyapi.com/api/location/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Risorsa non disponibile");
        }

        const data = await response.json();
        setLocation(data); // Imposta le informazioni sul luogo

        // Recupera i dettagli dei personaggi residenti nel luogo
        const residentsResponse = await Promise.all(
          data.residents.map((residentUrl) =>
            fetch(residentUrl).then((res) => res.json())
          )
        );
        setResidents(residentsResponse); // Imposta l'array di residenti
      } catch (error) {
        setError(error.message);
        console.error("Errore durante il recupero del luogo:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [params.id]);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Si è verificato un errore: {error}</p>;
  }

  if (!location) {
    return <p>Nessun luogo trovato per questo ID.</p>;
  }

  return (
    <div className="background">
      <div className="content">
        <div className="header">
          <div className="page-title">{location.name}</div>
        </div>

        <div className="location-detail">
          <p>
            <strong>Nome:</strong> {location.name}
          </p>
          <p>
            <strong>Tipo:</strong> {location.type}
          </p>
          <p>
            <strong>Dimensione:</strong> {location.dimension}
          </p>
          <div className="residents-grid">
            {residents.map((resident) => (
              <Link key={resident.id} href={`/personaggi/${resident.id}`} legacyBehavior>
                <a className="resident-item">
                  <img src={resident.image} alt={resident.name} className="resident-image" />
                  <p>
                    <strong>Nome:</strong> {resident.name}
                  </p>
                  <p>
                    <strong>Genere:</strong> {resident.gender}
                  </p>
                </a>
              </Link>
            ))}
          </div>
        </div>

        
      </div>
      <div className="footer">
          <Link href="/luoghi" legacyBehavior>
            <a className="button-back-link">Back</a>
          </Link>
        </div>

      <style jsx>{`
        .background {
          background-image: url("/sfondoHome.jpg");
          background-size: cover;
          background-position: center;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto; /* Abilita lo scroll verticale all'interno della pagina */
        }

        .content {
          padding: 20px;
          box-sizing: border-box;
          border-radius: 8px;
          text-align: center;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.6); /* Sfondo semi-trasparente per tutto il contenuto */
        }

        .header {
          display: flex;
          justify-content: center; /* Centra il titolo */
          align-items: center;
          width: 100%;
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 3rem;
          font-weight: bold;
          color: white;
        }
          .background::-webkit-scrollbar {
          display: none;
        }

        .location-detail {
          text-align: left;
          color:white;
          margin-bottom: 20px;

        }

        .location-detail p {
          margin-bottom: 10px;

        }

        .residents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
          gap: 20px; 
          margin-top: -5px;
          max-height: calc(100vh - 230px); /* Altezza massima della griglia con scroll interno */
          overflow: auto; /* Abilita lo scroll verticale e orizzontale solo se necessario */
          scrollbar-width: none;
          -ms-overflow-style: none; /* Nasconde la barra di scorrimento su Internet Explorer */
        }
                 .resident-grid::-webkit-scrollbar {
          display: none; /* Nasconde la barra di scorrimento su browser WebKit (Chrome, Safari, Edge, Opera) */
        }

        .resident-item {
          background-color: rgba(255, 255, 255, 0); /* Sfondo semi-trasparente per i residenti */
          padding: 20px;
          color:white;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 2px solid purple;
          height: 100%; /* Altezza fissa per ogni elemento della griglia */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .resident-image {
          width: 100px; /* Imposta la larghezza desiderata per le immagini */
          height: 100px; /* Imposta l'altezza desiderata per le immagini */
          object-fit: cover; /* Per mantenere l'aspetto originale dell'immagine */
          border-radius: 50%; /* Bordo arrotondato per un aspetto più gradevole */
          margin: 0 auto; /* Centra l'immagine */
          margin-bottom: 10px; /* Spazio inferiore tra l'immagine e i testi */
        }

        .footer {
          margin-top: auto; /* Posiziona il footer in basso */
          text-align: center;
          padding: 20px 0;
        }

        .button-back-link {
          text-decoration: none;
          color: white;
          background-color: purple;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .button-back-link:hover {
          background-color: #6a0dad;
        }
      `}</style>
    </div>
  );
};

export default LocationDetailPage;
