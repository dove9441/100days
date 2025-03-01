import * as cheerio from 'cheerio';

import styles from '@/components/BibleVerse.module.css';




async function getBibleData() {

const response = await fetch('https://sum.su.or.kr:8888/bible/today' ,{cache: 'no-store'});

const html = await response.text();

const $ = cheerio.load(html);



const bibleInfoBoxText = $('#bibleinfo_box').text();

const title = $('#bible_text').text()

const bodyListTexts: string[] = [];



// 해설 부분

const commentation =$('#body_cont_3').text()





// 본문 가져오기

$('#body_list > li').each((index, element) => {

bodyListTexts.push($(element).text());

});



// 해

return { bibleInfoBoxText, title, bodyListTexts, commentation };

}



interface BibleInfo {

book: string;

chapterVerse: string;

}



function extractBibleInfo(text : string): BibleInfo {

const result : BibleInfo = {

book: '',

chapterVerse: ''

};


const bibleMatch = text.match(/본문\s*:\s*(.+?)\((.*?)\)(.+?)\s*찬송가/); // 정규 표현식

if (bibleMatch) {

result.book = bibleMatch[1].trim(); //

result.chapterVerse = bibleMatch[3].trim(); // 6:12 - 6:26

}

return result;

}



// React Server Component (async 함수로 정의)

export default async function Today_qt() {

const { bibleInfoBoxText, title, bodyListTexts, commentation} = await getBibleData();

const info = extractBibleInfo(bibleInfoBoxText)

return (

<div className={styles.container}>

<h1>{title}</h1>

<span className={styles.bibleInfoBox}> {info.book} {info.chapterVerse} </span>

<ul className={styles.verseList}>

{bodyListTexts.map((text, index) => {

// 숫자와 나머지 텍스트를 분리. 예: "1. 첫 번째 구절" -> ["1", "첫 번째 구절"]

const match = text.match(/^(\s*\d+)\.\s*(.*)/); // 정규 표현식. "숫자. 텍스트" 패턴

let verseIndex = '';

let verseText = text;



if(match){ // 매치되면, 번호와 텍스트 분리

verseIndex = match[1]; // 첫 번째 그룹 (숫자)

verseText = match[2]; // 두 번째 그룹 (나머지 텍스트)

}

return (

<li key={index} className={styles.verseItem}>

{verseIndex && <span className={styles.verseIndex}>{verseIndex}</span>}

<span className={styles.verseText}>{verseText}</span>

</li>

)})}

</ul>



<p>

{commentation}

</p>

</div>

);

}