const getData = (onSuccess, onfail) => {
  fetch('https://25.javascript.pages.academy/keksobooking/data').then((response) => response.json()).then((data) => {
    onSuccess(data);
  }).catch(() => {
    onfail();
  });
};
const sendData = (onSuccess, onFail, body) => {
  fetch('https://25.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body
    },
  ).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      onFail();
    }
  })
    .catch(() => {
      onFail();
    });
};

export { getData, sendData };
