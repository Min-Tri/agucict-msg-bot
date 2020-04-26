

"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Curation {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;
    let outfit;
    let temp;

    switch (payload) {
      // case "SUMMER_COUPON":
      //   response = [
      //     Response.genText(
      //       i18n.__("leadgen.promo", {
      //         userFirstName: this.user.firstName
      //       })
      //     ),
      //     Response.genGenericTemplate(
      //       `${config.appUrl}/coupon.png`,
      //       i18n.__("leadgen.title"),
      //       i18n.__("leadgen.subtitle"),
      //       [Response.genPostbackButton(i18n.__("leadgen.apply"), "COUPON_50")]
      //     )
      //   ];
      //   break;

      // case "COUPON_50":
      //   outfit = `${this.user.gender}-${this.randomOutfit()}`;

      //   response = [
      //     Response.genText(i18n.__("leadgen.coupon")),
      //     Response.genGenericTemplate(
      //       `${config.appUrl}/styles/${outfit}.jpg`,
      //       i18n.__("curation.title"),
      //       i18n.__("curation.subtitle"),
      //       [
      //         Response.genWebUrlButton(
      //           i18n.__("curation.shop"),
      //           `${config.shopUrl}/products/${outfit}`
      //         ),
      //         Response.genPostbackButton(
      //           i18n.__("curation.show"),
      //           "CURATION_OTHER_STYLE"
      //         ),
      //         Response.genPostbackButton(
      //           i18n.__("curation.sales"),
      //           "CARE_SALES"
      //         )
      //       ]
      //     )
      //   ];
      //   break;

      case "CURATION":
        response = Response.genQuickReplyWithPersona(i18n.__("curation.prompt"), [
          {
            title: i18n.__("curation.longtime"),
            payload: "CURATION_LONG_TIME"
          },
          {
            title: i18n.__("curation.shorttime"),
            payload: "CURATION_SHORT_TIME"
          }],
          config.personaHelp.id
        );
        break;

      case "CURATION_SHORT_TIME":
        temp =`${config.mainUrl}`;
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.netmanagement.title"),
              subtitle: i18n.__("subject.netmanagement.subtitle"),
              url: `${temp}/${i18n.__("subject.netmanagement.suburl")}`
            },
            {
              title: i18n.__("subject.pcsetup.title"),
              subtitle: i18n.__("subject.pcsetup.subtitle"),
              url: `${temp}/${i18n.__("subject.pcsetup.suburl")}`
            },
            {
              title: i18n.__("subject.pcassembly.title"),
              subtitle: i18n.__("subject.pcassembly.subtitle"),
              url: `${temp}/${i18n.__("subject.pcassembly.suburl")}`
            },
            {
              title: i18n.__("subject.webdesign.title"),
              subtitle: i18n.__("subject.webdesign.subtitle"),
              url: `${temp}/${i18n.__("subject.webdesign.suburl")}`
            },
            {
              title: i18n.__("subject.webprograming.title"),
              subtitle: i18n.__("subject.webprograming.subtitle"),
              url: `${temp}/${i18n.__("subject.webprograming.suburl")}`
            },
            {
              title: i18n.__("subject.thesistech.title"),
              subtitle: i18n.__("subject.thesistech.subtitle"),
              url: `${temp}/${i18n.__("subject.thesistech.suburl")}`
            },
            {
              title: i18n.__("subject.eleclesson.title"),
              subtitle: i18n.__("subject.eleclesson.subtitle"),
              url: `${temp}/${i18n.__("subject.eleclesson.suburl")}`
            },
            {
              title: i18n.__("subject.photoshop.title"),
              subtitle: i18n.__("subject.photoshop.subtitle"),
              url: `${temp}/${i18n.__("subject.photoshop.suburl")}`
            },
            {
              title: i18n.__("subject.android.title"),
              subtitle: i18n.__("subject.android.subtitle"),
              url: `${temp}/${i18n.__("subject.android.suburl")}`
            },
            {
              title: i18n.__("subject.seo.title"),
              subtitle: i18n.__("subject.seo.subtitle"),
              url: `${temp}/${i18n.__("subject.seo.suburl")}`
            }
          ],
          config.personaHelp.id
          )
          // Response.genTextWithPersona(i18n.__("get_started.guidance"),config.personaHelp.id),
          // Response.genQuickReplyWithPersona(i18n.__("get_started.help"), [
          //   {
          //     title: i18n.__("menu.educate"),
          //     payload: "CURATION"
          //   },
          //   {
          //     title: i18n.__("menu.register"),        
          //     payload: "LINK_ORDER"        
          //   },
          //   {
          //     title: i18n.__("menu.help"),
          //     payload: "CARE_HELP"
          //   }
          // ],
          // config.personaHelp.id
          // )          
        ];
        break;
      case "CURATION_LONG_TIME":
        response = [
          Response.genTextWithPersona(
            i18n.__("curation.subject"),
            config.personaHelp.id
          ),
          Response.genTextWithPersona(
            i18n.__("curation.plapla"),
            config.personaHelp.id
          ),
          Response.genQuickReplyWithPersona(i18n.__("curation.show"), [
            {
              title: i18n.__("curation.normal"),
              payload: "CURATION_NORMAL"
            },
            {
              title: i18n.__("curation.train"),
              payload: "CURATION_TRAIN"
            },
            {
              title: i18n.__("curation.hard"),
              payload: "CURATION_HARD"
            }
          ],config.personaHelp.id)
        ];
        break;

      case "CURATION_NORMAL":
        temp =`${config.mainUrl}`;
        response = [Response.genGenericTemplateLinkLoopWithPersona(
        // response = [Response.genListWithPersona(
          // Response.genWebUrlButton(
          //   i18n.__("menu.register"),
          //   `${temp}/dangkyhoc.cict`
          // ),
            [{
              title: i18n.__("subject.normal.title"),
              subtitle: i18n.__("subject.normal.subtitle"),
              url: `${temp}/${i18n.__("subject.normal.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.normal.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.normal1.title"),
              subtitle: i18n.__("subject.normal1.subtitle"),
              url: `${temp}/${i18n.__("subject.normal.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.normal.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.normal2.title"),
              subtitle: i18n.__("subject.normal2.subtitle"),
              url: `${temp}/${i18n.__("subject.normal.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.normal.suburl")}`
              // )
            }
          ],config.personaHelp.id
        )];
        break;

        case "CURATION_HARD":
          temp =`${config.mainUrl}`;
        response = [Response.genGenericTemplateLinkLoopWithPersona(
          // response = [Response.genListWithPersona(
            // Response.genWebUrlButton(
            //   i18n.__("menu.register"),
            //   `${config.mainUrl}/dangkyhoc.cict`
            // ),
              [{
                title: i18n.__("subject.hard.title"),
                subtitle: i18n.__("subject.hard.subtitle"),
                url: `${temp}/${i18n.__("subject.hard.suburl")}`
                // buttons: Response.genWebUrlButton(
                //   i18n.__("curation.detail"),
                //   `${temp}/${i18n.__("subject.hard.suburl")}`
                // )
              },
              {
                title: i18n.__("subject.hard1.title"),
                subtitle: i18n.__("subject.hard1.subtitle"),
                url: `${temp}/${i18n.__("subject.hard.suburl")}`
                // buttons: Response.genWebUrlButton(
                //   i18n.__("curation.detail"),
                //   `${temp}/${i18n.__("subject.hard.suburl")}`
                // )
              },
              {
                title: i18n.__("subject.hard2.title"),
                subtitle: i18n.__("subject.hard2.subtitle"),
                url: `${temp}/${i18n.__("subject.hard.suburl")}`
                // buttons: Response.genWebUrlButton(
                //   i18n.__("curation.detail"),
                //   `${temp}/${i18n.__("subject.hard.suburl")}`
                // )
              },
              {
                title: i18n.__("subject.hard3.title"),
                subtitle: i18n.__("subject.hard3.subtitle"),
                url: `${temp}/${i18n.__("subject.hard.suburl")}`
                // buttons: Response.genWebUrlButton(
                //   i18n.__("curation.detail"),
                //   `${temp}/${i18n.__("subject.hard.suburl")}`
                // )
              }
            ],config.personaHelp.id
          )];
          break;

        case "CURATION_TRAIN":
          temp =`${config.mainUrl}`;
          response = [
            Response.genGenericTemplateLinkLoopWithPersona([
              {
                title: i18n.__("subject.train.title"),
                subtitle: i18n.__("subject.train.subtitle"),
                url: `${temp}/${i18n.__("subject.train.suburl")}`
              }
            ],config.personaHelp.id
          )];
          break;
      //   response = this.genCurationResponse(payload);
      //   break;

      // case "CURATION_OTHER_STYLE":
      //   // Build the recommendation logic here
      //   outfit = `${this.user.gender}-${this.randomOutfit()}`;

      //   response = Response.genGenericTemplate(
      //     `${config.appUrl}/styles/${outfit}.jpg`,
      //     i18n.__("curation.title"),
      //     i18n.__("curation.subtitle"),
      //     [
      //       Response.genWebUrlButton(
      //         i18n.__("curation.shop"),
      //         `${config.shopUrl}/products/${outfit}`
      //       ),
      //       Response.genPostbackButton(
      //         i18n.__("curation.show"),
      //         "CURATION_OTHER_STYLE"
      //       )
      //     ]
      //   );
      //   break;
    }
    
    return response;
  }

  // genCurationResponse(payload) {
  //   let occasion = payload.split("_")[3].toLowerCase();
  //   let budget = payload.split("_")[2].toLowerCase();
  //   let outfit = `${this.user.gender}-${occasion}`;

  //   let buttons = [
  //     Response.genWebUrlButton(
  //       i18n.__("curation.shop"),
  //       `${config.shopUrl}/products/${outfit}`
  //     ),
  //     Response.genPostbackButton(
  //       i18n.__("curation.show"),
  //       "CURATION_OTHER_STYLE"
  //     )
  //   ];

  //   if (budget === "50") {
  //     buttons.push(
  //       Response.genPostbackButton(i18n.__("curation.sales"), "CARE_SALES")
  //     );
  //   }

  //   let response = Response.genGenericTemplate(
  //     // `${config.appsUrl}/styles/${outfit}.jpg`,
  //     i18n.__("curation.title"),
  //     i18n.__("curation.subtitle"),
  //     buttons
  //   );

  //   return response;
  // }

  // randomOutfit() {
  //   let occasion = ["work", "party", "dinner"];
  //   let randomIndex = Math.floor(Math.random() * occasion.length);

  //   return occasion[randomIndex];
  // }
};
