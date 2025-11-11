/**
 * Home Page Content Rendering
 *
 * Populates capabilities, process, experience highlights, skills preview,
 * and testimonials on the landing page.
 *
 * Dependencies: core/data-loader.js
 */

function truncateText(text, limit = 180) {
    if (!text || text.length <= limit) return text;
    const truncated = text.slice(0, limit);
    const lastSpace = truncated.lastIndexOf(' ');
    return `${truncated.slice(0, lastSpace > -1 ? lastSpace : limit)}…`;
}

function initCapabilitiesGrid() {
    const grid = document.querySelector('.capabilities-grid');
    if (!grid) return;

    const capabilities = dataLoader.getCapabilities();
    if (!capabilities || capabilities.length === 0) return;

    grid.innerHTML = capabilities.map(capability => {
        const pointsHTML = (capability.points || [])
            .map(point => `<li>${point}</li>`)
            .join('');

        return `
            <article class="card capability-card hover-lift" data-capability="${capability.id}">
                ${capability.label ? `<span class="capability-pill">${capability.label}</span>` : ''}
                <h3>${capability.title}</h3>
                <p>${capability.description}</p>
                ${pointsHTML ? `<ul class="capability-points">${pointsHTML}</ul>` : ''}
            </article>
        `;
    }).join('');
}

function initProcessSteps() {
    const stepsContainer = document.querySelector('.process-steps');
    if (!stepsContainer) return;

    const processSteps = dataLoader.getProcess();
    if (!processSteps || processSteps.length === 0) return;

    stepsContainer.innerHTML = processSteps.map(step => `
        <article class="card process-step" data-process-step="${step.id}">
            ${step.step ? `<span class="process-step-number">${step.step}</span>` : ''}
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            ${step.meta ? `<span class="process-meta">${step.meta}</span>` : ''}
        </article>
    `).join('');
}

function initExperienceHighlights() {
    const experienceGrid = document.querySelector('.experience-grid');
    if (!experienceGrid) return;

    const experience = dataLoader.getExperience();
    if (!experience || experience.length === 0) return;

    const featured = experience.filter(entry => entry.featured).slice(0, 3);
    if (featured.length === 0) return;

    experienceGrid.innerHTML = featured.map(entry => `
        <article class="card experience-card hover-lift" data-experience="${entry.company.replace(/\s+/g, '-').toLowerCase()}">
            ${entry.dates ? `<span class="experience-dates">${entry.dates}</span>` : ''}
            <h3>${entry.company}</h3>
            ${entry.title ? `<span class="experience-role">${entry.title}</span>` : ''}
            ${entry.description ? `<p>${truncateText(entry.description, 240)}</p>` : ''}
        </article>
    `).join('');
}

function initSkillsPreview() {
    const skillsContainer = document.querySelector('.skills-pill-group');
    if (!skillsContainer) return;

    const skillsData = dataLoader.getSkills();
    if (!skillsData || skillsData.length === 0) return;

    const collectedSkills = [];

    skillsData.forEach(category => {
        if (Array.isArray(category.skills)) {
            category.skills.forEach(skill => {
                collectedSkills.push({
                    id: `${category.title.toLowerCase().replace(/\s+/g, '-')}-${skill.toLowerCase().replace(/\s+/g, '-')}`,
                    label: skill
                });
            });
        }

        if (category.skillLevels) {
            Object.entries(category.skillLevels).forEach(([level, skills]) => {
                skills.forEach(skill => {
                    collectedSkills.push({
                        id: `${level.toLowerCase()}-${skill.toLowerCase().replace(/\s+/g, '-')}`,
                        label: `${skill} · ${level}`
                    });
                });
            });
        }
    });

    const uniqueSkills = [];
    const seen = new Set();

    collectedSkills.forEach(skill => {
        if (!seen.has(skill.label)) {
            seen.add(skill.label);
            uniqueSkills.push(skill);
        }
    });

    const spotlight = uniqueSkills.slice(0, 18);
    skillsContainer.innerHTML = spotlight.map(skill => `
        <span class="skill-pill" data-skill-id="${skill.id}">${skill.label}</span>
    `).join('');
}

function initTestimonialsGrid() {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (!testimonialsGrid) return;

    const testimonials = dataLoader.getTestimonials();
    if (!testimonials || testimonials.length === 0) return;

    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
        <article class="card testimonial-card hover-lift" data-testimonial="${testimonial.id}">
            <p class="testimonial-quote">“${testimonial.quote}”</p>
            <div class="testimonial-footer">
                <span class="testimonial-name">${testimonial.name}</span>
                <span class="testimonial-role">${testimonial.role}${testimonial.company ? ` — ${testimonial.company}` : ''}</span>
            </div>
        </article>
    `).join('');
}
