import last from 'lodash.last';

const type = 'instagram';

const getUser = userElm => {
  if (!userElm) {
    return {name: null, slug: null};
  }
  let userString = userElm.textContent;

  const slugStart = userString.indexOf('@') + 1;
  const slugEnd = userString.indexOf(')');
  const slug = userString.slice(slugStart, slugEnd);

  userString = userString.replace('A post shared by ', '')

  const nameEnd = userString.indexOf('(')
  const name = userString.slice(0, nameEnd).trim()

  return {name, slug};
};

const getDate = elm => {
  const time = elm && elm.getElementsByTagName('time')[0];
  if (!time) {
    return {urc: null, string: null};
  }
  return {
    utc: time.getAttribute('datetime'),
    string: time.childNodes[0].data
  };
};

function testInstagramMediaEmbed (elm) {
  if (!elm.classList.contains('instagram-media')) {
    return null;
  }

  const paragraphs = elm.getElementsByTagName('p');
  if (!paragraphs[0]) {
    return null;
  }

  const postLink = paragraphs[0].getElementsByTagName('a')[0];
  const text = (elm.hasAttribute('data-instgrm-captioned') && postLink.childNodes[0])
    ? postLink.childNodes[0].data : null;
  const url = postLink.getAttribute('href');
  const id = last(url.split('/').filter(Boolean));
  const user = getUser(last(paragraphs));
  const date = getDate(last(paragraphs));

  return {type, text, url, id, user, date};
}

const regexp = /https?:\/\/(www.)?instagram\.com\/p\/([A-Za-z0-9_-]+)\/embed/;

function testInstagramIframe (elm) {
  if (elm.tagName.toLowerCase() !== 'iframe') {
    return null;
  }

  const url = elm.getAttribute('src') || '';
  const match = url.match(regexp);
  if (!match) {
    return null;
  }

  const id = match[2];

  return {type, text: '', url: `https://instagram.com/p/${id}`, id};
}

export default ([elm]) => {
  return testInstagramMediaEmbed(elm) || testInstagramIframe(elm);
};
