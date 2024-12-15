// sound-manager.js
const SoundManager = {
    isMuted: false,
    sounds: {
        tetrisRotate: new Audio('https://opengameart.org/sites/default/files/Rotate_0.wav'),
        tetrisClear: new Audio('https://opengameart.org/sites/default/files/8-bit%20powerup%20finished.wav'),
        tetrisGameOver: new Audio('https://freesound.org/data/previews/171/171848_2437798-lq.mp3'),
        buttonClick: new Audio('https://opengameart.org/sites/default/files/Menu%20Selection%20Click%20-%2001.wav'),
        gameStart: new Audio('https://opengameart.org/sites/default/files/start-game_0.wav')
    },

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound && !this.isMuted) {
            try {
                sound.currentTime = 0;
                sound.play().catch(error => {
                    console.warn(`Error playing sound ${soundName}:`, error);
                });
            } catch (error) {
                console.warn(`Playback error for ${soundName}:`, error);
            }
        }
    },

    createSpeakerButton() {
        const button = document.createElement('button');
        button.classList.add('speaker-button');
        button.innerHTML = '🔊';

        button.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            
            if (this.isMuted) {
                button.innerHTML = '🔇';
                button.style.backgroundColor = '#CC0000';
                button.style.borderColor = '#CC0000';
                
                // Properly mute all sounds
                Object.values(this.sounds).forEach(sound => {
                    sound.muted = true;
                });
            } else {
                button.innerHTML = '🔊';
                button.style.backgroundColor = '#00CC00';
                button.style.borderColor = '#00CC00';
                
                // Unmute all sounds
                Object.values(this.sounds).forEach(sound => {
                    sound.muted = false;
                });
            }
        });

        return button;
    },

    init() {
        // Preload and set up sounds
        Object.entries(this.sounds).forEach(([name, sound]) => {
            sound.preload = 'auto';
            // Set a reasonable volume
            sound.volume = 0.5;
        });

        // Add global click sound to buttons
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.pixelated-button').forEach(button => {
                button.addEventListener('click', () => this.play('buttonClick'));
            });

            // Add speaker button to body
            document.body.appendChild(this.createSpeakerButton());
        });
    }
};

// Initialize sound management
SoundManager.init();

export default SoundManager;
