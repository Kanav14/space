export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    const cardWidth = 100;
    const cardHeight = 150;
    const cardPadding = 10;
    const columns = 4;
    const rows = 3;
    
    // Space-themed symbols
    const symbols = [
        '🚀', '🛰️', '🌍', '👨‍🚀', '🌠', 
        '🛸', '🌙', '☄️', '🌌', '🌗', 
        '🌑', '🌒'
    ];
    const cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    
    // Create starry background
    function drawStarryBackground() {
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${Math.random()})`;
            ctx.arc(
                Math.random() * canvas.width, 
                Math.random() * canvas.height, 
                Math.random() * 2, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    // Prepare cards
    function initCards() {
        const selectedSymbols = symbols.slice(0, (columns * rows) / 2);
        const cardSymbols = [...selectedSymbols, ...selectedSymbols];
        
        // Shuffle symbols
        for (let i = cardSymbols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
        }
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                cards.push({
                    x: col * (cardWidth + cardPadding) + 50,
                    y: row * (cardHeight + cardPadding) + 50,
                    symbol: cardSymbols.pop(),
                    isFlipped: false,
                    isMatched: false
                });
            }
        }
    }
    
    // Draw cards
    function drawCards() {
        // Clear and redraw starry background
        drawStarryBackground();
        
        cards.forEach(card => {
            // Card color based on state
            ctx.fillStyle = card.isMatched ? '#00FF00' : 
                           card.isFlipped ? '#00FFFF' : '#003366';
            ctx.shadowBlur = 10;
            ctx.shadowColor = card.isFlipped ? '#00FFFF' : '#00FF00';
            ctx.fillRect(card.x, card.y, cardWidth, cardHeight);
            ctx.shadowBlur = 0;
            
            // Draw symbol if flipped or matched
            if (card.isFlipped || card.isMatched) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(card.symbol, card.x + cardWidth/2, card.y + cardHeight/2 + 20);
            }
        });
        
        // Draw mission status
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`Mission Progress: ${matchedPairs}/${cards.length/2}`, 10, 30);
    }
    
    // Handle card click
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedCard = cards.find(card => 
            x >= card.x && x <= card.x + cardWidth &&
            y >= card.y && y <= card.y + cardHeight &&
            !card.isFlipped && !card.isMatched
        );
        
        if (clickedCard) {
            clickedCard.isFlipped = true;
            flippedCards.push(clickedCard);
            
            if (flippedCards.length === 2) {
                setTimeout(() => checkMatch(), 1000);
            }
        }
        
        drawCards();
    });
    
    // Check card match
    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.symbol === card2.symbol) {
            card1.isMatched = true;
            card2.isMatched = true;
            matchedPairs++;
            
            if (matchedPairs === cards.length / 2) {
                // Mission complete screen
                drawStarryBackground();
                ctx.fillStyle = '#00FFFF';
                ctx.font = '40px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('Mission Accomplished!', canvas.width/2, canvas.height/2);
                ctx.font = '20px Courier New';
                ctx.fillText(`All Space Stations Mapped`, canvas.width/2, canvas.height/2 + 50);
                return;
            }
        } else {
            card1.isFlipped = false;
            card2.isFlipped = false;
        }
        
        flippedCards = [];
        drawCards();
    }
    
    // Reset game
    function resetGame() {
        cards.length = 0;
        flippedCards = [];
        matchedPairs = 0;
        initCards();
        drawCards();
    }
    
    // Initialize game
    initCards();
    drawCards();
}
