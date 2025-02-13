import './miniPlayer.scss';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";


export default function MiniPlayer({ isplaying, setIsPlaying, currentSong, setShowPlayer, showMiniPlayer, setShowMiniPlayer }: any) {

    // функция паузы и воспроизведения
    const PlayPause = () => {
        setIsPlaying(!isplaying);
    }

    const removePlayer = () => {
        setIsPlaying(false)
        setShowPlayer(false)
        setShowMiniPlayer(false)
    }

    return (
        <div className="playerMobile_container" style={{ display: showMiniPlayer ? 'flex' : 'none' }} onClick={() => setShowPlayer(true)}>
            {isplaying ?
                <button onClick={(e) => { e.stopPropagation(); PlayPause(); }}>
                    <BsFillPauseCircleFill className='btn_action pp' />
                </button>
                :
                <button onClick={(e) => { e.stopPropagation(); PlayPause(); }}>
                    <BsFillPlayCircleFill className='btn_action pp' />
                </button>
            }

            <div className="music_info_text">
                <p className='title'>{currentSong.title}</p>
                <p className='artist'>{currentSong.artist}</p>
            </div>

            <button onClick={(e) => { e.stopPropagation(); removePlayer(); }}>
                <IoClose className='btn_action' />
            </button>
        </div>
    )
}