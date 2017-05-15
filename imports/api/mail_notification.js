import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';
import {versions} from './versions.js';
import {mail_list} from './mail_list.js';
import {statuses} from './statuses.js';
import {cits} from './cits.js';

Meteor.methods({
  'mail.citSubmitted'(cit, citNo) {
    check(cit, Object);
    check(citNo, Number);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let version = versions.findOne({version: cit.version, product: cit.product},{limit: 1});
    console.log(version);
    let sbj = "New CIT was submitted (CIT-"+citNo+")";
    let txt = "Issue number:\t"+cit.issueNo
              +"\nDescription:\t"+cit.description
              +"\nVersion:\t"+version.label
              +"\nComponents:\t"+cit.components
              +"\n\nMore information you can find on Hotfix Portal.";
    console.log(cit);
    Email.send({
      to: cit.email+","+cit.mailsTo,
      from: "<4km-hfportal@unify.com>",
      subject: sbj,
      text: txt
    });
  },

  'mail.hfDefined'(version, hfNo) {
    check(version, Object);
    check(hfNo, Number);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let mailsTo = mail_list.find({}).fetch();
    let mailList = "";
    mailList += mailsTo.map((mail) => {
      return mail.value.join();
    });
    console.log(mailList);
    let sbj = "New HF was defined (HF "+hfNo+" "+version.label+")";
    let txt = "Hello all,\n"+sbj;
    //console.log(Email);
    Email.send({
      to: mailList,
      from: "<4km-hfportal@unify.com>",
      subject: sbj,
      text: txt
    });
  },

  'mail.hfStatusChanged'(hf, newStatus) {
    check(hf, Object);
    check(newStatus, String);

    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let version = versions.findOne({product: hf.product, version: hf.version});
    let status = statuses.findOne({value: newStatus});
    let mailsTo = mail_list.find({}).fetch();
    let hfCits = cits.find({hfId: hf._id}).fetch();
    let mailList = "";
    mailList += mailsTo.map((mail) => {
      return mail.value.join();
    });
    let sbj = "HF status changed";
    let txt = "Hello all,\n"+"Status of HF "+hf.hfNumber+" "+version.label+" changed to "+status.label+".";
    if (hfCits.length > 0)
    {
      txt += "\nList of CITs:\n";
      let citList = "";
      citList += hfCits.map((cit) => {
        return "CIT-"+cit.citNo+" ("+cit.issueNo+")\n";
      });
      citList = citList.replace(/,/g, '');
      txt += citList + "\nMore information you can find on Hotfix Portal."
    }
    else {
      txt += "\nDoes not have CITs.";
    }
    //console.log(Email);
    Email.send({
      to: mailList,
      from: "<4km-hfportal@unify.com>",
      subject: sbj,
      text: txt
    });
  }
});
