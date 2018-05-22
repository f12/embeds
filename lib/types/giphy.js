import renderIframe from '../render-iframe';

export const parse = ([elm]) => {
  let tagName = elm.tagName.toLowerCase();

  if (tagName !== 'iframe') {
    return null;
  }

  let src = elm.getAttribute('src');

  if (!src) {
    return null;
  }

  if (!(src.includes('giphy.com'))) {
    return null;
  }

  if (src.indexOf('?')) {
    src = src.substr(0, src.indexOf('?'));
  }

  const id = src.substr(src.lastIndexOf('/') + 1)

  return id && {
    type: 'giphy',
    id
  };
};

export const render = ({id, width = 640, height = 360}) => renderIframe({
  src: `https://giphy.com/embed/${id}?html5=true`,
  width, height, allowFullscreen: true
});
