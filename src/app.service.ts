import { Injectable } from '@nestjs/common';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

type Request = {
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    ssmlGender:
      | 'SSML_VOICE_GENDER_UNSPECIFIED'
      | 'FEMALE'
      | 'MALE'
      | 'NEUTRAL'
      | null
      | undefined;
  };
  audioConfig: {
    audioEncoding:
      | 'AUDIO_ENCODING_UNSPECIFIED'
      | 'LINEAR16'
      | 'OGG_OPUS'
      | 'MULAW'
      | 'ALAW'
      | 'MP3'
      | null
      | undefined;
    speakingRate: number;
  };
};

@Injectable()
export class AppService {
  async getHello(): Promise<string | Uint8Array> {
    const client = new textToSpeech.TextToSpeechClient();
    const text = 'Apple Apple Apple Apple Apple';

    const request: Request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 1 },
    };

    const [response] = await client.synthesizeSpeech(request);

    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');

    return response.audioContent;
  }
}
