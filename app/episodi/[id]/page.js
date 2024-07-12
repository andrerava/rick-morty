"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const EpisodeDetailPage = ({ params }) => {
  const [episode, setEpisode] = useState(null); // State per le informazioni sull'episodio
  const [characters, setCharacters] = useState([]); // State per l'elenco dei personaggi presenti nell'episodio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://rickandmortyapi.com/api/episode/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Risorsa non disponibile");
        }

        const data = await response.json();
        setEpisode(data); // Imposta le informazioni sull'episodio

        // Recupera i dettagli dei personaggi presenti nell'episodio
        const charactersResponse = await Promise.all(
          data.characters.map((characterUrl) => fetch(characterUrl).then((res) => res.json()))
        );
        setCharacters(charactersResponse); // Imposta l'array di personaggi
      } catch (error) {
        setError(error.message);
        console.error("Errore durante il recupero dell'episodio:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [params.id]);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Si è verificato un errore: {error}</p>;
  }

  if (!episode) {
    return <p>Nessun episodio trovato per questo ID.</p>;
  }

  return (
    <div className="background">
      <div className="content">
        <div className="header">
          <div className="page-title">{episode.name}</div>
        </div>

        <div className="episode-detail">
          <p>
            <strong>Titolo:</strong> {episode.name}
          </p>
          <p>
            <strong>Numero dell'episodio:</strong> {episode.episode}
          </p>
          <p>
            <strong>Data di trasmissione:</strong> {episode.air_date}
          </p>
          <div className="characters-grid">
            {characters.map((character) => (
              <Link key={character.id} href={`/personaggi/${character.id}`} legacyBehavior>
                <a className="character-item">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="character-image"
                  />
                  <p className="character-name">{character.name}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div className="footer">
          <Link href="." legacyBehavior>
            <a className="button-back-link">Back</a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .background {
          background-image: url("/episodi1.jpg");
          background-size: cover;
          background-position: center;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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

        .characters-grid::-webkit-scrollbar {
          display: none;
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

        .episode-detail {
          text-align: left;
          color: white;
          margin-bottom: 20px;
          background: rgba(0, 0, 0, 0.6); /* Sfondo semi-trasparente */
          padding: 20px;
          border-radius: 8px;
        }

        .episode-detail p {
          margin-bottom: 10px;
          color: white;
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
          justify-items: center;
          max-height: calc(100vh - 300px);
          overflow-y: auto; /* Abilita lo scroll verticale solo se necessario */
        }

        .character-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
        }

        .character-image {
          width: 100%;
          max-width: 120px;
          height: auto;
          border-radius: 50%;
        }

        .character-name {
          margin-top: 10px;
          font-weight: bold;
          color: black;
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

export default EpisodeDetailPage;
