import './globals.css';

export default function HomePage() {
  return (
    <>
      <div className="homepage">
        <div className="image-header">
          <img src="/Rick_and_Morty.png" alt="Rick and Morty Header Image" />
        </div>

        <div className="button-container">
          <a href="./luoghi" className="button-luoghi">
            <div className="button-text">Luoghi</div>
          </a>
          <a href="./episodi" className="button-episodi">
            <div className="button-text">Episodi</div>
          </a>
          <a href="./personaggi" className="button-personaggi">
            <div className="button-text">Personaggi</div>
          </a>
        </div>
      </div>
    </>
  );
}
