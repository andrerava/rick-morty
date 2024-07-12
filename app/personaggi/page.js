"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const PersonaggiPage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const savedLikes = getSavedLikes();
    setLikes(savedLikes);

    async function fetchCharacters() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?page=${page}`
        );

        if (!response.ok) {
          throw new Error("Risorsa non disponibile");
        }

        const data = await response.json();
        setCharacters(data.results);
        setTotalPages(data.info.pages);

        const initialLikes = data.results.reduce((acc, character) => {
          acc[character.id] = savedLikes[character.id] || false;
          return acc;
        }, {});
        setLikes((prevLikes) => ({ ...prevLikes, ...initialLikes }));
      } catch (error) {
        setError(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [page]);

  const getSavedLikes = () => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem('likes')) || {};
      return savedLikes;
    } catch (error) {
      console.error("Errore nel recuperare i like salvati:", error);
      return {};
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const like = (id) => {
    setLikes((prevLikes) => {
      const newLikes = {
        ...prevLikes,
        [id]: !prevLikes[id],
      };
      localStorage.setItem('likes', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="background">
      <div className="content">
        <div className="header">
          <div className="page-title">Personaggi di Rick and Morty</div>
          <Link href="../favoritesPersonaggi" legacyBehavior>
            <a className="button-favorites-link">Personaggi Preferiti</a>
          </Link>
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
          {!loading && !error && filteredCharacters.length === 0 && (
            <p>Nessun personaggio trovato.</p>
          )}
          {filteredCharacters.map((character) => (
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
              <button
                className="like-button"
                onClick={() => like(character.id)}
              >
                {likes[character.id] ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Pagina {page} di {totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <div className="footer">
          <Link href="." legacyBehavior>
            <a className="button-back-link">Back</a>
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

        .page-title {
          font-size: 3rem;
          font-weight: bold;
          color: purple;
        }

        .button-favorites-link {
          text-decoration: none;
          color: #fff;
          background-color: purple;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .button-favorites-link:hover {
          background-color: #6a0dad;
        }

        .search-input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
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
          position: relative; /* Aggiunto per posizionare il bottone del like */
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

        .like-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          margin-top: 10px;
          align-self: flex-end;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }

        .pagination button {
          background-color: purple;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          margin: 0 10px;
        }

        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
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

export default PersonaggiPage;
