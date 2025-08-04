import { NextResponse } from "next/server";
import {JSDOM} from 'jsdom'
import axios from "axios";
import pdf from "pdf-parse";
import fs from 'fs/promises';
import path from 'path';
import db from "@/lib/db/db";

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
      predmet: predmet.trim(),
      tip: tip_ispita,
      datum: datum,
      od: OD,
      do: DO
    })
  })

  if (print) console.log(pdfText)
  return termini
}

async function fetchData() {
  let dataKLK = await fetch("https://oas.fon.bg.ac.rs/raspored-kolokvijuma")
  if (dataKLK == null) return null
    const textKLK = await dataKLK.text();
  
  let dataISP = await fetch("https://oas.fon.bg.ac.rs/raspored-ispita")
  if (dataISP == null) return null
    const textISP = await dataISP.text();

  const linkoviKLK = await FonLinkovi(textKLK)
  const linkoviISP = await FonLinkovi(textISP)

  let terminiIspita: any = {}
  let terminiKolokvijuma: any = {}

  linkoviISP.forEach((link) => {terminiIspita[link.semestar] = {}})
  for (let i = 0; i < linkoviISP.length; i++){
    const text = await fetchAndExtractPdfText(linkoviISP[i].url)
    const termini = textToData(text)

    let ime : string = linkoviISP[i]?.text?.trim() ?? "nema ime";
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

    let ime : string = linkoviKLK[i]?.text?.trim() ?? "nema ime";
    let isecenoIme = ime.split("-")[0].trim()
    let match = ime.match(/\d{2}.\d{2}.\d{4}/)
    let datum = match ? match.toString() : ""

    terminiKolokvijuma[linkoviKLK[i].semestar][isecenoIme] = {
      url: linkoviKLK[i].url,
      datum: datum,
      termini: termini,
    }
  }

  let linkovi: { [key: string]: any } = {
    "KOLOKVIJUMI" : terminiKolokvijuma,
    "ISPITI" : terminiIspita
  }

  return linkovi;
}

export async function GET() {
  const data = await fetchData();
  if (!data) return NextResponse.json({message: 'Doslo je do greske.'}, { status: 400 });
  const tipovi = Object.keys(data);
  await db.examTerm.deleteMany();
  await db.examSubject.deleteMany();
  await db.examPeriod.deleteMany();
  await db.examSemester.deleteMany();
  await db.examType.deleteMany();

  // Step 2: Insert base examType
  for (const tip of tipovi) {
    const kolokvijumi = await db.examType.create({
      data: { 
        name: tip,
        idexamType: tip
      },
    });

    for (const [semesterName, periods] of Object.entries(data[tip])) {
      const semester = await db.examSemester.create({
        data: {
          idexamSemester: `${tip}--${semesterName}`,
          semesterName,
          examType: {
            connect: { idexamType: kolokvijumi.idexamType },
          },
        },
      });

      for (const [periodName, periodData] of Object.entries(periods as Record<string, any>)) {
        const period = await db.examPeriod.create({
          data: {
            idexamPeriod: `${tip}--${semesterName}--${periodName}`,
            periodName: periodName,
            periodDate: periodData.datum,
            periodUrl: periodData.url,
            examSemester: {
              connect: { idexamSemester: semester.idexamSemester },
            },
          },
        });

        const subjectMap: Record<string, any> = {};

        for (const term of periodData.termini) {
          if (term.predmet == "") continue;
          const key = `${term.predmet}__${term.tip}`;
          let subject = subjectMap[key];
          console.log(term)

          if (!subject) {
            subject = await db.examSubject.create({
              data: {
                // idexamSubject: term.predmet + term.tip + "--" + period.idexamPeriod,
                idexamSubject: `${tip}--${semesterName}--${periodName}--${term.predmet}--${term.tip}`,
                type: term.tip,
                subjectName: term.predmet,
                examPeriod: {
                  connect: { idexamPeriod: period.idexamPeriod },
                },
              },
            });
            subjectMap[key] = subject;
          }

          const [day, month, year] = term.datum.split('-');
          const date = new Date(`${year}-${month}-${day}`);

          await db.examTerm.create({
            data: {
              od: term.od,
              do: term.do,
              datum: date,
              examSubject: {
                connect: {
                  idexamSubject: subject.idexamSubject,
                },
              },
            },
          });
        }
      }
    }
  }

  console.log('Database seeded successfully.');

  return  NextResponse.json({message: 'Podaci uspešno sačuvani.'}, { status: 200 });
}