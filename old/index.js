const correctAnswer = 'girl';
    const translations = {
      en: { 
        title: "Press enter to play!",
        question: "It's a...",
        boy: "BOY",
        girl: "GIRL",
        correct: "It's a",
        incorrect: "Sorry! It's a"
      },
      pt: { 
        title: "Pressione enter para jogar!",
        question: "Você acha que é...",
        boy: "MENINO",
        girl: "MENINA",
        correct: "É ",
        incorrect: "ERROU! É"
      }
    };
    
    const userLang = navigator.language.slice(0, 2);
    const lang = translations[userLang] ? userLang : 'pt';

    //document.getElementsByClassName('question')[0].textContent = translations[lang].question;
    //document.getElementById('btn-boy').textContent = translations[lang].boy;
    //document.getElementById('btn-girl').textContent = translations[lang].girl;
    //document.getElementById('titleText').textContent = translations[lang].title;
    
     window.playMidi = function(fileName) {
      }

      function onKeyPress(keyName, callback) {
        function handler(event) {
          if (event.key.toLowerCase() === keyName.toLowerCase()) {
            callback(event);
          }
        }
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
      }

    function goToTitle() {     
      showScreen('title');
      const titleT = document.getElementById('titleText');
      if(titleT) titleT.textContent = translations[lang].title;
      const unbindEnter = onKeyPress('Enter', () => {
        goToSelect();
        unbindEnter();
      });
    }

    function goToSelect() {
      playMidi('charselect.mid');
      showScreen('select');
    }

    function showScreen(className) {
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      document.querySelector(`.screen-${className}`).classList.add('active');
    }

     function checkAnswer(choice) {
      const resultText = document.getElementById('resultText');
      const resultImage = document.getElementById('resultImage');

      if (choice === correctAnswer) {
        playMidi('reveal.mid');
        resultText.textContent = `🎉${translations[lang].correct} ${translations[lang][choice].toUpperCase()}!🎉`;
        resultImage.src = `assets/its-a-${choice}.png`;
        resultImage.alt = `${translations[lang].correct} ${translations[lang][choice].toUpperCase()}`;
      } else {
        resultText.textContent = `${translations[lang].incorrect} ${translations[lang][correctAnswer].toUpperCase()}`;
        resultImage.src = `assets/its-a-${correctAnswer}.png`;
      }
      showScreen('result');
      const unbindEscape = onKeyPress('Escape', () => {
        goToTitle();
        unbindEscape();
      });
    }

    // Optional: preload all images
    ['boy.png', 'girl.png', 'button.png', 'its-a-boy.png','its-a-girl.png'].forEach(src => {
      const img = new Image();
      img.src = `assets/${src}`;
    });

    goToTitle();