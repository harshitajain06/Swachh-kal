import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { HeroId, heroById } from '../data/content';

export type CertKind = { kind: 'hero'; heroId: HeroId } | { kind: 'superhero' } | { kind: 'pledge365' };

export interface CertInput {
  cert: CertKind;
  name: string;
  /** ISO date the stage was completed. */
  completedAt: string;
}

const BACKGROUND = require('../../assets/art/certificate-bg.jpg');

async function dataUri(mod: number, mime: string) {
  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  const b64 = await FileSystem.readAsStringAsync(asset.localUri ?? asset.uri, { encoding: FileSystem.EncodingType.Base64 });
  return `data:${mime};base64,${b64}`;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const certTitle = (c: CertKind) => (c.kind === 'hero' ? `${heroById(c.heroId).name} (${heroById(c.heroId).element}) Certificate` : c.kind === 'superhero' ? 'Swachh Kal Superhero Certificate' : '365-Day Pledge Certificate');

const certFileName = (c: CertKind) => (c.kind === 'hero' ? heroById(c.heroId).name : c.kind === 'superhero' ? 'Superhero' : '365-Day-Pledge');

function copy(c: CertKind) {
  if (c.kind === 'hero') {
    const h = heroById(c.heroId);
    return {
      banner: ['I’M A ', `${h.heroTitle.toUpperCase()}!`],
      line: `For completing the ${h.name} (${h.element}) stage of Swachh Kal!`,
      blurb: h.completeMessage,
      stats: [`<b>5</b> Habits Completed`, `<b>${esc(h.heroTitle)}</b> Badge`],
    };
  }
  if (c.kind === 'superhero') {
    return {
      banner: ['I’M A SWACHH KAL ', 'SUPERHERO!'],
      line: 'For completing all 4 Hero missions of Swachh Kal!',
      blurb: 'You looked after the air, the trees, the earth and the water. Your actions make Earth a happier place!',
      stats: [`<b>20</b> Habits Completed`, `<b>4</b> Eco Heroes Unlocked`],
    };
  }
  return {
    banner: ['I’M A SWACHH KAL ', 'ECO HERO!'],
    line: 'For completing the Swachh Kal 365-Day Pledge!',
    blurb: 'You took small steps every day to protect our planet, save water, care for trees, keep the air clean and reduce waste. Your actions make Earth a happier place!',
    stats: [`<b>365</b> Days of Commitment`, `<b>4</b> Eco Heroes Unlocked`],
  };
}

/**
 * The artwork already carries the 365-Day Pledge wording, so that certificate only gets the name and date on top.
 * Hero and Superhero certificates hide the pledge-specific parts (ribbon, "for completing" text, stats) and write their own.
 */
async function certHtml({ cert, name, completedAt }: CertInput) {
  const bg = await dataUri(BACKGROUND, 'image/jpeg');
  const c = copy(cert);
  const own = cert.kind !== 'pledge365';
  const nameSize = name.length > 26 ? 18 : name.length > 18 ? 22 : 27;
  const patch = 'position:absolute;background:#FDFCF5;box-shadow:0 0 8px 6px #FDFCF5;';
  const blue = '#2A5CAA';
  const replaced = own
    ? `<div style="${patch}left:20%;top:34%;width:60%;height:11.4%;box-shadow:0 0 4px 2px #FDFCF5"></div>
  <div style="position:absolute;left:23%;top:36%;width:54%;height:8.5%;background:#2F7D45;border-radius:6px;transform:rotate(-1.5deg);color:#fff;font-size:22px;font-weight:bold;text-align:center;line-height:51px;white-space:pre;box-shadow:0 2px 4px #0003">${esc(c.banner[0])}<span style="color:#F7E27A">${esc(c.banner[1])}</span></div>
  <div style="${patch}left:20%;top:55%;width:60%;height:28%"></div>
  <div style="position:absolute;left:20%;width:60%;top:56%;text-align:center;font-size:19px;font-weight:bold;color:${blue}">${esc(c.line)}</div>
  <div style="position:absolute;left:24%;width:52%;top:62.5%;text-align:center;font-size:14.5px;line-height:1.4;color:${blue}">${esc(c.blurb)}</div>
  <div style="position:absolute;left:50%;top:74%;transform:translateX(-50%);white-space:nowrap;background:#DDEFC6;border-radius:12px;padding:6px 26px;font-size:14px;color:#2B3A55">${c.stats[0]}<span style="margin:0 16px;color:#88A">|</span>${c.stats[1]}</div>`
    : '';
  return `<html><head><meta charset="utf-8"><meta name="viewport" content="width=900"><style>
  @page{size:900px 600px;margin:0} *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact} body{margin:0;width:900px;height:600px;font-family:'Marker Felt','Chalkboard SE','Comic Sans MS',Helvetica,sans-serif}
  .page{position:relative;width:900px;height:600px;overflow:hidden}
  .bg{position:absolute;left:0;top:0;width:900px;height:600px}
  b{font-size:24px;color:#1E6B3A}
  </style></head><body><div class="page"><img class="bg" src="${bg}"/>${replaced}
  <div style="position:absolute;left:27.7%;width:45%;bottom:47.3%;text-align:center;font-size:${nameSize}px;color:${blue};white-space:nowrap;overflow:hidden">${esc(name)}</div>
  <div style="position:absolute;left:19.5%;width:15%;bottom:10.4%;text-align:center;font-size:11px;color:${blue}">${esc(fmtDate(completedAt))}</div>
  </div></body></html>`;
}

/** Builds the certificate PDF and opens the share sheet so it can be saved or sent. */
export async function shareCertificate(input: CertInput) {
  const { uri } = await Print.printToFileAsync({ html: await certHtml(input), width: 900, height: 600 });
  // Print gives the file a random name; copy it so the saved PDF is called something sensible.
  const named = new File(Paths.cache, `Swachh-Kal-${certFileName(input.cert)}-Certificate.pdf`);
  if (named.exists) named.delete();
  new File(uri).copy(named);
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(named.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: certTitle(input.cert) });
}
