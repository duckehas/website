<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Simple Poker Game</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #121212;
      color: white;
      text-align: center;
      padding: 20px;
    }
    #balance {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #7b61ff;
      padding: 15px 25px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1.3rem;
    }
    #bet-area {
      margin: 20px 0;
    }
    input[type=number] {
      padding: 8px;
      font-size: 1rem;
      border-radius: 6px;
      border: none;
      width: 100px;
      text-align: center;
      margin-right: 10px;
    }
    button {
      background: #7b61ff;
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover {
      background: #9f85ff;
    }
    #cards {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      gap: 15px;
    }
    .card {
      width: 80px;
      height: 120px;
      background: #222;
      border-radius: 10px;
      box-shadow: 0 0 5px #7b61ff;
      color: white;
      font-weight: 700;
      font-size: 1.4rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: transform 0.3s ease;
    }
    .card.selected {
      border: 3px solid #a78bfa;
      transform: translateY(-15px);
      box-shadow: 0 0 15px #a78bfa;
    }
    .card .top-left,
    .card .bottom-right {
      font-size: 1rem;
    }
    #result {
      margin-top: 20px;
      font-size: 1.3rem;
      font-weight: bold;
      min-height: 2em;
    }
  </style>
</head>
<body>
  <div id="balance">Balance: 5000 EB</div>

  <div id="bet-area">
    <input type="number" id="bet" placeholder="Bet" min="10" value="100" />
    <button id="deal-btn">Deal</button>
    <button id="draw-btn" disabled>Draw</button>
  </div>

  <div id="cards"></div>

  <div id="result"></div>

  <script>
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let balance = 5000;
    let deck = [];
    let hand = [];
    let bet = 0;
    let canDraw = false;

    const balanceEl = document.getElementById('balance');
    const betInput = document.getElementById('bet');
    const dealBtn = document.getElementById('deal-btn');
    const drawBtn = document.getElementById('draw-btn');
    const cardsEl = document.getElementById('cards');
    const resultEl = document.getElementById('result');

    function updateBalance() {
      balanceEl.textContent = `Balance: ${balance} EB`;
    }

    function createDeck() {
      deck = [];
      for (const suit of suits) {
        for (const rank of ranks) {
          deck.push({suit, rank});
        }
      }
    }

    function shuffleDeck() {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }

    function cardToString(card) {
      return `${card.rank}${card.suit}`;
    }

    function displayHand() {
      cardsEl.innerHTML = '';
      hand.forEach((card, i) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = i;
        cardDiv.innerHTML = `
          <div class="top-left">${card.rank}${card.suit}</div>
          <div class="bottom-right">${card.rank}${card.suit}</div>
        `;
        if (card.selected) cardDiv.classList.add('selected');
        cardDiv.addEventListener('click', () => {
          if (!canDraw) return;
          card.selected = !card.selected;
          cardDiv.classList.toggle('selected');
        });
        cardsEl.appendChild(cardDiv);
      });
    }

    // Poker hand evaluation helpers
    function rankValue(rank) {
      if (rank === 'A') return 14;
      if (rank === 'K') return 13;
      if (rank === 'Q') return 12;
      if (rank === 'J') return 11;
      return parseInt(rank);
    }

    function evaluateHand(cards) {
      // count ranks and suits
      const counts = {};
      const suitsCount = {};
      const ranksValues = cards.map(c => rankValue(c.rank)).sort((a,b)=>a-b);

      for (const c of cards) {
        counts[c.rank] = (counts[c.rank] || 0) + 1;
        suitsCount[c.suit] = (suitsCount[c.suit] || 0) + 1;
      }

      const isFlush = Object.values(suitsCount).some(count => count === 5);
      const isStraight = ranksValues.every((v,i,a) => i===0 || v === a[i-1]+1) || // normal straight
        (ranksValues.toString() === "2,3,4,5,14"); // wheel (A-2-3-4-5)

      const countsArr = Object.values(counts).sort((a,b)=>b-a);

      if (isFlush && isStraight && ranksValues[4] === 14) return 'Royal Flush';
      if (isFlush && isStraight) return 'Straight Flush';
      if (countsArr[0] === 4) return 'Four of a Kind';
      if (countsArr[0] === 3 && countsArr[1] === 2) return 'Full House';
      if (isFlush) return 'Flush';
      if (isStraight) return 'Straight';
      if (countsArr[0] === 3) return 'Three of a Kind';
      if (countsArr[0] === 2 && countsArr[1] === 2) return 'Two Pair';
      if (countsArr[0] === 2) return 'One Pair';
      return 'High Card';
    }

    function handMultiplier(rank) {
      switch(rank) {
        case 'Royal Flush': return 50;
        case 'Straight Flush': return 25;
        case 'Four of a Kind': return 15;
        case 'Full House': return 9;
        case 'Flush': return 6;
        case 'Straight': return 4;
        case 'Three of a Kind': return 3;
        case 'Two Pair': return 2;
        case 'One Pair': return 1;
        default: return 0;
      }
    }

    dealBtn.addEventListener('click', () => {
      bet = parseInt(betInput.value);
      if (isNaN(bet) || bet < 10) {
        resultEl.textContent = 'Please enter a valid bet of at least 10 EB.';
        return;
      }
      if (bet > balance) {
        resultEl.textContent = 'Not enough balance.';
        return;
      }

      balance -= bet;
      updateBalance();

      createDeck();
      shuffleDeck();

      hand = deck.splice(0,5).map(c => ({...c, selected:false}));

      displayHand();

      resultEl.textContent = 'Select cards to discard and press Draw.';
      dealBtn.disabled = true;
      drawBtn.disabled = false;
      canDraw = true;
    });

    drawBtn.addEventListener('click', () => {
      if (!canDraw) return;

      // Replace selected cards with new ones from deck
      hand = hand.map(card => {
        if (card.selected) {
          return {...deck.shift(), selected:false};
        }
        return card;
      });

      displayHand();

      const rank = evaluateHand(hand);
      const multiplier = handMultiplier(rank);
      const winnings = bet * multiplier;

      if (winnings > 0) {
        balance += winnings;
        updateBalance();
        resultEl.textContent = `You got ${rank}! You win ${winnings} EB!`;
      } else {
        resultEl.textContent = `You got ${rank}. You lose.`;
      }

      dealBtn.disabled = false;
      drawBtn.disabled = true;
      canDraw = false;
    });

    updateBalance();
  </script>
</body>
</html>
