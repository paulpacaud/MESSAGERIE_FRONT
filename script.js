const apiUrl = "https://messagerie-back-3xdxja3prq-od.a.run.app/v1/";

function appHttpClient(uri) {
  const url = apiUrl + uri;
  return fetch(url, {
    method: "GET"
  })
}

let msgs = [];

function getAllMsgs() {
  return this.appHttpClient("msg/getAll")
    .then(res => { 
      return res.json(); })
    .then(data => { 
      msgs = data.msgs;
    })
}

function deleteMsg(id) {
  return this.appHttpClient("msg/del/" + id)
    .then(_ => {
      console.log(`Delete message: ${msgs[id]}`);
      this.update();
    })
} 

async function update() {
  await getAllMsgs();
  let messagesList = document.getElementById('messages-list');
  messagesList.innerHTML = ''; // Clear existing list items

  for (let i = 0; i < msgs.length; i++) {
    let messageItem = document.createElement('li');
    messageItem.classList.add('message-item');

    // Crée une div pour text et trash icon
    let contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    // Message text
    let textNode = document.createTextNode(msgs[i]);
    contentDiv.appendChild(textNode);

    // Trash icon
    let trashIcon = document.createElement('img');
    trashIcon.src = './assets/img/trash.svg';
    trashIcon.alt = 'Delete';
    trashIcon.classList.add('trash-icon');
    trashIcon.onclick = async function() { await deleteMsg(i) };

    contentDiv.appendChild(trashIcon);
    messageItem.appendChild(contentDiv);
    messagesList.appendChild(messageItem);
  }
}


document.addEventListener('DOMContentLoaded', async function() {
  update();
});

function submitMessage() {
  const textarea = document.querySelector('.form textarea');
  const message = textarea.value;
  const uri = `msg/post/${message}`;

  appHttpClient(uri)
    .then(response => {
      if (response.ok) {
        console.log('Message sent successfully');
        textarea.value = '';
        update();
      } else {
        console.error('Failed to send message');
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
}