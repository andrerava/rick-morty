"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const FavoritesPage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      const savedLikes = JSON.parse(localStorage.getItem('likes')) || {};
      const likedCharacterIds = Object.keys(savedLikes).filter(
        (id) => savedLikes[id]
      );

      if (likedCharacterIds.length === 0) {
        setCharacters([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchPromises = likedCharacterIds.map((id) =>
          fetch(`https://rickandmortyapi.com/api/character/${id}`).then((res) =>
            res.json()
          )
        );

        const results = await Promise.all(fetchPromises);
        setCharacters(results);
      } catch (error) {
        setError(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="background">
      <div className="content">
        <div className="header">
          <div className="page-title">Personaggi Preferiti</div>
        </div>

        <input
          type="text"
          placeholder="Cerca un personaggio per nome..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        <div className="grid-container">
          {loading && <p>Caricamento in corso...</p>}
          {error && <p>Errore: {error}</p>}
          {!loading && !error && characters.length === 0 && (
            <p>Nessun personaggio preferito trovato.</p>
          )}
          {characters.map((character) => (
            <div key={character.id} className="grid-item">
              <Link href={`/personaggi/${character.id}`} legacyBehavior>
                <a>
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
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>

        <div className="footer">
          <Link href="/" legacyBehavior>
            <a className="button-back-link">Back to Home</a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .background {
          background-image: url("/rick-and-morty-wallpaper-portal-wallpaper-001.jpg");
          background-size: cover;
          background-position: center;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
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
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 20px;
        }
                  .search-input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .page-title {
          font-size: 3rem;
          font-weight: bold;
          color: purple;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
          gap: 20px; 
          margin-top: -5px;
          max-height: calc(100vh - 230px); /* Altezza massima della griglia con scroll interno */
          overflow: auto; /* Abilita lo scroll verticale e orizzontale solo se necessario */
          scrollbar-width: none;
          -ms-overflow-style: none; /* Nasconde la barra di scorrimento su Internet Explorer */
        }

        .grid-container::-webkit-scrollbar {
          display: none;
        }

        .grid-item {
          background-color: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: 2px solid purple;
          height: 100%; /* Altezza fissa per ogni elemento della griglia */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-item a {
          text-decoration: none;
          color: #333;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .character-image {
          width: 100%;
          height: auto;
          max-height: 180px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .character-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
        }

        .character-info p {
          margin-bottom: 5px;
        }

        .footer {
          margin-top: auto;
          text-align: center;
          padding: 20px 0;
        }

        .button-back-link {
          text-decoration: none;
          color: #fff;
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

export default FavoritesPage;
