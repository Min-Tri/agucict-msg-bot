

"use strict";

const Curation = require("./curation"),
  Order = require("./order"),
  Response = require("./response"),
  Care = require("./care"),
  Survey = require("./survey"),
  GraphAPi = require("./graph-api"),
  config = require("./config"),
  i18n = require("../i18n.config"),
  {interactive} = require('node-wit'),
  wit = require("node-wit").Wit;

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          this.handleTestMessage()
          .then((responses)=>{
            if (Array.isArray(responses)) {
              let delay = 0;
              for (let response of responses) {
                this.sendMessage(response, delay * 2000);
                delay++;
              }
            } else {
              this.sendMessage(responses);
            }
          })
          .catch(error=>{console.log("test error:", error)});
          // responses = this.handleTestMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    let client = new wit({ accessToken : config.witToken});

    // check greeting is here and is confident
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");
       
    let message = this.webhookEvent.message.text.trim().toLowerCase();

    // let learn = this.firstEntity(this.webhookEvent.message.nlp, "greeting");
    
    let response;
    // client.message(message, {})
    // .then((data) => {
    //     console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
    // })
    // .then(({entities}) => {
    //   console.log(entities);
    // })
    // .catch(console.error);
    // interactive(client);
    const welcome = this.test(client,message,"greeting");
    console.log(welcome);
    // let help = this.test(client,message,"help").then(res =>(res&&res.confidence>0.8));

    if (
      (greeting && greeting.confidence > 0.8) ||
       message.includes("start over") 
    ) {
      response = Response.genNuxMessage(this.user);
    } else if(Number(message)){
      response = Order.handlePayload("ORDER_NUMBER");
    } else if (message.includes("#")) {
      response = Survey.handlePayload("CSAT_SUGGESTION");
    } else if ((message.includes(i18n.__("care.help").toLowerCase()))) {
      let care = new Care(this.user, this.webhookEvent);
      response = care.handlePayload("CARE_HELP");
    } else {
      response = [
        Response.genText(
          i18n.__("fallback.any", {
            message: this.webhookEvent.message.text
          })
        ),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
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
        ])
      ];
    }

    return response;
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

    response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);

    let response;

    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (payload.includes("CURATION") || payload.includes("COUPON")) {
      let curation = new Curation(this.user, this.webhookEvent);
      response = curation.handlePayload(payload);
    } else if (payload.includes("CARE")) {
      let care = new Care(this.user, this.webhookEvent);
      response = care.handlePayload(payload);
    } else if (payload.includes("ORDER")) {
      response = Order.handlePayload(payload);
    } else if (payload.includes("CSAT")) {
      response = Survey.handlePayload(payload);
    } else if (payload.includes("CHAT-PLUGIN")) {
      response = [
        Response.genText(i18n.__("chat_plugin.prompt")),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("care.study"),
            payload: "CARE_STUDY"
          },
          {
            title: i18n.__("care.tech"),
            payload: "CARE_TECH"
          },
          {
            title: i18n.__("care.other"),
            payload: "CARE_OTHER"
          }
        ])
      ];
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type,object_id) {
    let welcomeMessage = i18n.__("get_started.welcome") + " " +
      i18n.__("get_started.guidance") + ". " +
      i18n.__("get_started.help");

    let response =[ 
      Response.genQuickReply(welcomeMessage, [
        // {
        //   title: i18n.__("menu.suggestion"),
        //   payload: "CURATION"
        // },
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
      ])
    ];

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
  firstEntityValue(entities, entity){
    const val= entities && entities[entity] &&
      Array.isArray(entities[entity]) &&
      entities[entity].length > 0 &&
      entities[entity][0].value;
      if(!val)
        return null;  
      return val;
  }
  async test(client,message,entity){
    let res;
    try{
      res= await client.message(message,{});
      // console.log("async here: "+JSON.stringify(res));
      res= this.firstEntity(res,entity);
      // console.log(res);
      res= (res&&res.confidence>0.8);
    }catch(error){
      console.error(error);
      res= false;
    }
    console.log(res);
    return res;
    // .then((data) => {
    //   let res= this.firstEntity(data,entity);
    //   // console.log(res.confidence);
    //   return (res&&(res.confidence>0.8));
    // })
    // .catch((error)=>{
    //   console.error(error);
    //   return false;
    // });
  }
  newtest(res,entity){
    try{
      res= this.firstEntity(res,entity);
      return res&&res.confidence>0.8;
    }catch(error){
      console.error(error);
      return false;
    }
  }
  isSubject(valsubject){
    let response;
    let curation = new Curation(this.user, this.webhookEvent);
    switch(valsubject){
      case "Lớp chuyên đề":
        response = curation.handlePayload("CURATION_SHORT_TIME");
        break;
      case "Ôn luyện CNTT cơ bản":
        response = curation.handlePayload("CURATION_REFESHER");
        break;
      case "Ôn luyện CNTT nâng cao":
        response = curation.handlePayload("CURATION_RFADVANCED");
        break;
      case "CNTT cơ bản":
        response = curation.handlePayload("CURATION_BASIC");
        break;
      case "CNTT nâng cao":
        response = [
          curation.handlePayload("CURATION_ADVANCED"),
          Response.genTextWithPersona(
            i18.__("subject.advanced.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "tin học cho trẻ":
        response =[
          Response.genQuickReplyWithPersona(
            i18n.__("order.case.forkid"),
            [
              {
                title: i18n.__("subject.pcforchild1.title"),
                payload: "CURATION_PCFORCHILD1"
              },
              {
                title: i18n.__("order.pcforchild2.title"),
                payload: "CURATION_PCFORCHILD2"
              }
            ],
            config.personaHelp.id
          )
        ];
        break;
      case "lớp ôn luyện":
        response =[
          Response.genQuickReplyWithPersona(
            i18n.__("order.case.refesher"),
            [
              {
                title: i18n.__("order.case.refesherbasic"),
                payload: "CURATION_REFESHER"
              },
              {
                title: i18n.__("order.case.refesheradvance"),
                payload: "CURATION_RFADVANCED"
              }
            ],
            config.personaHelp.id
          )
        ];
        break;
      case "Lập trình sáng tạo":
        response = [
          curation.handlePayload("CURATION_CREATIVEPROGRAM"),
          Response.genTextWithPersona(
            i18.__("subject.creativeprograming.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Tin học trẻ em - Cấp độ 2":
        response = [
          curation.handlePayload("CURATION_PCFORCHILD2"),
          Response.genTextWithPersona(
            i18.__("subject.pcforchild2.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Tin học trẻ em - Cấp độ 1":
        response = [
          curation.handlePayload("CURATION_PCFORCHILD1"),
          Response.genTextWithPersona(
            i18.__("subject.pcforchild1.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "SEO":
        response = [
          curation.handlePayload("CURATION_SEO"),
          Response.genTextWithPersona(
            i18.__("subject.seo.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Lập trình android":
        response = [
          curation.handlePayload("CURATION_ANDROID"),
          Response.genTextWithPersona(
            i18.__("subject.android.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Corel Draw":
        response = [
          curation.handlePayload("CURATION_PHOTOSHOP"),
          Response.genTextWithPersona(
            i18.__("subject.uncondition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Đồ họa Photoshop":
        response = [
          curation.handlePayload("CURATION_PHOTOSHOP"),
          Response.genTextWithPersona(
            i18.__("subject.uncondition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Kỹ thuật xây dựng giáo án điện tử":
        response = [
          curation.handlePayload("CURATION_ELECLESSON"),
          Response.genTextWithPersona(
            i18.__("subject.uncondition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Kỹ thuật trình bày luận văn":
        response = [
          curation.handlePayload("CURATION_THESISTECH"),
          Response.genTextWithPersona(
            i18.__("subject.uncondition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Lập trình Web":
        response = [
          curation.handlePayload("CURATION_WEBPROGRAMING"),
          Response.genTextWithPersona(
            i18.__("subject.webprograming.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Thiết kế Web cơ bản":
        response = [
          curation.handlePayload("CURATION_WEBDESIGN"),
          Response.genTextWithPersona(
            i18.__("subject.webdesign.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Lắp ráp máy tính":
        response = [
          curation.handlePayload("CURATION_PCASSEMBLY"),
          Response.genTextWithPersona(
            i18.__("subject.uncondition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Cài đặt máy tính":
        response = [
          curation.handlePayload("CURATION_PCSETUP"),
          Response.genTextWithPersona(
            i18.__("subject.pcsetup.condition"),
            config.personaHelp.id
          )
        ];
        break;
      case "Quản trị mạng doanh nghiệp":
        response = [
          curation.handlePayload("CURATION_WEBMANAGEMENT"),
          Response.genTextWithPersona(
            i18.__("subject.netmanagement.condition"),
            config.personaHelp.id
          )
        ];
        break;
    }
    return response;
  }

  //test handle mess with wit
  async handleTestMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    let client = new wit({ accessToken : config.witToken});

    // check greeting is here and is confident
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");
       
    let message = this.webhookEvent.message.text.trim().toLowerCase();
    
    let response;
    let res = await client.message(message, {});

    // const data = client.message(message, {})
    // .then(data=> (data))
    // .catch(error=>{console.log("test error:", error)});
    
    // console.log('data ne', data);
    
    let help = this.newtest(res,"help");
    let welcome = this.newtest(res,"greeting");
    let intent = this.newtest(res,"intent");
    let subject = this.newtest(res,"subject");
    let regis = this.newtest(res,"register");
    let tuition = this.newtest(res,"tuition");
    let examschedule = this.newtest(res,"examschedule");
    let examine = this.newtest(res,"examine");
    let tempcertificate = this.newtest(res,"tempcertificate");
    let certificate = this.newtest(res,"certificate");
    let examresult = this.newtest(res,"examresult");
    let reexam = this.newtest(res,"reexam");
    let learningcondition = this.newtest(res,"learningcondition");
    let nextcourse = this.newtest(res,"nextcourse");
    
    let edu = this.newtest(res,"educate");
    console.log(res.entities);
    let valintent=this.firstEntityValue(res.entities,"intent");
    let valsubject=this.firstEntityValue(res.entities,"subject");
    let valregis=this.firstEntityValue(res.entities,"register");

    // interactive(client);
    
    if (
      (greeting && greeting.confidence > 0.8) ||
       message.includes("start over")||welcome)
    {
      response = Response.genNuxMessage(this.user);
    // } else if(Number(message)){
    //   response = Order.handlePayload("ORDER_NUMBER");
    } else if(intent){
      let curation = new Curation(this.user, this.webhookEvent);
      let care = new Care(this.user, this.webhookEvent);
      let temp =`${config.mainUrl}`;
      switch(valintent){
        case i18n.__("intent.examschedule"):
          response = [
            Response.genTextWithPersona(
              i18.__("order.examschedule.next"),
              config.personaHelp.id
            ),
            Response.genGenericTemplateLinkLoopWithPersona(
              {
                title: i18n.__("order.examschedule.title"),
                subtitle: i18n.__("order.examschedule.subtitle"),
                url: `${temp}/${i18n.__("order.examschedule.suburl")}`
              },
              config.personaHelp.id
            ),
            Response.genTextWithPersona(
              i18.__("order.plapla"),
              config.personaHelp.id
            )
          ];
          break;
        case i18n.__("intent.detail"):
          response = [
            this.isSubject(valsubject),
            Response.genTextWithPersona(
              i18n.__("order.case.detail",{subject : valsubject}),
              config.personaHelp.id
            ),
          ];
          break;
        case i18n.__("intent.tuition"):
          if(subject){
            response = [
              Response.genTextWithPersona(
                i18n.__("order.tuition.subject",{subject : valsubject}),
                config.personaHelp.id
              ),
              this.isSubject(valsubject)
            ];
          }
          if(!subject){
            response = [
              Response.genTextWithPersona(
                i18n.__("order.tuition.nosj"),
                config.personaHelp.id
              )
            ];
          }
          break;
        case i18n.__("intent.condition"):
          if(subject){
            response = [
              Response.genTextWithPersona(
                i18n.__("order.condition.subject",{subject : valsubject}),
                config.personaHelp.id
              ),
              this.isSubject(valsubject)
            ];
          }
          if(!subject){
            response = [
              Response.genTextWithPersona(
                i18n.__("order.condition.nosj"),
                config.personaHelp.id
              )
            ];
          }
        case i18n.__("intent.examine"):
          response = care.handlePayload("CARE_EXAMINE");
          break;
        case i18n.__("intent.reexam"):
          response = [
            Response.genButtonTemplateWithPersona(
              i18n.__("order.reexam.safedetail"),
              Response.genPostbackButton(i18n.__("order.reexam.from"), "CURATION_REEXAM"),
              config.personaHelp.id
            )
          ]
        case i18n.__("intent.result"):
          response = [
            Response.genTextWithPersona(
              i18.__("order.examresult.next"),
              config.personaHelp.id
            ),
            Response.genGenericTemplateLinkLoopWithPersona(
              {
                title: i18n.__("order.examresult.title"),
                subtitle: i18n.__("order.examresult.subtitle"),
                url: `${temp}/${i18n.__("order.examresult.suburl")}`
              },
              config.personaHelp.id
            ),
            Response.genTextWithPersona(
              i18.__("order.plapla"),
              config.personaHelp.id
            ),
          ];
          break;
        case i18n.__("intent.tempcertificate"):
          response = [
            Response.genTextWithPersona(
              i18.__("order.tempcertificate.plapla"),
              config.personaHelp.id
            ),
            Response.genTextWithPersona(
              i18.__("order.plapla"),
              config.personaHelp.id
            )
          ];
          break;
        case i18n.__("intent.certificate"):
          response = Response.genTextWithPersona(
            i18n.__("order.certificate"),
            config.personaHelp.id
          )
          break;
        case i18n.__("intent.nextcourse"):
          response = [
            Response.genTextWithPersona(
              i18.__("order.nextcourse.next"),
              config.personaHelp.id
            ),
            Response.genGenericTemplateLinkLoopWithPersona(
              {
                title: i18n.__("order.nextcourse.title"),
                subtitle: i18n.__("order.nextcourse.subtitle"),
                url: `${temp}/${i18n.__("order.nextcourse.suburl")}`
              },
              config.personaHelp.id
            )
          ];
          break;
      }
    } else if (!intent||1){
      if(examschedule){
          response = [
            Response.genTextWithPersona(
              i18.__("order.examschedule.next"),
              config.personaHelp.id
            ),
            Response.genGenericTemplateLinkLoopWithPersona(
              {
                title: i18n.__("order.examschedule.title"),
                subtitle: i18n.__("order.examschedule.subtitle"),
                url: `${temp}/${i18n.__("order.examschedule.suburl")}`
              },
              config.personaHelp.id
            ),
            Response.genTextWithPersona(
              i18.__("order.plapla"),
              config.personaHelp.id
            )
          ];
          // break;
      } else if(tuition){
        if(subject){
          response = [
            Response.genTextWithPersona(
              i18n.__("order.tuition.subject",{subject : valsubject}),
              config.personaHelp.id
            ),
            this.isSubject(valsubject)
          ];
        }
        if(!subject){
          response = [
            Response.genTextWithPersona(
              i18n.__("order.tuition.nosj"),
              config.personaHelp.id
            )
          ];
        }
        // break;
      } else if(learningcondition){
        if(subject){
          response = [
            Response.genTextWithPersona(
              i18n.__("order.condition.subject",{subject : valsubject}),
              config.personaHelp.id
            ),
            this.isSubject(valsubject)
          ];
        }
        if(!subject){
          response = [
            Response.genTextWithPersona(
              i18n.__("order.condition.nosj"),
              config.personaHelp.id
            )
          ];
        }
      } else if(examine){
        response = care.handlePayload("CARE_EXAMINE");
        // break;
      } else if(reexam){
        response = [
          Response.genButtonTemplateWithPersona(
            i18n.__("order.reexam.safedetail"),
            Response.genPostbackButton(i18n.__("order.reexam.from"), "CURATION_REEXAM"),
            config.personaHelp.id
          )
        ]
      } else if(examresult){
        response = [
          Response.genTextWithPersona(
            i18.__("order.examresult.next"),
            config.personaHelp.id
          ),
          Response.genGenericTemplateLinkLoopWithPersona(
            {
              title: i18n.__("order.examresult.title"),
              subtitle: i18n.__("order.examresult.subtitle"),
              url: `${temp}/${i18n.__("order.examresult.suburl")}`
            },
            config.personaHelp.id
          ),
          Response.genTextWithPersona(
            i18.__("order.plapla"),
            config.personaHelp.id
          ),
        ];
        // break;
      } else if(tempcertificate){
        response = [
          Response.genTextWithPersona(
            i18.__("order.tempcertificate.plapla"),
            config.personaHelp.id
          ),
          Response.genTextWithPersona(
            i18.__("order.plapla"),
            config.personaHelp.id
          )
        ];
        // break;
      } else if(certificate){
        response = Response.genTextWithPersona(
          i18n.__("order.certificate"),
          config.personaHelp.id
        )
        // break;
      } else if(nextcourse){
        response = [
          Response.genTextWithPersona(
            i18.__("order.nextcourse.next"),
            config.personaHelp.id
          ),
          Response.genGenericTemplateLinkLoopWithPersona(
            {
              title: i18n.__("order.nextcourse.title"),
              subtitle: i18n.__("order.nextcourse.subtitle"),
              url: `${temp}/${i18n.__("order.nextcourse.suburl")}`
            },
            config.personaHelp.id
          )
        ];
        // break;
      } else if(message.includes(i18n.__("menu.educate").toLowerCase())||edu){
        let curation = new Curation(this.user, this.webhookEvent);
        if(subject){
          response = [
            Response.genTextWithPersona(
              i18n.__("order.case.detail",{subject : valsubject}),
              config.personaHelp.id
            ),
            this.isSubject(valsubject)
          ];
        }
        else{
          response = [
            curation.handlePayload("CURATION")
          ];
        }
        // break;
      } else if(message.includes(i18n.__("menu.register").toLowerCase())||regis){
        // response = Order.handlePayload("LINK_ORDER");
        switch(valregis){
          case "hạn đăng ký":
            response = Response.genTextWithPersona(
              i18n.__("order.regis.timeout"),
              config.personaHelp.id
            );
            break;
          case "đăng ký":
            response = Order.handlePayload("LINK_ORDER");
            break;  
          case "đăng ký thi":
            response = [
              Response.genTextWithPersona(
                i18n.__("order.regis.fee"),
                config.personaHelp.id
              ),
              Response.genTextWithPersona(
                i18n.__("order.regis.pay"),
                config.personaHelp.id
              ),
              Response.genTextWithPersona(
                i18n.__("order.regis.other"),
                config.personaHelp.id
              )
            ];
            break;
          case "đăng ký học":
            response = Order.handlePayload("LINK_ORDER");
            break;
        }
      } else if(subject){
        response = [
          this.isSubject(valsubject),
          Response.genTextWithPersona(
            i18n.__("order.case.detail",{subject : valsubject}),
            config.personaHelp.id
          ),
        ];
        // break;
      }
    // } else if (message.includes("#")) {
    //   response = Survey.handlePayload("CSAT_SUGGESTION");
    // } else if ((message.includes(i18n.__("care.help").toLowerCase()))) {
    //   let care = new Care(this.user, this.webhookEvent);
    //   response = care.handlePayload("CARE_HELP");
    } else {
      response = [
        Response.genText(
          i18n.__("fallback.any", {
            message: this.webhookEvent.message.text
          })
        ),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
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
        ])
      ];
    }
    return response;
  }
};
