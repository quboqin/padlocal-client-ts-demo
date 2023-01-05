import { PadLocalClient } from "quboqin-padlocal-client-ts";
import { Contact, LoginPolicy, LoginType, Message, QRCodeEvent, QRCodeStatus, SyncEvent } from "quboqin-padlocal-client-ts/dist/proto/padlocal_pb";
import * as QRCode from "qrcode-terminal";

async function main() {
  ////////////////// 在这里填入你的 PadLocal Token //////////////////
  // http://pad-local.com/#/tokens
  const token: string = "puppet_padlocal_0721c4720661480292647e0181896996";
  ////////////////////////////////////////////////////////////////

  const client = await PadLocalClient.create(token);

  client.on("message", (messageList: Message[]) => {
    for (const message of messageList) {
      console.log("on message: ", JSON.stringify(message.toObject()));
    }
  });

  client.on("contact", (contactList: Contact[]) => {
    for (const contact of contactList) {
      console.log("on contact: ", JSON.stringify(contact.toObject()));
    }
  });

  console.log("start login");

  await client.api.login(LoginPolicy.DEFAULT, {
    onLoginStart: (loginType: LoginType) => {
      console.log("start login with type: ", loginType);
    },
    onOneClickEvent: (oneClickEvent: QRCodeEvent) => {
      console.log("on one click event: ", JSON.stringify(oneClickEvent.toObject()));
    },
    onQrCodeEvent: (qrCodeEvent: QRCodeEvent) => {
      if (qrCodeEvent.getStatus() === QRCodeStatus.NEW) {
        console.log('\n▼▼▼ Please scan following qr code to login ▼▼▼\n');

        QRCode.generate(qrCodeEvent.getImageurl(), { small: true });
      }
      else {
        console.log("on qr code event: ", JSON.stringify(qrCodeEvent.toObject()));
      }
    },
    onLoginSuccess(contact: Contact) {
      console.log("on login success: ", JSON.stringify(contact.toObject()));
    },
    onSync: (syncEvent: SyncEvent) => {
      for (const contact of syncEvent.getContactList()) {
        console.log("login on sync contact: ", JSON.stringify(contact.toObject()));
      }

      for (const message of syncEvent.getMessageList()) {
        console.log("login on sync message: ", JSON.stringify(message.toObject()));
      }
    },
  });

  console.log("login done");
}

main().then();