import './App.css';
import { songsdata } from './audios';
import { useRef, useState, useEffect } from 'react';
import MiniPlayer from './MiniPlayer';
import Player from './Player';

interface Song {
  title: string;
  url: string;
  progress?: number;
  length?: number;
}

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(songsdata);
  const [isplaying, setIsPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<Song>(songsdata[0]);
  const [showPlayer, setShowPlayer] = useState<boolean>(true);
  const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(true);
  const [mixMusic, setMixMusic] = useState<boolean>(false);
  const [mixSongsdata, setMixSongsdata] = useState<Song[]>([]);
  const [repeatValue, setRepeatValue] = useState<number>(1);
  
  const audioElem = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let arrayCopy = [...songsdata];
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    setMixSongsdata(arrayCopy);
  }, []);

  useEffect(() => {
    if (audioElem.current) {
      isplaying ? audioElem.current.play() : audioElem.current.pause();
    }
  }, [isplaying, currentSong]);

  const onPlaying = () => {
    if (audioElem.current) {
      const duration = audioElem.current.duration || 0;
      const ct = audioElem.current.currentTime || 0;
      setCurrentSong((prev) => ({ ...prev, progress: ct, length: duration }));
    }
  };

  const skipBack = () => {
    const index = mixMusic
      ? mixSongsdata.findIndex((x) => x.title === currentSong.title)
      : songs.findIndex((x) => x.title === currentSong.title);

    const newIndex = index === 0 
      ? (mixMusic ? mixSongsdata.length - 1 : songs.length - 1) 
      : index - 1;

    setCurrentSong(mixMusic ? mixSongsdata[newIndex] : songs[newIndex]);

    if (audioElem.current) audioElem.current.currentTime = 0;
  };

  const skiptoNext = () => {
    const index = mixMusic
      ? mixSongsdata.findIndex((x) => x.title === currentSong.title)
      : songs.findIndex((x) => x.title === currentSong.title);

    const newIndex = index === (mixMusic ? mixSongsdata.length - 1 : songs.length - 1) 
      ? 0 
      : index + 1;

    setCurrentSong(mixMusic ? mixSongsdata[newIndex] : songs[newIndex]);

    if (audioElem.current) audioElem.current.currentTime = 0;
  };

  const repeatMusicFunc = () => {
    const index = songs.findIndex((x) => x.title === currentSong.title);
    switch (repeatValue) {
      case 1:
        if (index === songs.length - 1) setIsPlaying(false);
        else skiptoNext();
        break;
      case 2:
        skiptoNext();
        break;
      case 3:
        setCurrentSong(songs[index]);
        break;
      default:
        skiptoNext();
        break;
    }
  };

  return (
    <div className="App">
      <audio
        src={currentSong.url}
        ref={audioElem}
        onTimeUpdate={onPlaying}
        onEnded={() => {
          if (mixMusic) skiptoNext();
          repeatMusicFunc();
        }}
      />

      <MiniPlayer
        isplaying={isplaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setShowPlayer={setShowPlayer}
        showMiniPlayer={showMiniPlayer}
        setShowMiniPlayer={setShowMiniPlayer}
      />

      <Player
        isplaying={isplaying}
        setIsPlaying={setIsPlaying}
        audioElem={audioElem}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        mixMusic={mixMusic}
        setMixMusic={setMixMusic}
        skipBack={skipBack}
        skiptoNext={skiptoNext}
        repeatValue={repeatValue}
        setRepeatValue={setRepeatValue}
        showPlayer={showPlayer}
        setShowPlayer={setShowPlayer}
        showMiniPlayer={showMiniPlayer}
      />
    </div>
  );
};

export default App;
