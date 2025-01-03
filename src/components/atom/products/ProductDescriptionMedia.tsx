import { useRef, useState } from 'react';
import styled from 'styled-components';
import playIcon from '@icons/play_icon.svg';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import labubu from '../../../assets/videos/aquarium.mp4';

const DescriptionMediaWrapper = styled.div`
    height: 330px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    position: relative;
    transition: ${defaultTheme.default_transition};
    margin-top: auto;
    margin-bottom: 7%;

    @media (max-width: ${breakpoints.lg}) {
        height: 260px;
    }

    @media (max-width: ${breakpoints.sm}) {
        height: 200px;
    }

    video {
        object-fit: cover;
    }

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
    }

    .media-title {
        position: absolute;
        bottom: 20px;
        left: 16px;
        right: 16px;
        z-index: 1;
    }

    .media-play-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        transition: ${defaultTheme.default_transition};
        opacity: 0;
        visibility: hidden;

        &:hover {
            transform: translate(-50%, -50%) scale(0.9);
        }
    }

    &:hover {
        .media-play-btn {
            visibility: visible;
            opacity: 1;
        }
    }
`;

const ProductDescriptionMedia: React.FC = () => {
    const [playing, setPlaying] = useState<boolean>(false);
    const mediaVideoRef = useRef<HTMLVideoElement | null>(null);

    const handlePlayPause = () => {
        const mediaVideo = mediaVideoRef.current;

        if (mediaVideo) {
            if (!playing) {
                mediaVideo.play();
            } else {
                mediaVideo.pause();
            }

            setPlaying(!playing);
        }
    };

    return (
        <DescriptionMediaWrapper>
            <video className="w-full h-full" loop muted ref={mediaVideoRef}>
                <source src={labubu} type="video/mp4"></source>
                Your browser does not support the video tag.
            </video>
            <button type="button" className="media-play-btn" onClick={handlePlayPause}>
                <img src={playIcon} alt="play icon" />
            </button>
            {/* <h4 className="media-title text-white text-xl font-medium text-center">
                Raven Hoodie with black colored design
            </h4> */}
        </DescriptionMediaWrapper>
    );
};

export default ProductDescriptionMedia;
