
const { adams } = require("../Ibrahim/adams");
const conf = require("../config");

adams({ nomCom: "owner", categorie: "General", reaction: "🚘" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;
    
    const vcard =
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:' + conf.OWNER_NAME + '\n' +
        'ORG: WHATSAPP BOT;\n' +
        'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' +
        'END:VCARD';
    
    zk.sendMessage(dest, {
        contacts: {
            displayName: conf.OWNER_NAME,
            contacts: [{ vcard }],
        },
    }, { quoted: ms });
});

adams({ nomCom: "dev", categorie: "General", reaction: "🚘" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
      { nom: "bravin", number: "254717263689" }
    ];

    let message = "WELCOME TO whatsapp bot HELP CENTER! CONTACT THE DEVELOPER:\n\n";
    for (const dev of devs) {
      message += `• ${dev.nom} : https://wa.me/${dev.number}\n`;
    }
    
    var lien = mybotpic();
    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            zk.sendMessage(dest, { video: { url: lien }, caption: message }, { quoted: ms });
        }
        catch (e) {
            console.log("Error sending message: " + e);
            repondre("Error sending message: " + e);
        }
    } 
    else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            zk.sendMessage(dest, { image: { url: lien }, caption: message }, { quoted: ms });
        }
        catch (e) {
            console.log("Error sending message: " + e);
            repondre("Error sending message: " + e);
        }
    } 
    else {
        repondre("Error: Invalid media link");
    }
});

adams({ nomCom: "support", categorie: "General" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions; 
    
    const supportMessage = `
THANK YOU FOR CHOOSING BWM-XMD

SUPPORT LINKS:
☉ Channel: https://whatsapp.com/channel/0029VbB4nox4Y9lqVl2X8n3m
☉ Group: https://whatsapp.com/channel/0029VbB4nox4Y9lqVl2X8n3m
☉ YouTube: https://whatsapp.com/channel/0029VbB4nox4Y9lqVl2X8n3m

Created by sir bravin 
`;
    
    repondre(supportMessage);
    await zk.sendMessage(auteurMessage, {
        text: `THANK YOU FOR CHOOSING WHATSAPP BOT, MAKE SURE YOU FOLLOW THESE LINKS.`
    }, { quoted: ms });
});
