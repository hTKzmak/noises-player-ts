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
  // песни (json)
  const [songs, setSongs] = useState<Song[]>(songsdata);

  // играет ли музыка
  const [isplaying, setIsPlaying] = useState<boolean>(false);
  
  // текущая музыка (стоит первая ммузыка по index)
  const [currentSong, setCurrentSong] = useState<Song>(songsdata[0]);

  // отображение плеера
  const [showPlayer, setShowPlayer] = useState<boolean>(true);
  const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(true);

  // перемешивать список музыки (true - да; false - нет)
  const [mixMusic, setMixMusic] = useState<boolean>(false);

   // массив с перемешанными индексами музыки
  const [mixSongsdata, setMixSongsdata] = useState<Song[]>([]);

  // повторение музыки (1 - не повторяется ни список, ни музыка; 2 - повторяется только список; 3 - повторяется только трек)
  const [repeatValue, setRepeatValue] = useState<number>(1);
  
  // место события на разметке (audio тег)
  const audioElem = useRef<HTMLAudioElement | null>(null);



  // Одна из опций плеера: перемешивание музыки (данные songsdata)
  useEffect(() => {
    let arrayCopy = [...songsdata];
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    setMixSongsdata(arrayCopy);
  }, []);

  // воспроизведение и остановка музыки
  useEffect(() => {
    if (audioElem.current) {
      isplaying ? audioElem.current.play() : audioElem.current.pause();
    }
  }, [isplaying, currentSong]);

  // функция по обновлению времени музыки
  const onPlaying = () => {
    if (audioElem.current) {
      const duration = audioElem.current.duration || 0;
      const ct = audioElem.current.currentTime || 0;
      setCurrentSong((prev) => ({ ...prev, progress: ct, length: duration }));
    }
  };

  // пропуск музыки на предыдущую музыку
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

  // пропуск музыки на следующую музыку
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

  // функционал повторения музыки
  const repeatMusicFunc = () => {
    const index = songs.findIndex((x) => x.title === currentSong.title);
    switch (repeatValue) {
      // первая опция: если индекс последней музыки равен длине всего списка музыки, то музыка останавливается
      case 1:
        if (index === songs.length - 1) setIsPlaying(false);
        else skiptoNext();
        break;

      // вторая опция: будет заново воспроизводиться весь список музыки
      case 2:
        skiptoNext();
        break;

      // третья опция: будет заново воспроизводиться только конкретная музыка
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
