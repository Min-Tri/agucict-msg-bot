

"use strict";

// Imports dependencies
const Response = require("./response"),
  Survey = require("./survey"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Care {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "CARE_HELP":
        response = Response.genQuickReplyWithPersona(
          i18n.__("care.prompt", {
            userFirstName: this.user.firstName
          }),
          [
            {
              title: i18n.__("care.study"),
              payload: "CARE_STUDY"
            },
            {
              title: i18n.__("care.tech"),
              payload: "CARE_TECH"
            },
            {
              title: i18n.__("care.examine"),
              payload: "CARE_EXAMINE"
            },
            {
              title: i18n.__("care.other"),
              payload: "CARE_OTHER"
            }
          ],
          config.personaHelp.id
        );
        break;
      case "CARE_STUDY":
        // Send using the Persona for study issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaHelp.name,
              topic: i18n.__("care.study")
            }),
            config.personaHelp.id
          ),
          // Survey.genAgentRating(config.personaHelp.name)
        ];
        break;

      case "CARE_TECH":
        // Send using the Persona for tech issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaHelp.name,
              topic: i18n.__("care.tech")
            }),            
            config.personaHelp.id
          ),
          // Response.genQuickReplyWithPersona(i18n.__("care.plapla"), [
          //   {
          //     title: i18n.__(`questions.q${i}`),
          //     payload: ""
          //   },
          //   {
          //     title: i18n.__(`questions.q${i}`),
          //     payload: ""
          //   }],
          //   config.personaHelp.id
          // ),          
          // Survey.genAgentRating(config.personaHelp.name)
        ];
        break;

      case "CARE_EXAMINE":
        // Send using the Persona for M questions

        response = [
          Response.genTextWithPersona(
            i18n.__("care.consider", {
              userFirstName: this.user.firstName,              
              agentFirstName: config.personaHelp.name
            }),            
            config.personaHelp.id
          ),
          Response.genTextWithPersona(
            i18n.__("answers.a264", {
              userFirstName: this.user.firstName,              
              agentFirstName: config.personaHelp.name
            }),            
            config.personaHelp.id
          ),          
          // Survey.genAgentRating(config.personaHelp.name)
        ];
        break;

      case "CARE_OTHER":
        // Send using the Persona for customer care issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.default", {
              userFirstName: this.user.firstName,              
              agentFirstName: config.personaHelp.name,
            }),            
            config.personaHelp.id
          ),          
          // Survey.genAgentRating(config.personaHelp.name)
        ];
        break;
    }

    return response;
  }
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
};
