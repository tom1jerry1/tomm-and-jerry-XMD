const { adams } = require('../Ibrahim/adams');
const axios = require('axios');
const conf = require(__dirname + "/../config");
const { dare, truth, random_question, amount_of_questions } = require('../Ibrahim/handler.js');


adams({
  nomCom: "quran",
 aliases: ["surah", "qurann"],
  reaction: '🖤',
  categorie: "search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const reference = arg.join(" ");
  
  if (!reference) {
    return repondre("Please specify the surah number or name.");
  }
  
  try {
    const response = await axios.get(`https://quran-endpoint.vercel.app/quran/${reference}`);
    
    if (response.data.status !== 200) {
      return repondre("Invalid surah reference. Please specify a valid surah number or name.");
    }
    
    const data = response.data.data;
    const messageText = `
❑ * QURAN SURAH* ❑

📕 Quran: The Holy Book
📖 Surah ${data.number}: ${data.asma.ar.long} (${data.asma.en.long})
Type: ${data.type.en}
Number of verses: ${data.ayahCount}
🖊 *Explanation (Urdu):* ${data.tafsir.id}
🖊 *Explanation (English):* ${data.tafsir.en}
╭─────────────────╮
│ *_Powered by sir bravin_*
╰─────────────────╯ `;
    
    await zk.sendMessage(dest, {
      text: messageText
    }, { quoted: ms });
    
  } catch (error) {
    console.error("Error fetching Quran passage:", error);
    await repondre("API request failed. Please try again later.");
  }
});

adams({
  nomCom: "currency",
  aliases: ["💲", "💰"],
  categorie: "trade",
  reaction: '🔄',
}, async (sender, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre('Example usage: currency 100 USD to EUR');
  }

  const [amount, fromCurrency, toCurrency] = text.split(" ");

  if (!amount || !fromCurrency || !toCurrency) {
    return repondre('Example usage: currency 100 USD to EUR');
  }

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const url = `https://api.davidcyriltech.my.id/tools/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;

      const response = await axios.get(url);
      const data = response.data;

      if (data && data.success) {
        return data.result;
      } else {
        throw new Error('Failed to retrieve conversion data.');
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      return 'Something went wrong. Unable to fetch conversion data.';
    }
  };

  const result = await convertCurrency(amount, fromCurrency, toCurrency);
  await repondre(result);
});

adams({
  nomCom: "advice",
  aliases: ["wisdom", "wise"],
  reaction: "🧠",
  desc: "to pass wisdom",
  categorie: "Fun"
}, async (dest, zk, context) => {
  const { reply: replyToUser, ms: messageQuote } = context;
  try {
    const response = await axios.get("https://api.adviceslip.com/advice");
    const advice = response.data.slip.advice;

    await zk.sendMessage(dest, {
      text: `Here is your advice: ${advice} 😊`
    }, { quoted: messageQuote });
  } catch (error) {
    console.error("Error fetching advice:", error.message || "An error occurred");
    await replyToUser("Oops, an error occurred while processing your request.");
  }
});

adams({
  nomCom: "trivia",
  reaction: '🤔',
  desc: 'tovshow trivia questions',
  categorie: 'Fun'
}, async (dest, zk, context) => {
  const { reply: replyToUser, prefix: prefix, ms: messageQuote } = context;
  try {
    const response = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
    if (response.status !== 200) {
      return replyToUser("Invalid response from the trivia API. Status code: " + response.status);
    }

    const trivia = response.data.results[0];
    const question = trivia.question;
    const correctAnswer = trivia.correct_answer;
    const answers = [...trivia.incorrect_answers, correctAnswer].sort();

    const answerChoices = answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n");

    await zk.sendMessage(dest, {
      text: `Here's a trivia question for you: \n\n${question}\n\n${answerChoices}\n\nI will send the correct answer in 10 seconds...`
    }, { quoted: messageQuote });

    setTimeout(async () => {
      await zk.sendMessage(dest, {
        text: `The correct answer is: ${correctAnswer}`
      }, { quoted: messageQuote });
    }, 10000);

  } catch (error) {
    console.error("Error getting trivia:", error.message);
    await zk.sendMessage(dest, {
      text: "Error getting trivia. Please try again later."
    }, { quoted: messageQuote });
  }
});


adams({
  nomCom: "question",
  categorie: "fun",
  desc: "to ask random questions",
  reaction: "🤖"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    await zk.sendMessage(dest, {
      text: random_question()
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'question' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

adams({
  nomCom: "truth",
  categorie: "fun",
  desc: "this is a truth game",
  reaction: "🤖"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    await zk.sendMessage(dest, {
      text: truth()
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'truth' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

adams({
  nomCom: "dare",
  categorie: "fun",
  desc: "rhis is a dare game",
  reaction: "🤖"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    await zk.sendMessage(dest, {
      text: dare()
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'dare' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

adams({
  nomCom: "amountquiz",
  categorie: "fun",
  desc: "a game of amount quiz",
  reaction: "🤖"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    const totalQuestions = amount_of_questions(0);
    await zk.sendMessage(dest, {
      text: `${totalQuestions}`
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'amountquiz' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

adams({
  nomCom: "fact",
  reaction: '✨',
  desc: "to show some random facts",
  categorie: "Fun"
}, async (dest, zk, context) => {
  const { repondre: respond, arg, ms } = context;

  try {
    const response = await axios.get("https://nekos.life/api/v2/fact");
    const data = response.data;
    const factMessage = `
┌───── *WHATSAPP BOT-FACT* ──────╮                     
│
│   ❏ ${data.fact} 
│
│   ❏ Regards *Ultraxas md*
│      
╰─────────────────╯
│ *_Powered by Ultraxas md._*
╰─────────────────╯
    `;

    await zk.sendMessage(dest, {
      text: factMessage
    }, { quoted: ms });
  } catch (error) {
    console.error(error);
    await respond("An error occurred while fetching the fact.");
  }
});

adams({
  nomCom: "quotes",
  reaction: '💬',
  desc: "to show some random quotes",
  categorie: "Fun"
}, async (dest, zk, context) => {
  const { repondre: respond, arg, ms } = context;

  try {
    const response = await axios.get("https://favqs.com/api/qotd");
    const data = response.data;
    const quoteMessage = `
┌──────QUOTE───────╮
│   ❏ _${data.quote.body}_
│  
│   ❏ *AUTHOR:* ${data.quote.author}
│      
│    ❏  *regards sir bravin*
│    
╰─────────────────╯
│ *_Powered by sir bravin._*
╰─────────────────╯
    `;

    await zk.sendMessage(dest, {
      text: quoteMessage
    }, { quoted: ms });
  } catch (error) {
    console.error(error);
    await respond("An error occurred while fetching the quote.");
  }
});


adams({
  nomCom: "happy",
  categorie: "fun",
  desc: "happy fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations =  ['😃', '😄', '😁', '😊', '😎', '🤩', '😍', '🥰', '🤗', '🤭', '😃', '😄', '😁', '😊', '😎', '🤩', '😍', '🥰', '🤗', '🤭', '😃', '😄', '😁', '😊'];
    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});
adams({
  nomCom: "hrt",
  aliases: ["moyo", "heart"],
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations =  ['💖', '💗', '💓', '♥️', '💛', '💙', '🖤', '💜', '💝', '❤️', '♥️', '🤎', '🤍', '💗', '💟', '💔', '💘', '💕', '♥️', '💞', '🖤', '♥️'];
    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});
adams({
  nomCom: "angry",
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations =   ['😡', '😠', '🤬', '😤', '😣', '😡', '😠', '🤬', '😤', '😣'];
    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});
adams({
  nomCom: "sad",
  aliases: ["heartbroken", "hrtbroken"],
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations =  ['🥺', '😿', '😵', '😶', '😫', '😩', '😔', '😟', '🙁', '☹️', '😢', '😥', '😓', '😞', '😭', '😭', '😿'];
    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});
adams({
  nomCom: "shy",
  aliases: ["shyoff", "shyy"],
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations =  ['😳', '😊', '😦', '🙈', '🙊', '😳', '😊', '😦', '🙈', '🙊'];
    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});
adams({
  nomCom: "moon",
  aliases: ["mon", "crescent"],
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations =   ['🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', "🌙🌚"];
    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});

adams({
  nomCom: "nikal",
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations = ["   ▐░╫╣▒▒▒▓▓▒╖╜   ▄▐▒▒▓▌╙ \n  ▐▌╙▓          █╙ ╚         ▐∙\n▄▐▓▄╙▄▀▀▀╙ ▀▀╙   ▀ █          ╚\n█▐▌╚▐▄▐▓▓▄╙╛▀▀▌     ▐  ▐   Nikal   ╚\n ▐▓▐╚     █        ▐  ▐            ╚\n  ▒▀▐▌   __        ╛  ╚        ╙\n   ▒░▌     ╛▀    ▒▄▀▀▐▌▐ \n    █∙╚░▄▄▄▄▀▀▀▀▀▀          \n ▀▀▄▌▐▐▐▌  ▐▄ ▐▌▀∙▀▀▀▀╙      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      `", "   ▐░╫╣▒▒▒▓▓▒╖╜   ▄▐▒▒▓▌╙ \n  ▐▌╙▓          █╙ ╚         ▐∙\n▄▐▓▄╙▄▀▀▀╙ ▀▀╙   ▀ █          ╚\n█▐▌╚▐▄▐▓▓▄╙╛▀▀▌     ▐  ▐   Lavde   ╚\n ▐▓▐╚     █        ▐  ▐            ╚\n  ▒▀▐▌  |__|     ╛  ╚        ╙\n   ▒░▌     ╛▀    ▒▄▀▀▐▌▐ \n    █∙╚░▄▄▄▄▀▀▀▀▀▀          \n ▀▀▄▌▐▐▐▌  ▐▄ ▐▌▀∙▀▀▀▀╙      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      `", "   ▐░╫╣▒▒▒▓▓▒╖╜   ▄▐▒▒▓▌╙ \n  ▐▌╙▓           █╙ ╚         ▐∙\n▄▐▓▄╙▄▀▀▀╙ ▀▀╙   ▀ █          ╚\n█▐▌╚▐▄▐▓▓▄╙╛▀▀▌    ▐  ▐   Pehli   ╚\n ▐▓▐╚     █       ▐  ▐            ╚\n  ▒▀▐▌  (P)       ╛  ╚        ╙\n   ▒░▌     ╛▀    ▒▄▀▀▐▌▐ \n    █∙╚░▄▄▄▄▀▀▀▀▀▀          \n ▀▀▄▌▐▐▐▌  ▐▄ ▐▌▀∙▀▀▀▀╙      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      `", "   ▐░╫╣▒▒▒▓▓▒╖╜   ▄▐▒▒▓▌╙ \n  ▐▌╙▓           █╙ ╚         ▐∙\n▄▐▓▄╙▄▀▀▀╙ ▀▀╙   ▀ █          ╚\n█▐▌╚▐▄▐▓▓▄╙╛▀▀▌    ▐  ▐  Fursat  ╚\n ▐▓▐╚     █         ▐  ▐           ╚\n  ▒▀▐▌   __        ╛  ╚        ╙\n   ▒░▌     ╛▀    ▒▄▀▀▐▌▐ \n    █∙╚░▄▄▄▄▀▀▀▀▀▀          \n ▀▀▄▌▐▐▐▌  ▐▄ ▐▌▀∙▀▀▀▀╙      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      `", "   ▐░╫╣▒▒▒▓▓▒╖╜   ▄▐▒▒▓▌╙ \n  ▐▌╙▓           █╙ ╚         ▐∙\n▄▐▓▄╙▄▀▀▀╙ ▀▀╙   ▀ █          ╚\n█▐▌╚▐▄▐▓▓▄╙╛▀▀▌    ▐  ▐  Meeee   ╚\n ▐▓▐╚     █         ▐  ▐           ╚\n  ▒▀▐▌  |__|      ╛  ╚        ╙\n   ▒░▌     ╛▀    ▒▄▀▀▐▌▐ \n    █∙╚░▄▄▄▄▀▀▀▀▀▀          \n ▀▀▄▌▐▐▐▌  ▐▄ ▐▌▀∙▀▀▀▀╙      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      `", "   ▐░╫╣▒▒▒▓▓▒╖╜   ▄▐▒▒▓▌╙ \n  ▐▌╙▓           █╙ ╚         ▐∙\n▄▐▓▄╙▄▀▀▀╙ ▀▀╙   ▀ █           ╚\n█▐▌╚▐▄▐▓▓▄╙╛▀▀▌   ▐  ▐   Nikal   ╚\n ▐▓▐╚     █        ▐  ▐            ╚\n  ▒▀▐▌  lodu     ╛  ╚       ╙\n   ▒░▌       ╛▀    ▒▄▀▀▐▌▐ \n    █∙╚░▄▄▄▄▀▀▀▀▀▀          \n ▀▀▄▌▐▐▐▌  ▐▄ ▐▌▀∙▀▀▀▀╙      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      \n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ "];

    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});

adams({
  nomCom: "hand",
  categorie: "fun",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  
  try {
    const sentMessage = await zk.sendMessage(dest, { text: "✨ *STARTED...* 🔥" });
    const animations = [
      '8✨===D', '8=✨==D', '8==✨=D', '8===✨D', '8==✨=D', '8=✨==D', 
      '8✨===D', '8=✨==D', '8==✨=D', '8===✨D', '8==✨=D', '8=✨==D', 
      '8✨===D', '8=✨==D', '8==✨=D', '8===✨D', '8==✨=D', '8=✨==D', 
      '8✨===D', '8=✨==D', '8==✨=D', '8===✨D 🔥', '8==✨=D🔥 🔥', '8=✨==D 🔥🔥 🔥'
    ];

    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await zk.relayMessage(dest, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: animation
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    repondre("⚠ *Error!* " + error.message);
  }
});
adams({
  nomCom: "insult",
  aliases: ["abuse", "tusi"],
  categorie: "search",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const response = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
    const data = response.data;

    if (!data || !data.insult) {
      return repondre('Unable to retrieve an insult. Please try again later.');
    }

    const insult = data.insult;
    return repondre(`*Insult:* ${insult}`);
  } catch (error) {
    repondre(`Error: ${error.message || error}`);
  }
});
