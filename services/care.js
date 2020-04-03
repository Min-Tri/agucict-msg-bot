

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
        response = Response.genQuickReply(
          i18n.__("care.prompt", {
            userFirstName: this.user.firstName
          }),
          [
            {
              title: i18n.__("care.order"),
              payload: "CARE_ORDER"
            },
            {
              title: i18n.__("care.billing"),
              payload: "CARE_BILLING"
            },
            {
              title: i18n.__("care.other"),
              payload: "CARE_OTHER"
            }
          ]
        );
        break;
      case "CARE_ORDER":
        // Send using the Persona for order issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaHelp.name,
              topic: i18n.__("care.order")
            }),
            config.personaHelp.id
          ),
          Survey.genAgentRating(config.personaHelp.name)
        ];
        break;

      case "CARE_BILLING":
        // Send using the Persona for billing issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaHelp.name,
              topic: i18n.__("care.billing")
            }),            
            config.personaHelp.id
          ),          
          Survey.genAgentRating(config.personaHelp.name)
        ];
        break;

      case "CARE_SALES":
        // Send using the Persona for sales questions

        response = [
          Response.genTextWithPersona(
            i18n.__("care.style", {
              userFirstName: this.user.firstName,              
              agentFirstName: config.personaHelp.name
            }),            
            config.personaHelp.id
          ),          
          Survey.genAgentRating(config.personaHelp.name)
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
          Survey.genAgentRating(config.personaHelp.name)
        ];
        break;
    }

    return response;
  }
};
