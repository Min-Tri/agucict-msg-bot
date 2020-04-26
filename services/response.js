

"use strict";

const i18n = require("../i18n.config");

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genGenericTemplateLink(image_url, title, subtitle, url, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              default_action: {
                type: "web_url",
                url: url,
                // messenger_extensions: true,
                // webview_height_ratio: "FULL"
              },
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genGenericTemplateLinkLoopWithPersona(eles, persona_id) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: []
        }
      },
      persona_id: persona_id
    };
    for (let ele of eles) {
      response.attachment.payload["elements"].push({
        title: ele["title"],
        subtitle: ele["subtitle"],
        // image_url: ele["image_url"],
        default_action: {
          type: "web_url",
          url: ele["url"]
        },
        // buttons: ele["buttons"]
      });
    }
    return response;
  }

  static genListWithPersona(buttons, eles, persona_id) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "list",//error:"list" can't work, fix this shit
          // top_element_style: "compact",
          elements: [],
          buttons: buttons
        }
      },  
      persona_id: persona_id
    };

    for (let ele of eles) {
      response.attachment.payload["elements"].push({
        title: ele["title"],
        subtitle: ele["subtitle"],
        // image_url: ele["image_url"],
        default_action: {
          type: "web_url",
          url: ele["url"]
        },
        buttons: ele["buttons"]
      });
    }

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genQuickReplyWithPersona(text, quickReplies,persona_id) {
    let response = {
      text: text,
      quick_replies: [],
      persona_id: persona_id
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      // messenger_extensions: true
    };

    return response;
  }

  static genNuxMessage(user) {
    let welcome = this.genText(
      i18n.__("get_started.welcome", {
        userFirstName: user.firstName
      })
    );

    let guide = this.genText(i18n.__("get_started.guidance"));

    let curation = this.genQuickReply(i18n.__("get_started.help"), [
      {
        title: i18n.__("menu.educate"),
        payload: "CURATION"
      },
      {
        title: i18n.__("menu.register"),        
        payload: "LINK_ORDER"        
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      }
    ]);

    return [welcome, guide, curation];
  }
};
