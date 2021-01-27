const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('InMessage');
const messageContainer = document.querySelector('.container');

var audio = new Audio('static/notification.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left')
        audio.play();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, `right`);
    socket.emit('send', message)
    messageInput.value = '';
})

const user = prompt("Enter Your name to join");
console.log(user);
socket.emit('new-user-joined', user);

socket.on('user-joined', user => {
    append(`${user} joined the chat `, `right`)
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, `left`)
})

socket.on('left', name => {
    append(`${name} left the chat`, `left`)
})