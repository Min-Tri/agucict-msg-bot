

"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  temp = `${config.mainUrl}`,
  i18n = require("../i18n.config");

module.exports = class Curation {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {

      case "CURATION":
        response = Response.genQuickReplyWithPersona(i18n.__("curation.prompt"), [
          {
            title: i18n.__("curation.longtime"),
            payload: "CURATION_LONG_TIME"
          },
          {
            title: i18n.__("curation.shorttime"),
            payload: "CURATION_SHORT_TIME"
          },
          {
            title: i18n.__("curation.forkid"),
            payload: "CURATION_FOR_KID"
          }],
          config.personaHelp.id
        );
        break;

      case "CURATION_SHORT_TIME":
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
              title: i18n.__("curation.basic"),
              payload: "CURATION_BASIC"
            },
            {
              title: i18n.__("curation.refesher"),
              payload: "CURATION_REFESHER"
            },
            {
              title: i18n.__("curation.advanced"),
              payload: "CURATION_ADVANCED"
            }
          ],config.personaHelp.id)
        ];
        break;

      case "CURATION_BASIC":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona(
        // response = [Response.genListWithPersona(
          // Response.genWebUrlButton(
          //   i18n.__("menu.register"),
          //   `${temp}/dangkyhoc.cict`
          // ),
            [{
              title: i18n.__("subject.basic.title"),
              subtitle: i18n.__("subject.basic.subtitle"),
              url: `${temp}/${i18n.__("subject.basic.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.basic.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.basic1.title"),
              subtitle: i18n.__("subject.basic1.subtitle"),
              url: `${temp}/${i18n.__("subject.basic.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.basic.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.basic2.title"),
              subtitle: i18n.__("subject.basic2.subtitle"),
              url: `${temp}/${i18n.__("subject.basic.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.basic.suburl")}`
              // )
            }
          ],config.personaHelp.id
        )];
        break;

      case "CURATION_ADVANCED":
      response = [
        Response.genGenericTemplateLinkLoopWithPersona(
        // response = [Response.genListWithPersona(
          // Response.genWebUrlButton(
          //   i18n.__("menu.register"),
          //   `${config.mainUrl}/dangkyhoc.cict`
          // ),
            [{
              title: i18n.__("subject.advanced.title"),
              subtitle: i18n.__("subject.advanced.subtitle"),
              url: `${temp}/${i18n.__("subject.advanced.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.advanced.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.advanced1.title"),
              subtitle: i18n.__("subject.advanced1.subtitle"),
              url: `${temp}/${i18n.__("subject.advanced.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.advanced.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.advanced2.title"),
              subtitle: i18n.__("subject.advanced2.subtitle"),
              url: `${temp}/${i18n.__("subject.advanced.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.advanced.suburl")}`
              // )
            },
            {
              title: i18n.__("subject.advanced3.title"),
              subtitle: i18n.__("subject.advanced3.subtitle"),
              url: `${temp}/${i18n.__("subject.advanced.suburl")}`
              // buttons: Response.genWebUrlButton(
              //   i18n.__("curation.detail"),
              //   `${temp}/${i18n.__("subject.advanced.suburl")}`
              // )
            }
          ],config.personaHelp.id
        )];
        break;

      case "CURATION_REFESHER":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.refesher.title"),
              subtitle: i18n.__("subject.refesher.subtitle"),
              url: `${temp}/${i18n.__("subject.refesher.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_RFADVANCED":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.rfadvanced.title"),
              subtitle: i18n.__("subject.rfadvanced.subtitle"),
              url: `${temp}/${i18n.__("subject.rfadvanced.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_NETMANAGEMENT":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.netmanagement.title"),
              subtitle: i18n.__("subject.netmanagement.subtitle"),
              url: `${temp}/${i18n.__("subject.netmanagement.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_PCSETUP":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.pcsetup.title"),
              subtitle: i18n.__("subject.pcsetup.subtitle"),
              url: `${temp}/${i18n.__("subject.pcsetup.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_PCASSEMBLY":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.pcassembly.title"),
              subtitle: i18n.__("subject.pcassembly.subtitle"),
              url: `${temp}/${i18n.__("subject.pcassembly.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_WEBDESIGN":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.webdesign.title"),
              subtitle: i18n.__("subject.webdesign.subtitle"),
              url: `${temp}/${i18n.__("subject.webdesign.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_WEBPROGRAMING":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.webprograming.title"),
              subtitle: i18n.__("subject.webprograming.subtitle"),
              url: `${temp}/${i18n.__("subject.webprograming.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_THESISTECH":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.thesistech.title"),
              subtitle: i18n.__("subject.thesistech.subtitle"),
              url: `${temp}/${i18n.__("subject.thesistech.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_ELECLESSON":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.eleclesson.title"),
              subtitle: i18n.__("subject.eleclesson.subtitle"),
              url: `${temp}/${i18n.__("subject.eleclesson.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_PHOTOSHOP":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.photoshop.title"),
              subtitle: i18n.__("subject.photoshop.subtitle"),
              url: `${temp}/${i18n.__("subject.photoshop.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_ANDROID":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.android.title"),
              subtitle: i18n.__("subject.android.subtitle"),
              url: `${temp}/${i18n.__("subject.android.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_SEO":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.seo.title"),
              subtitle: i18n.__("subject.seo.subtitle"),
              url: `${temp}/${i18n.__("subject.seo.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_PCFORCHILD1":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.pcforchild1.title"),
              subtitle: i18n.__("subject.pcforchild1.subtitle"),
              url: `${temp}/${i18n.__("subject.pcforchild1.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_PCFORCHILD2":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.pcforchild2.title"),
              subtitle: i18n.__("subject.pcforchild2.subtitle"),
              url: `${temp}/${i18n.__("subject.pcforchild2.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_CREATIVEPROGRAMING":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.creativeprograming.title"),
              subtitle: i18n.__("subject.creativeprograming.subtitle"),
              url: `${temp}/${i18n.__("subject.creativeprograming.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break;
      case "CURATION_FOR_KID":
        response = [
          Response.genGenericTemplateLinkLoopWithPersona([
            {
              title: i18n.__("subject.pcforchild1.title"),
              subtitle: i18n.__("subject.pcforchild1.subtitle"),
              url: `${temp}/${i18n.__("subject.pcforchild1.suburl")}`
            },
            {
              title: i18n.__("subject.pcforchild2.title"),
              subtitle: i18n.__("subject.pcforchild2.subtitle"),
              url: `${temp}/${i18n.__("subject.pcforchild2.suburl")}`
            },
            {
              title: i18n.__("subject.creativeprograming.title"),
              subtitle: i18n.__("subject.creativeprograming.subtitle"),
              url: `${temp}/${i18n.__("subject.creativeprograming.suburl")}`
            }
          ],config.personaHelp.id
        )];
        break; 
      case "CURATION_REEXAM":
        response =[
          Response.genTextWithPersona(
            i18n.__("order.reexam.rule"),
            config.personaHelp.id
          ),
          Response.genTextWithPersona(
            i18n.__("order.reexam.plaplarule"),
            config.personaHelp.id
          )
        ];
        break;
    } 
    return response;
  }
};
