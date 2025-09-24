import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { UserContact } from '../types';
import { PhoneOffIcon, MicOffIcon, MicrophoneIcon, VideoOffIcon, VideoIcon, SparklesIcon, UserIcon } from './icons/Icons';

interface CallViewProps {
    contact: UserContact;
    onEndCall: () => void;
}

const CallView: React.FC<CallViewProps> = ({ contact, onEndCall }) => {
    const { t } = useSettings();
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStream = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStream.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing media devices.", error);
                alert("Camera and microphone access was denied. Please allow access in your browser settings to use video call features.");
                onEndCall();
            }
        };

        startStream();

        return () => {
            localStream.current?.getTracks().forEach(track => track.stop());
        };
    }, [onEndCall]);

    const toggleMute = () => {
        localStream.current?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMuted(prev => !prev);
    };

    const toggleCamera = () => {
        localStream.current?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsCameraOff(prev => !prev);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex flex-col" role="dialog" aria-modal="true">
            {/* Remote video (mock) */}
            <div className="flex-1 flex items-center justify-center relative">
                 <img src={contact.avatarUrl} alt={contact.name} className="w-48 h-48 rounded-full object-cover animate-pulse" />
                 <div className="absolute bottom-10 text-center text-white">
                    <p className="text-lg">{t('calling')}...</p>
                    <h2 className="text-4xl font-bold">{contact.name}</h2>
                 </div>
            </div>

            {/* Local video */}
            <video ref={localVideoRef} autoPlay muted playsInline className={`absolute bottom-28 right-5 w-40 h-auto rounded-lg shadow-lg border-2 border-white dark:border-gray-800 transition-opacity duration-300 ${isCameraOff ? 'opacity-0' : 'opacity-100'}`}></video>
             {isCameraOff && (
                <div className="absolute bottom-28 right-5 w-40 h-[10.5rem] rounded-lg shadow-lg bg-black border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
            )}


            {/* Controls */}
            <div className="bg-black/50 p-4 flex justify-center items-center space-x-6">
                <button onClick={toggleMute} className="flex flex-col items-center text-white space-y-1 p-2 rounded-lg hover:bg-white/10" aria-label={isMuted ? t('unmute') : t('mute')}>
                    {isMuted ? <MicOffIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                    <span className="text-xs">{isMuted ? t('unmute') : t('mute')}</span>
                </button>
                 <button onClick={toggleCamera} className="flex flex-col items-center text-white space-y-1 p-2 rounded-lg hover:bg-white/10" aria-label={isCameraOff ? t('videoOn') : t('videoOff')}>
                    {isCameraOff ? <VideoOffIcon className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                    <span className="text-xs">{isCameraOff ? t('videoOn') : t('videoOff')}</span>
                </button>
                 <button className="flex flex-col items-center text-white space-y-1 p-2 rounded-lg hover:bg-white/10 opacity-50 cursor-not-allowed" title={t('aiPartnerDescription')} aria-label={t('aiPartner')}>
                    <SparklesIcon className="w-6 h-6" />
                    <span className="text-xs">{t('aiPartner')}</span>
                </button>
                <button onClick={onEndCall} className="bg-red-600 p-4 rounded-full text-white hover:bg-red-700" aria-label={t('endCall')}>
                    <PhoneOffIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default CallView;