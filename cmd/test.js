function bold(text) {
  return `<b>${text}</b>`;
}

function italic(text) {
  return `<i>${text}</i>`;
}

function underline(text) {
  return `<u>${text}</u>`;
}

function strikethrough(text) {
  return `<s>${text}</s>`;
}

function code(text) {
  return `<code>${text}</code>`;
}

function link(text, url) {
  return `<a href="${url}">${text}</a>`;
}

function image(url, alt) {
  return `<img src="${url}" alt="${alt}">`;
}

function paragraph(text) {
  return `${text}\n\n`;
}

function list(items, ordered = false) {
  const tag = ordered ? '1.' : '*';
  const listItems = items.map((item) => `${tag} ${item}`).join('\n');
  return `${listItems}\n\n`;
}

function codeBlock(code, language = '') {
  return `<pre><code class="language-${language}">${code}</code></pre>`;
}


module.exports = {
  command: '/test',
  description: 'test',
  code: async(bot, message, args) => {
    const text = await 'Lorem ipsum dolor sit amet';

const formattedText = await bold(text);
console.log(formattedText); // **Lorem ipsum dolor sit amet.**
message.reply({text: formattedText, parseMode: 'HTML'})

const formattedText2 = await italic(text);
console.log(formattedText2); // *Lorem ipsum dolor sit amet.*
message.reply({text: formattedText2, parseMode: 'HTML'})

const formattedText3 = await underline(text);
console.log(formattedText3); // __Lorem ipsum dolor sit amet.__
message.reply({text: formattedText3, parseMode: 'HTML'})

const formattedText4 = await strikethrough(text);
console.log(formattedText4); // ~Lorem ipsum dolor sit amet.~
message.reply({text: formattedText4, parseMode: 'HTML'})

const formattedText5 = await code(text);
console.log(formattedText5); // `Lorem ipsum dolor sit amet.`
message.reply({text: formattedText5, parseMode: 'HTML'})

const linkText = await 'Google';
const linkUrl = await 'https://www.google.com';
const formattedText6 = await link(linkText, linkUrl);
console.log(formattedText6); // [Google](https://www.google.com)
message.reply({text: formattedText6, parseMode: 'HTML'})

/*const imageUrl = await 'https://www.example.com/image.jpg';
const imageAlt = await 'Example Image';
const formattedText7 = await image(imageUrl, imageAlt);
console.log(formattedText7); // ![Example Image](https://www.example.com/image.jpg)*/
//message.reply({text: formattedText7, parseMode: 'HTML'})

/*const headerText = await 'Header Text';
const formattedText8 = await heading(headerText, 6);
console.log(formattedText8); // # Header Text
message.reply({text: formattedText8, parseMode: 'HTML'})*/

const paragraphText = await 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
const formattedText9 = await paragraph(paragraphText);
console.log(formattedText9); // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
message.reply({text: formattedText9, parseMode: 'HTML'})

const listItems = await ['Item 1', 'Item 2'];
const formattedText10 = await list(listItems);
console.log(formattedText10);
/*
* Item 1
* Item 2
* Item 3
*/
message.reply({text: formattedText10, parseMode: 'HTML'})

/*const headers = await ['Name', 'Age', 'Gender'];
const rows = await [
  ['John', '25', 'Male'],
  ['Jane', '30', 'Female'],
  ['Bob', '45', 'Male'],
];
const formattedText11 = await table(headers, rows);
console.log(formattedText11);*/
/*
Name | Age | Gender
--- | --- | ---
John | 25 | Male
Jane | 30 | Female
Bob | 45 | Male
*/
/*message.reply({text: formattedText11, parseMode: 'HTML'})*/

const codeBlockText = await 'const greeting = await "Hello, World!";console.log(greeting);';
const formattedText12 = await codeBlock(codeBlockText, 'javascript');
console.log(formattedText12);
message.reply({text: formattedText12, parseMode: 'HTML'})

const greeting = await "Hello, World!";
console.log(greeting);
  }
}