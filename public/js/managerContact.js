document.querySelectorAll('.save-btn[data-id]').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.dataset.id;
        document.getElementById(`edit-block-${id}`).classList.toggle('hidden');
    });
});