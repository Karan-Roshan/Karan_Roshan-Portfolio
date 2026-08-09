const projectsTableBody = document.getElementById('projectsTableBody');

function formatProjectLink(link) {
    if (!link || link === '#') {
        return '<span class="projects-table-link-empty">—</span>';
    }

    const displayText = link.replace(/^https?:\/\//, '').replace(/\/$/, '');

    return `
        <a href="${link}" target="_blank" rel="noopener" class="projects-table-link">
            ${displayText} <i class="fas fa-arrow-up-right-from-square"></i>
        </a>
    `;
}

if (projectsTableBody && typeof projectsData !== 'undefined') {
    projectsData.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.name}</td>
            <td>${project.field}</td>
            <td>
                <div class="projects-table-stack">
                    ${project.stack.map(tech => `<span class="project-stack-tag ${getTechTagClass(tech)}">${tech}</span>`).join('')}
                </div>
            </td>
            <td class="projects-table-desc">${project.description || '<span class="projects-table-link-empty">—</span>'}</td>
            <td>${formatProjectLink(project.link)}</td>
        `;
        projectsTableBody.appendChild(row);
    });
}
