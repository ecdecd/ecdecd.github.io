document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.getElementById('content');
    const contentHTML = contentElement.innerHTML;

    const toggleRegex = /{{toggle\|([^|]*)\|([^|]*)\|([^}]*)}}/g;

    const html = contentHTML.replace(toggleRegex, (match, collapsedText, expandedText, toggleContent) => {
        return `
            <div>
                <span class="toggle-button">${collapsedText}</span>
                <div class="toggle-content">
                    <strong>${expandedText}</strong>
                    <p>${toggleContent}</p>
                </div>
            </div>
        `;
    });

    contentElement.innerHTML = html;

    // 添加点击事件
    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
                button.textContent = button.textContent.replace('折叠', '展开');
            } else {
                content.style.display = 'block';
                button.textContent = button.textContent.replace('展开', '折叠');
            }
        });
    });
});