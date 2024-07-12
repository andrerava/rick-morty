"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const CharacterDetailPage = ({ params }) => {
  const [character, setCharacter] = useState(null); // State per il personaggio

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${params.id}`
        );
        
        if (!response.ok) {
          throw new Error("Risorsa non disponibile");
        }

        const data = await response.json();
        setCharacter(data); // Aggiorna lo stato del personaggio
      } catch (error) {
        console.error("Errore durante il recupero del personaggio:", error.message);
      }
    };

    fetchCharacter(); // Chiamata API al caricamento del componente
  }, [params.id]); // Dipendenza per assicurare che la chiamata API sia rilanciata quando params.id cambia

  useEffect(() => {
    if (character) {
      document.title = character.name; // Aggiorna il titolo della pagina con il nome del personaggio
    }
  }, [character]); // Dipendenza per assicurare che il titolo sia aggiornato quando il personaggio è recuperato

  if (!character) {
    return <p>Caricamento in corso...</p>; // Visualizza un messaggio di caricamento
  }

  return (
    <div className="background">
      <div className="content">
        <div className="header">
          <div className="page-title">{character.name}</div>
        </div>

        <div className="character-detail">
          <img
            src={character.image}
            alt={character.name}
            className="character-image"
          />
          <div className="character-info">
            <p>
              <strong>Nome:</strong> {character.name}
            </p>
            <p>
              <strong>Genere:</strong> {character.gender}
            </p>
            <p>
              <strong>Status:</strong> {character.status}
            </p>
            <p>
              <strong>Specie:</strong> {character.species}
            </p>
            <p>
              <strong>Origine:</strong> 
              <Link href={`/luoghi/${character.origin.url.split('/').pop()}`} legacyBehavior>
                <a>{character.origin.name}</a>
              </Link>
            </p>
            <p>
              <strong>Location:</strong> 
              <Link href={`/luoghi/${character.location.url.split('/').pop()}`} legacyBehavior>
                <a>{character.location.name}</a>
              </Link>
            </p>
            <p>
              <strong>Episodi:</strong> 
              <div className="episode-grid">
                {character.episode.map((episodeUrl) => (
                  <span key={episodeUrl} className="episode-badge">
                    <Link href={`/episodi/${episodeUrl.split('/').pop()}`} legacyBehavior>
                      <a>{episodeUrl.split('/').pop()}</a>
                    </Link>
                  </span>
                ))}
              </div>
            </p>
          </div>
        </div>
      </div>

      <div className="footer">
        <Link href="/personaggi" legacyBehavior>
          <a className="button-back-link">Back</a>
        </Link>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-image: url("/rick-and-morty-wallpaper-portal-wallpaper-001.jpg");
          background-size: cover;
          background-position: center;
          height: 100vh;
          overflow: hidden;
        }

        .background {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow-y: auto; /* Abilita lo scroll verticale all'interno della pagina */
        }
          
        .background::-webkit-scrollbar {
          display: none;
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
          color: purple;
        }

        .character-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1; /* Fai espandere il contenuto */
        }

        .character-image {
          width: 100%;
          max-width: 300px;
          height: auto;
          border-radius: 4px;
          margin-bottom: 20px;
          border-width: 4px;
          border-color: rgba(69, 222, 236, 0.7);
        }

        .character-info {
          text-align: left;
          max-width: 600px; /* Imposta una larghezza massima per il blocco delle informazioni */
          margin: 0 auto; /* Centra il blocco delle informazioni */
        }

        .character-info p {
          margin-bottom: 10px;
        }

        .episode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          max-height: 200px; /* Altezza massima della griglia */
          overflow-y: auto; /* Abilita lo scroll verticale */
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        
        .episode-grid::-webkit-scrollbar {
          display: none;
        }

        .episode-badge {
          background-color: purple;
          color: white;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 14px;
          text-align: center;
        }

        .episode-badge a {
          color: white;
          text-decoration: none;
        }

        .footer {
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
          background-color: hsla(300, 80%, 31%, 0.925);
        }
      `}</style>
    </div>
  );
};

export default CharacterDetailPage;
