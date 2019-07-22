"use strict";

const NodeSDK = require("rainbow-node-sdk");
const logger = require('./logger');
const parser = require('./parser');

const LOG_ID = "STARTER/SDKN - ";

class SDK {
    
    constructor() {
        logger.log("debug", LOG_ID + "constructor()");
        this.nodeSDK = null;
    }

    start(bot, argv) {
        return new Promise((resolve) => {

            if(argv.length >= 4) {
                bot.credentials.login = argv[2];
                bot.credentials.password = argv[3];
                logger.log("info", LOG_ID + "using " + bot.credentials.login  + " (forced by CLI)");
            }

             // Start the SDK
            this.nodeSDK = new NodeSDK(bot);

            // add listeners to rainbow events
            this.listenToMessageReceived();
            this.listenToCallUpdate();

            this.nodeSDK.start().then(() => {
                logger.log("debug", LOG_ID + "SDK started");
                resolve();
            });
        });
    }

    restart() {
        return new Promise((resolve, reject) => {
            this.nodeSDK.events.once('rainbow_onstopped', (data) => {
                logger.log("debug", LOG_ID + "SDK - rainbow_onstopped - rainbow event received. data", data);

                logger.log("debug",  LOG_ID + "SDK - rainbow_onstopped rainbow SDK will re start");
                this.nodeSDK.start().then(() => {
                    resolve();
                });
            });

            this.nodeSDK.stop();
            /*this.nodeSDK.stop().then(() => {
                logger.log("debug", LOG_ID + "SDK stopped");
                return this.nodeSDK.start();
            }).then(() => {
                logger.log("debug", LOG_ID + "SDK started");
                resolve();
            }).catch((err) => {
                reject(err);
            }); // */
        });
    }

    get state() {
        return this.nodeSDK.state;
    }

    get version() {
        return this.nodeSDK.version;
    }

    get sdk() {
        return this.nodeSDK;
    }

    /* Listeners */

    listenToMessageReceived(){
        this.nodeSDK.events.on('rainbow_onmessagereceived', (message) => {
            // send manually a 'read' receipt to the sender
            this.nodeSDK.im.markMessageAsRead(message);

            // send an answer
            if(message.type === "chat") {
                this.nodeSDK.im.sendMessageToJid("ok", message.fromJid);
            } else if (message.type === "groupchat") {
                this.nodeSDK.im.sendMessageToBubbleJid("ok", message.fromBubbleJid);
            }
        });
    }

    listenToCallUpdate(){
        this.nodeSDK.events.on("rainbow_oncallupdated", call => {
            try {
                //this._logger.log("debug", LOG_ID + "Event rainbow_oncallupdated" + JSON.stringify(call, null, 4));
                logger.log("debug", LOG_ID + "Event rainbow_oncallupdated" + parser.serialize(call));
            } catch (error) {
                //this._logger.log("debug", LOG_ID + "Event rainbow_oncallupdated" + JSON.stringify(call.currentCalled, null, 4));
            }
        });
    }

    /* Methods */
    getContactByEmail(email){
        let that = this;
        
        return new Promise((resolve, receipt) => {
            that.nodeSDK.contacts.getContactByLoginEmail(email).then(contact => {
                resolve(contact);
            }).catch(err => {
                receipt(err);
            });
        });
    }

    makeCall(email, phone){
        let that = this;

        return new Promise((resolve, reject) => {
            that.getContactByEmail(email).then(contact => {
                //that._nodeSDK.telephony.makeCall(contact, contact.phonePbx).then(call => {
                var phoneNumber = (phone ? phone : contact.phonePbx)
                that.nodeSDK.telephony.makeCall(contact, phoneNumber).then(call => {
                    resolve(call);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    makeCallPhoneNumber(phoneNumber){
        let that = this;
        
        return new Promise((resolve, reject) => {
            that.nodeSDK.telephony.makeCallByPhoneNumber(phoneNumber).then(call => {
                resolve(call);
            }).catch(err => {
                reject(err);
            });
        });
    }

}

module.exports = new SDK();
