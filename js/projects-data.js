const projectsData = [
    {
        name: 'Project Name One',
        field: 'Web Development',
        description: 'Short description of what this project does and the problem it solves.',
        stack: ['React', 'Node.js', 'MongoDB'],
        image: '',
        link: '#'
    },
    {
        name: 'Project Name Two',
        field: 'QA',
        description: 'Short description of the testing/QA work done on this project.',
        stack: ['Selenium', 'Jest', 'Postman'],
        image: '',
        link: '#'
    },
    {
        name: 'Project Name Three',
        field: 'User Interface',
        description: 'Short description of the UI design work for this project.',
        stack: ['Figma', 'Tailwind CSS'],
        image: '',
        link: '#'
    },
    {
        name: 'Project Name Four',
        field: 'User Experience',
        description: 'Short description of the UX research/design process for this project.',
        stack: ['Figma', 'User Research'],
        image: '',
        link: '#'
    }
];

function getTechTagClass(tech) {
    const key = tech.toLowerCase().replace(/[^a-z0-9]/g, '');

    const map = {
        html: 'tag--html',
        css: 'tag--css',
        javascript: 'tag--js',
        js: 'tag--js',
        typescript: 'tag--css',
        react: 'tag--react',
        reactjs: 'tag--react',
        reactnative: 'tag--react',
        tailwind: 'tag--tailwind',
        tailwindcss: 'tag--tailwind',
        java: 'tag--java',
        python: 'tag--python',
        cpp: 'tag--cpp',
        c: 'tag--c',
        mongodb: 'tag--mongodb',
        sql: 'tag--sql',
        vscode: 'tag--vscode',
        git: 'tag--git',
        github: 'tag--github',
        figma: 'tag--figma',
        sketch: 'tag--sketch',
        shopify: 'tag--shopify',
        nodejs: 'tag--nodejs',
        node: 'tag--nodejs',
        selenium: 'tag--selenium',
        jest: 'tag--jest',
        postman: 'tag--postman',
        userresearch: 'tag--userresearch'
    };

    return map[key] || 'tag--default';
}
