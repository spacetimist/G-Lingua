document.addEventListener('DOMContentLoaded', () => {
    const words = [
        { english: 'Sunny', indonesian: 'Cerah' },
        { english: 'Rainy', indonesian: 'Hujan' },
        { english: 'Cloudy', indonesian: 'Berawan' },
        { english: 'Windy', indonesian: 'Berangin' },
        { english: 'Snowy', indonesian: 'Bersalju' },
        { english: 'Stormy', indonesian: 'Badai' }
    ];

    const cardContainer = document.getElementById('card-container');
    const feedback = document.getElementById('feedback');
    const completionMessage = document.getElementById('completion-message');
    const finishButton = document.getElementById('finish-quiz');
    let firstSelectedCard = null;
    let secondSelectedCard = null;
    let lockBoard = false;
    let matchedPairs = 0; // Track the number of matched pairs

    // Shuffle function
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Generate cards
    function generateCards() {
        const allCards = words.flatMap(word => [
            { text: word.english, match: word.indonesian },
            { text: word.indonesian, match: word.english }
        ]);

        const shuffledCards = shuffle(allCards);

        shuffledCards.forEach((word) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.textContent = word.text;
            card.dataset.match = word.match;
            card.addEventListener('click', () => handleCardClick(card));
            cardContainer.appendChild(card);
        });
    }

    // Handle card click
    function handleCardClick(card) {
        if (lockBoard || card.classList.contains('selected') || card.classList.contains('matched')) {
            return; // Skip if board is locked or card is already selected or matched
        }

        card.classList.add('selected');

        if (!firstSelectedCard) {
            firstSelectedCard = card; // Select the first card
        } else {
            secondSelectedCard = card; // Select the second card
            lockBoard = true;
            checkMatch(); // Check if cards match
        }
    }

    // Check if two selected cards match
    function checkMatch() {
        if (firstSelectedCard.dataset.match === secondSelectedCard.textContent || secondSelectedCard.dataset.match === firstSelectedCard.textContent) {
            feedback.textContent = 'Correct match!';
            matchedPairs++; // Increment matched pairs count

            // Remove matched cards from the DOM
            setTimeout(() => {
                firstSelectedCard.remove();
                secondSelectedCard.remove();
                feedback.textContent = ''; // Clear feedback after removing

                if (matchedPairs === words.length) {
                    showCompletionMessage();
                    finishButton.classList.remove('hidden');
                    finishButton.classList.add('show');
                    scrollToFinishButton(); 
                }
            }, 500); // Give a little delay before removing the cards

        } else {
            feedback.textContent = 'Try again!';
            setTimeout(() => {
                firstSelectedCard.classList.remove('selected');
                secondSelectedCard.classList.remove('selected');
            }, 1000);
        }

        // Reset selections after checking
        setTimeout(() => {
            firstSelectedCard = null;
            secondSelectedCard = null;
            lockBoard = false;
        }, 1000);
    }

    // Display completion message
    finishButton.addEventListener('click', () => {
        localStorage.removeItem('currentQuestion');
        window.location.href = 'index.html';
    });
    
    function scrollToFinishButton() {
        finishButton.scrollIntoView({ behavior: 'smooth' }); // Gulir dengan efek smooth
    }
    
    function showCompletionMessage() {
        completionMessage.classList.remove('hidden');
        
        // Add class 'show' for transition effect
        setTimeout(() => {
            completionMessage.classList.add('show');
        }, 100);
    }
    

    // Initialize game
    generateCards();
});
