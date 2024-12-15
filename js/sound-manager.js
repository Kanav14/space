// Sound Effects Management with Mute Functionality
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
            sound.currentTime = 0; // Reset sound to start
            sound.play().catch(error => {
                console.warn(`Error playing sound ${soundName}:`, error);
            });
        }
    },

    createSpeakerButton() {
        const button = document.createElement('button');
        button.classList.add('speaker-button');
        button.innerHTML = '🔊'; // Speaker icon
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #00CC00;
            color: black;
            border: 2px solid #00CC00;
            padding: 10px;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            font-family: 'Press Start 2P', cursive;
        `;

        button.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            
            if (this.isMuted) {
                button.innerHTML = '🔇'; // Muted speaker icon
                button.style.backgroundColor = '#CC0000';
                button.style.borderColor = '#CC0000';
                
                // Mute all sounds
                Object.values(this.sounds).forEach(sound => {
                    sound.volume = 0;
                });
            } else {
                button.innerHTML = '🔊'; // Speaker icon
                button.style.backgroundColor = '#00CC00';
                button.style.borderColor = '#00CC00';
                
                // Restore volume
                Object.values(this.sounds).forEach(sound => {
                    sound.volume = 1;
                });
            }
        });

        return button;
    },

    init() {
        // Preload sounds
        Object.values(this.sounds).forEach(sound => {
            sound.preload = 'auto';
        });

        // Add global click sound to buttons
        document.querySelectorAll('.pixelated-button').forEach(button => {
            button.addEventListener('click', () => this.play('buttonClick'));
        });

        // Add speaker button to body
        document.body.appendChild(this.createSpeakerButton());
    }
};

// Initialize sound effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
});

export default SoundManager;
