const form = document.querySelector('#signupForm');
const toast = document.querySelector('#toast');
const heading = form.querySelector('h1');
const headingContent = document.querySelector('#headingContent');

function showToast(title = 'Form published', detail = 'Your form is live and ready to collect leads.') {
  toast.querySelector('strong').textContent = title;
  toast.querySelector('small').textContent = detail;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

headingContent.addEventListener('input', () => { heading.textContent = headingContent.value || 'Untitled heading'; });
heading.addEventListener('input', () => { headingContent.value = heading.textContent; });

document.querySelectorAll('[data-size]').forEach((button) => button.addEventListener('click', () => {
  button.parentElement.querySelector('.active').classList.remove('active');
  button.classList.add('active');
  heading.style.fontSize = { h2: '22px', h1: '27px', display: '34px' }[button.dataset.size];
}));

document.querySelectorAll('[data-align]').forEach((button) => button.addEventListener('click', () => {
  button.parentElement.querySelector('.active').classList.remove('active');
  button.classList.add('active');
  heading.style.textAlign = button.dataset.align;
}));

function newBlock(type) {
  const block = document.createElement('div');
  block.className = 'editable-block';
  const templates = {
    heading: '<h2 contenteditable="true">Your new heading</h2>',
    text: '<p contenteditable="true">Add supporting copy here.</p>',
    name: '<label>Full name<input placeholder="Your name" /></label>',
    email: '<label>Email address<input type="email" placeholder="you@company.com" /></label>',
    phone: '<label>Phone number<input type="tel" placeholder="(555) 000-0000" /></label>',
    company: '<label>Company<input placeholder="Your company" /></label>',
    dropdown: '<label>Choose an option<select><option>Select one</option><option>Option one</option></select></label>',
    checkbox: '<label><input style="display:inline;width:auto;height:auto;margin-right:8px" type="checkbox" />I agree to receive updates</label>',
    date: '<label>Date<input type="date" /></label>',
    message: '<label>Message<textarea style="height:76px;padding-top:10px" placeholder="Type your message"></textarea></label>',
    divider: '<hr style="border:0;border-top:1px solid #e3e8e4;margin:14px 0">',
    spacer: '<div style="height:28px"></div>',
    image: '<div style="height:100px;background:#eef4ef;border-radius:6px;display:grid;place-items:center;color:#789084">Image placeholder</div>'
  };
  block.innerHTML = templates[type] || templates.text;
  form.insertBefore(block, form.querySelector('.submit-button'));
  showToast('Block added', 'Your new block is ready to customize.');
}

document.querySelectorAll('[data-type]').forEach((button) => {
  button.draggable = true;
  button.addEventListener('click', () => newBlock(button.dataset.type));
  button.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', button.dataset.type));
});
form.addEventListener('dragover', (event) => event.preventDefault());
form.addEventListener('drop', (event) => { event.preventDefault(); newBlock(event.dataTransfer.getData('text/plain')); });

document.querySelector('#blockSearch').addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase();
  document.querySelectorAll('.block').forEach((block) => { block.hidden = !block.textContent.toLowerCase().includes(term); });
});

document.querySelector('#publishButton').addEventListener('click', () => showToast());
document.querySelector('#previewButton').addEventListener('click', () => {
  document.body.classList.toggle('preview-mode');
  showToast('Preview ready', 'This is how your visitors will see the form.');
});
document.querySelector('#quickAdd').addEventListener('click', () => newBlock('text'));
document.querySelector('#deleteSelected').addEventListener('click', () => {
  const selected = form.querySelector('.selected');
  if (selected) { selected.remove(); showToast('Block deleted', 'The selected block has been removed.'); }
});
document.querySelector('.duplicate').addEventListener('click', () => {
  const selected = form.querySelector('.selected');
  const clone = selected.cloneNode(true);
  clone.classList.remove('selected'); clone.querySelector('.block-tools')?.remove(); selected.after(clone);
  showToast('Block duplicated', 'A copy was added below the original.');
});
document.querySelector('.delete').addEventListener('click', () => document.querySelector('#deleteSelected').click());

form.addEventListener('submit', (event) => { event.preventDefault(); showToast('You’re on the list!', 'Check your inbox for a welcome email.'); form.reset(); });
