document.querySelectorAll('.edit-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const eventId = button.dataset.eventId;
        document.getElementById(`edit-row-${eventId}`).classList.toggle('hidden');
    });
});

document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', () => {
        const eventId = button.dataset.eventId;
        document.getElementById(`edit-row-${eventId}`).classList.add('hidden');
    });
});

const toggleAdd = document.getElementById('toggle-add');
const addForm = document.getElementById('add-form');
toggleAdd.addEventListener('click', () => {
    addForm.classList.toggle('hidden');
    toggleAdd.textContent = addForm.classList.contains('hidden') ? 'Add Event' : 'Hide Add Event';
});