const form = document.getElementById('regform');
const fields = {
	name: document.getElementById('name'),
	email: document.getElementById('email'),
	password: document.getElementById('password'),
	confirmPassword: document.getElementById('confirm-password'),
	gender: document.getElementById('gender'),
	dob: document.getElementById('dob'),
	country: document.getElementById('country'),
	phone: document.getElementById('phone'),
	bio: document.getElementById('bio')
};
const controls = form.querySelectorAll('input, select, textarea');
const errors = {
	name: document.getElementById('nameError'),
	email: document.getElementById('emailError'),
	password: document.getElementById('passwordError'),
	confirmPassword: document.getElementById('confirmError'),
	gender: document.getElementById('genderError'),
	dob: document.getElementById('dobError'),
	country: document.getElementById('countryError'),
	phone: document.getElementById('phoneError'),
	bio: document.getElementById('bioError')
};
const successMessage = document.getElementById('successMsg');
const memberList = document.getElementById('memberList');
const memberCounter = document.getElementById('count');
const darkModeButton = document.getElementById('theme');

console.log('Registration form:', form);
console.log('Form controls:', controls);
console.log('Field references:', fields);
console.log('Field error elements:', errors);
console.log('Success message:', successMessage);
console.log('Member list:', memberList);
console.log('Member counter:', memberCounter);
console.log('Dark Mode button:', darkModeButton);

const validators = {
	name: () => fields.name.value.trim().length >= 2 || 'Enter your full name (at least 2 characters).',
	email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()) || 'Enter a valid email address.',
	password: () => fields.password.value.length >= 8 || 'Use at least 8 characters for your password.',
	confirmPassword: () => fields.confirmPassword.value === fields.password.value && fields.confirmPassword.value !== '' || 'Passwords must match.',
	gender: () => fields.gender.value !== '' || 'Select a gender option.',
	dob: () => {
		if (!fields.dob.value) return 'Enter your date of birth.';
		const birthDate = new Date(`${fields.dob.value}T00:00:00`);
		return (!Number.isNaN(birthDate.getTime()) && birthDate <= new Date()) || 'Enter a valid date that is not in the future.';
	},
	country: () => fields.country.value.trim() !== '' || 'Enter your country.',
	phone: () => {
		const digits = fields.phone.value.replace(/\D/g, '');
		return /^[+\d()\s-]+$/.test(fields.phone.value) && digits.length >= 7 && digits.length <= 15 || 'Enter a valid phone number (7 to 15 digits).';
	},
	bio: () => fields.bio.value.trim().length >= 10 || 'Tell us a little more (at least 10 characters).'
};

function validateField(fieldName) {
	const result = validators[fieldName]();
	const isValid = result === true;
	errors[fieldName].textContent = isValid ? '' : result;
	fields[fieldName].classList.toggle('invalid', !isValid);
	fields[fieldName].setAttribute('aria-invalid', String(!isValid));
	return isValid;
}

function updateMemberCount() {
	const members = memberList.querySelectorAll('.member-item');
	memberCounter.textContent = String(members.length);
	const emptyNote = memberList.querySelector('.empty');
	if (emptyNote) emptyNote.classList.toggle('hidden', members.length > 0);
}

function addMember() {
	const item = document.createElement('li');
	item.className = 'member-item';

	const info = document.createElement('div');
	info.className = 'info';
	const name = document.createElement('strong');
	name.textContent = fields.name.value.trim();
	const details = document.createElement('span');
	details.textContent = `${fields.email.value.trim()} | ${fields.country.value.trim()}`;
	info.append(name, details);

	const removeButton = document.createElement('button');
	removeButton.type = 'button';
	removeButton.className = 'remove';
	removeButton.textContent = 'Remove';
	removeButton.setAttribute('aria-label', `Remove ${fields.name.value.trim()}`);
	removeButton.addEventListener('click', () => {
		item.remove();
		updateMemberCount();
	});

	item.append(info, removeButton);
	memberList.append(item);
	updateMemberCount();
}

controls.forEach((control) => {
	const fieldName = Object.keys(fields).find((key) => fields[key] === control);
	const eventName = control.tagName === 'SELECT' ? 'change' : 'input';
	control.addEventListener(eventName, () => {
		successMessage.classList.add('hidden');
		if (fieldName) validateField(fieldName);
		if (fieldName === 'password' && fields.confirmPassword.value) validateField('confirmPassword');
	});
});

form.addEventListener('submit', (event) => {
	event.preventDefault();
	successMessage.classList.add('hidden');

	const isFormValid = Object.keys(fields).map(validateField).every(Boolean);
	if (!isFormValid) {
		const firstInvalidField = form.querySelector('.invalid');
		if (firstInvalidField) firstInvalidField.focus();
		return;
	}

	addMember();
	form.reset();
	Object.keys(fields).forEach((fieldName) => {
		errors[fieldName].textContent = '';
		fields[fieldName].classList.remove('invalid');
		fields[fieldName].removeAttribute('aria-invalid');
	});
	successMessage.textContent = 'Member registered successfully.';
	successMessage.classList.remove('hidden');
});

darkModeButton.addEventListener('click', () => {
	const isDarkMode = document.body.classList.toggle('dark');
	darkModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
	darkModeButton.setAttribute('aria-pressed', String(isDarkMode));
});

darkModeButton.setAttribute('aria-pressed', String(document.body.classList.contains('dark')));
updateMemberCount();
