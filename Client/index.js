const request = require('request')
const hookcord = require('hookcord')
const fs = require('fs')
const webhook = require('./webhook.json')
const hook = new hookcord.Hook();
let cache;
let time = 60000;
let init = false;
let dateLaunch = new Date(Date.now())
let jourLaunch = dateLaunch.getDate()
if(jourLaunch<10){
    jourLaunch="0"+jourLaunch.toString()
}
let moisLaunch = dateLaunch.getMonth()+1
if(moisLaunch<10){
    moisLaunch="0"+moisLaunch.toString()
}
let heureLaunch = dateLaunch.getHours()
let minLaunch = dateLaunch.getMinutes()
console.log("Starting...")

function sendMessage(date,titre,prof,content,files) {
    hook.login(webhook.id, webhook.token)
    hook.setPayload({
        "content":files,
        "username": "WEBHOOK - PRONOTE",
        "avatar_url":"https://clg-triolet.monbureaunumerique.fr/lectureFichiergw.do?ID_FICHIER=1042",
        "embeds": [
          {
            "title": ":mailbox_with_mail: - Nouveau Message",
            "color": 8721685,
            "fields": [
              {
                "name": ":bust_in_silhouette: - From :",
                "value": prof
              },
              {
                "name": ":calendar: - Date :",
                "value": date
              },
              {
                "name": ":notepad_spiral: - Sujet :",
                "value": titre
              },
              {
                "name": ":pencil2: - Message",
                "value": content
              }
            ],
            "footer": {
              "text": "Crée par Théo Posty (avec l'aide de Yannis Teissier)",
              "icon_url": "https://cdn.discordapp.com/avatars/290152300163629056/362c0fff66338b17db6acba42a01d018.png"
            }
          }
        ]
    })
    hook.fire().then(response => {
    }).catch(err=> {
        throw err;
    })
}
function sendHomeworks(dateDebut,dateFin,matiere,message,files) {
    hook.login(webhook.id, webhook.token)
    hook.setPayload({
        "content": files,
        "username": "WEBHOOK - PRONOTE",
        "avatar_url":"https://clg-triolet.monbureaunumerique.fr/lectureFichiergw.do?ID_FICHIER=1042",
        "embeds": [
          {
            "title": ":mailbox_with_mail: - Nouveaux Devoirs",
            "color": 8721685,
            "fields": [
              {
                "name": ":briefcase: - Matière :",
                "value": matiere
              },
              {
                "name": ":calendar: - Dates :",
                "value": `Le ${dateDebut} pour le ${dateFin}`
              },
              {
                "name": ":pencil2: - Message",
                "value": message
              }
            ],
            "footer": {
              "text": "Crée par Yannis Teissier (avec l'aide de Théo Posty)",
              "icon_url": "https://cdn.discordapp.com/avatars/258674177848901645/c7d46bdba52d0834a389f3e05cce1cc4.png"
            }
          }
        ]
      })
    hook.fire().then(response => {
    }).catch(err=> {
        throw err;
    })
}

let jsonObject = require("./credentials.json")

let nbMessages = 10;
setInterval(() => {
    cache = require('./cache.json')
    request({
        url: "http://127.0.0.1:21727/",
        method: "POST",
        json: true,   // <--Very important!!!
        body: jsonObject
    }, function (error, response, body){    
        if(error){
            console.log(error)
        }
        if(body){
            if(init == false){
                console.log(`[${jourLaunch}/${moisLaunch} - ${heureLaunch}:${minLaunch}] ---> Pronote API HTTP Client Listening on 127.0.0.1:21727`)
                init=true;
            }
            let l = nbMessages-1;
            
            let intervalleDevoirs = setInterval(() => {
                if(body["homeworks"]){
                    if(body["homeworks"][l]){
                        let dateDebut, dateFin, jourDebut, jourFin;
                        let matiere;
                        let message, files = "";
                        let id;
                        let mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
                        if(body["homeworks"][l]['since']){
                            dateDebut = new Date(body["homeworks"][l]['since']+7200000)
                            jourDebut = dateDebut.getDate();
                            if(jourDebut<10){
                                jourDebut="0"+jourDebut.toString()
                            }
                            dateDebut = jourDebut + " " + mois[dateDebut.getMonth()]
                        }
                        if(body["homeworks"][l]['until']){
                            dateFin = new Date(body["homeworks"][l]['until']+7200000)
                            jourFin = dateFin.getDate();
                            if(jourFin<10){
                                jourFin="0"+jourFin.toString()
                            }
                            dateFin = jourFin+" "+mois[dateFin.getMonth()]
                        }
                        if(body["homeworks"][l]["subject"]){
                            matiere = body["homeworks"][l]["subject"]
                        }
                        if(body['homeworks'][l]['content']){
                            message = body["homeworks"][l]["content"].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, '').trim()
                        } else {
                            message = ""
                        }
                        if(body['homeworks'][l]['files']){
                            for(let j = 0; j < body['homeworks'][l]['files'].length; j++){
                                files += body['homeworks'][l]['files'][j]['url']+"\n"
                            }
                        } else {
                            files = "";
                        }
                        if(matiere && message){
                            id = Buffer.from(matiere).toString('base64') + Buffer.from(message).toString('base64')
                        }
                        if(id){
                            if(!cache["lastHomeworks"].includes(id)){
                                if(cache["lastHomeworks"].length>=nbMessages){
                                    cache["lastHomeworks"].shift();
                                }
                                sendHomeworks(dateDebut,dateFin,matiere,message,files)
                                cache["lastHomeworks"].push(id)
                            }
                        }
                    }
                }
                l--;
                if(l==-1){
                    clearInterval(intervalleDevoirs);
                }
            }, 5000);
            
            let i = nbMessages-1;
            let intervalleMessages = setInterval(() => {
                if(body["infos"] && body["infos"][i]){
                    let messageUnix = body["infos"][i]['time']
                    let dateObj = new Date(messageUnix*1000);
                    let date = dateObj.toUTCString();
                    let titre;
                    let id;
                    if(body['infos'][i]['title']){
                        titre = body['infos'][i]['title'];
                    } else {
                        titre = "Sans titre"
                    }
                    let prof = body['infos'][i]['teacher'];
                    let files = "";
                    if(body['infos'][i]['files']){
                        for(let j = 0; j < body['infos'][i]['files'].length; j++){
                            files += body['infos'][i]['files'][j]+"\n"
                        }
                    } else {
                        files = "";
                    }
                    let content=""
                    if(body['infos'][i]['content']){
                        content = body['infos'][i]['content'].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, '').trim()
                    } else {
                        content=""
                    }
                    if(prof && content){
                        id = Buffer.from(prof).toString('base64') + Buffer.from(content).toString('base64')
                    }
                    if(id){
                        if(!cache["lastMessages"].includes(id)){
                            if(cache["lastMessages"].length>=nbMessages){
                                cache["lastMessages"].shift();
                            }
                            sendMessage(date,titre,prof,content,files)
                            cache["lastMessages"].push(id)
                        }
                    }
                }
                i--;
                if(i==-1){
                    clearInterval(intervalleMessages);
                }
            }, 5000);
        }
    });
    let json = JSON.stringify(cache)
    fs.writeFile('./cache.json', json, function (err) {
        if (err) throw err;
    })
}, time);
