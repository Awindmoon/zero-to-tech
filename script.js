const STORAGE_KEY = 'personalBlogProfile';

const DEFAULT_PROFILE = {
  name: '小明',
  gender: '男',
  age: '22',
  zodiac: '天秤座',
  qq: '123456789',
  contact: '138-0000-0000',
  email: 'xiaoming@example.com',
  avatar: '',
  background: '',
};

const DEFAULT_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<rect fill="%23c7d2fe" width="100" height="100"/>' +
      '<circle cx="50" cy="38" r="18" fill="%236366f1"/>' +
      '<ellipse cx="50" cy="78" rx="28" ry="20" fill="%236366f1"/>' +
    '</svg>'
  );

const elements = {
  bgLayer: document.getElementById('bgLayer'),
  avatarImg: document.getElementById('avatarImg'),
  avatarUploadLabel: document.getElementById('avatarUploadLabel'),
  avatarInput: document.getElementById('avatarInput'),
  displayName: document.getElementById('displayName'),
  displaySubtitle: document.getElementById('displaySubtitle'),
  editBtn: document.getElementById('editBtn'),
  viewMode: document.getElementById('viewMode'),
  editMode: document.getElementById('editMode'),
  profileForm: document.getElementById('profileForm'),
  cancelBtn: document.getElementById('cancelBtn'),
  resetBgBtn: document.getElementById('resetBgBtn'),
  viewGender: document.getElementById('viewGender'),
  viewAge: document.getElementById('viewAge'),
  viewZodiac: document.getElementById('viewZodiac'),
  viewQQ: document.getElementById('viewQQ'),
  viewContact: document.getElementById('viewContact'),
  viewEmail: document.getElementById('viewEmail'),
  inputName: document.getElementById('inputName'),
  inputGender: document.getElementById('inputGender'),
  inputAge: document.getElementById('inputAge'),
  inputZodiac: document.getElementById('inputZodiac'),
  inputQQ: document.getElementById('inputQQ'),
  inputContact: document.getElementById('inputContact'),
  inputEmail: document.getElementById('inputEmail'),
  bgInput: document.getElementById('bgInput'),
};

let profile = loadProfile();
let pendingAvatar = null;
let pendingBackground = null;
let isEditing = false;

function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function displayValue(value) {
  return value && String(value).trim() ? value : '—';
}

function applyBackground() {
  if (profile.background) {
    elements.bgLayer.style.backgroundImage = `url(${profile.background})`;
  } else {
    elements.bgLayer.style.backgroundImage = '';
  }
}

function renderView() {
  elements.avatarImg.src = profile.avatar || DEFAULT_AVATAR;
  elements.displayName.textContent = profile.name || '未设置姓名';
  elements.displaySubtitle.textContent = profile.zodiac
    ? `${profile.zodiac} · 个人博客`
    : '欢迎来到我的个人空间';

  elements.viewGender.textContent = displayValue(profile.gender);
  elements.viewAge.textContent = displayValue(profile.age);
  elements.viewZodiac.textContent = displayValue(profile.zodiac);
  elements.viewQQ.textContent = displayValue(profile.qq);
  elements.viewContact.textContent = displayValue(profile.contact);
  elements.viewEmail.textContent = displayValue(profile.email);

  applyBackground();
}

function fillForm() {
  elements.inputName.value = profile.name;
  elements.inputGender.value = profile.gender;
  elements.inputAge.value = profile.age;
  elements.inputZodiac.value = profile.zodiac;
  elements.inputQQ.value = profile.qq;
  elements.inputContact.value = profile.contact;
  elements.inputEmail.value = profile.email;
  elements.bgInput.value = '';
}

function setEditMode(editing) {
  isEditing = editing;
  elements.viewMode.hidden = editing;
  elements.editMode.hidden = !editing;
  elements.avatarUploadLabel.hidden = !editing;
  elements.editBtn.hidden = editing;

  if (editing) {
    pendingAvatar = null;
    pendingBackground = null;
    fillForm();
  } else {
    renderView();
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

elements.editBtn.addEventListener('click', () => setEditMode(true));

elements.cancelBtn.addEventListener('click', () => {
  pendingAvatar = null;
  pendingBackground = null;
  setEditMode(false);
});

elements.avatarInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  pendingAvatar = await readFileAsDataURL(file);
  elements.avatarImg.src = pendingAvatar;
});

elements.bgInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  pendingBackground = await readFileAsDataURL(file);
  elements.bgLayer.style.backgroundImage = `url(${pendingBackground})`;
});

elements.resetBgBtn.addEventListener('click', () => {
  pendingBackground = '';
  elements.bgLayer.style.backgroundImage = '';
  elements.bgInput.value = '';
});

elements.profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  profile.name = elements.inputName.value.trim();
  profile.gender = elements.inputGender.value;
  profile.age = elements.inputAge.value;
  profile.zodiac = elements.inputZodiac.value;
  profile.qq = elements.inputQQ.value.trim();
  profile.contact = elements.inputContact.value.trim();
  profile.email = elements.inputEmail.value.trim();

  if (pendingAvatar !== null) {
    profile.avatar = pendingAvatar;
  }
  if (pendingBackground !== null) {
    profile.background = pendingBackground;
  }

  saveProfile();
  setEditMode(false);
});

renderView();
