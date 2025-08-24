const checkbox = document.getElementById('enableLimit');
const amountBox = document.getElementById('amountBox');
checkbox.addEventListener('change', () => {
  amountBox.style.display = checkbox.checked ? 'block' : 'none';
});

function showSet(setId) {
  document.querySelectorAll('.card-set').forEach(s => s.style.display = 'none');
  document.getElementById(setId).style.display = 'flex';
}

const roomCards = document.querySelectorAll('#waterTankSet .card[data-room]');
const saveBtn = document.getElementById('saveBtn');
let currentRoom = '';
let currentCheckbox = null;
let currentStatus = null;

roomCards.forEach(card => {
  const statusBox = card.querySelector('.status-box');
  const checkbox = card.querySelector('.occupyCheck');
  const statusText = card.querySelector('.status-text');
  const saved = localStorage.getItem(card.dataset.room);
  checkbox.checked = saved === 'true';
  statusText.textContent = checkbox.checked ? 'Occupied' : 'Not Occupied';

  card.addEventListener('click', () => {
    document.querySelectorAll('.status-box').forEach(sb => sb.style.display = 'none');
    statusBox.style.display = 'block';
    currentRoom = card.dataset.room;
    currentCheckbox = checkbox;
    currentStatus = statusText;
    saveBtn.style.display = 'none';
  });

  checkbox.addEventListener('change', () => {
    saveBtn.style.display = 'inline-block';
  });
});

saveBtn.addEventListener('click', () => {
  if (currentRoom && currentCheckbox) {
    localStorage.setItem(currentRoom, currentCheckbox.checked);
    currentStatus.textContent = currentCheckbox.checked ? 'Occupied' : 'Not Occupied';
    saveBtn.style.display = 'none';
  }
});








const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});


