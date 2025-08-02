import { NextResponse } from "next/server";
import {JSDOM} from 'jsdom'
import axios from "axios";
import pdf from "pdf-parse";
import fs from 'fs/promises';
import path from 'path';

async function fetchAndExtractPdfText(url: string): Promise<string> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data);

    const data = await pdf( buffer );
    return data.text;
    return "test"
  } catch (err) {
    console.error(`Failed to fetch or parse PDF at ${url}:`, err);
    return "";
  }
}

interface PDFLink {
  semestar: string,
  text: string | null,
  url: string
}

async function FonLinkovi(html : string) : Promise<PDFLink[]> {
  const dom = new JSDOM(html)
  const document = dom.window.document
  
  const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
  const results : PDFLink[] = [];
  
  pdfLinks.forEach(link => {
    const parent = link.closest(".elementor-column"); // nađeš kolonu u kojoj se nalazi link
    if (!parent) return;
    
    // tražimo najbliži h2 unutar te kolone
    const heading = parent.querySelector("h2");
    // console.log(heading)
    const headingText = heading ? heading.innerHTML : "Nepoznata sekcija";
    
    const a = link as HTMLAnchorElement
    
    results.push({
      semestar: headingText,
      text: link.textContent,
      url: a.href
    });
  });
  
  // console.log(results);
  return results
}

interface Termin {
  [Key: string] : string
}

function textToData(pdfText: string, print: boolean = false) : Termin[] {
  const regex = /\d{2}-\d{2}-\d{4}.*\d{2}:\d{2}.*\d{2}:\d{2}/
  const termini: Termin[] = []

  let linije = pdfText.split("\n")
  if (print) console.log(linije)
  linije = linije.filter( termin => regex.test( termin ) )
  if (print) console.log(linije)
  linije.forEach( termin => {
    if (print) console.log(termin)
    let predmetDatum = termin.match(/^.*?\d{2}-\d{2}-\d{4}/g)?.toString()
    let oddo = termin.match(/\d{2}:\d{2}\s*\d{2}:\d{2}/g)?.toString()

    if (!predmetDatum || !oddo){
      console.log(`\n\n\n\nDOSLO JE DO GRESKEEE ${predmetDatum} ${oddo}\n\n\n\n`)
      return
    }

    let datum = predmetDatum.substring(predmetDatum.length - 10, predmetDatum.length)
    let predmet = predmetDatum.substring(0, predmetDatum.length-10).trim()
    let tip_ispita = "K"
    if (predmet[predmet.length-1] == "P" || predmet[predmet.length-1] == "U") {
      tip_ispita = predmet[predmet.length-1]
      predmet = predmet.substring(0, predmet.length-1)
    }
    let OD = oddo.substring(0,5)
    let DO = oddo.substring(oddo.length - 5, oddo.length)

    if (print) console.log(datum, predmet, tip_ispita, OD, DO)

    termini.push({
      predmet: predmet,
      tip: tip_ispita,
      datum: datum,
      od: OD,
      do: DO
    })
  })

  if (print) console.log(pdfText)
  return termini
}

export async function GET() {
  let dataKLK = await fetch("https://oas.fon.bg.ac.rs/raspored-kolokvijuma")
  if (dataKLK == null) return NextResponse.json({poruke: "greska sa fetchiovanjem KLK"}, {status: 201})
    const textKLK = await dataKLK.text();
  
  let dataISP = await fetch("https://oas.fon.bg.ac.rs/raspored-ispita")
  if (dataISP == null) return NextResponse.json({poruke: "greska sa fetchiovanjem KLK"}, {status: 201})
    const textISP = await dataISP.text();

  const linkoviKLK = await FonLinkovi(textKLK)
  const linkoviISP = await FonLinkovi(textISP)

  let terminiIspita: any = {}
  let terminiKolokvijuma: any = {}

  linkoviISP.forEach((link) => {terminiIspita[link.semestar] = {}})
  for (let i = 0; i < linkoviISP.length; i++){
    const text = await fetchAndExtractPdfText(linkoviISP[i].url)
    const termini = textToData(text)

    let ime : string = linkoviISP[i]?.text ?? "nema ime";
    let isecenoIme = ime.split("-")[0].trim()
    let match = ime.match(/\d{2}.\d{2}.\d{4}/)
    let datum = match ? match.toString() : ""

    terminiIspita[linkoviISP[i].semestar][isecenoIme] = {
      url: linkoviISP[i].url,
      datum: datum,
      termini: termini,
    }
  }

  linkoviKLK.forEach((link) => {terminiKolokvijuma[link.semestar] = {}})
  for (let i = 0; i < linkoviKLK.length; i++){
    const text = await fetchAndExtractPdfText(linkoviKLK[i].url)
    const termini = textToData(text)

    let ime : string = linkoviKLK[i]?.text ?? "nema ime";
    let isecenoIme = ime.split("-")[0].trim()
    let match = ime.match(/\d{2}.\d{2}.\d{4}/)
    let datum = match ? match.toString() : ""

    terminiKolokvijuma[linkoviKLK[i].semestar][isecenoIme] = {
      url: linkoviKLK[i].url,
      datum: datum,
      termini: termini,
    }
  }

  let linkovi = {
    "KOLOKVIJUMI" : terminiKolokvijuma,
    "ISPITI" : terminiIspita
  }

  const filePath = path.join(process.cwd(), 'data', 'response.json');
  await fs.mkdir(path.dirname(filePath), { recursive: true }); // Kreiraj folder ako ne postoji
  await fs.writeFile(filePath, JSON.stringify(linkovi, null, 2), 'utf-8');

  return  NextResponse.json({message: 'Podaci uspešno sačuvani.'}, { status: 200 });

  // return NextResponse.json({linkovi: linkovi}, {status: 200})
}