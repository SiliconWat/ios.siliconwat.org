import { FRONTEND } from "/global.mjs";
import template from './template.mjs';

class SwHeader extends HTMLElement {
    #github;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async render(github=this.#github) {
        this.style.opacity = 0;
        this.#github = github;
        await import(`${FRONTEND}/components/sw-header/sw-bar/element.mjs`);
        await this.#render(github);
        this.style.opacity = 1;
    }

    async #render(github) {
        const { getEmoji, getYear, getTerm, getWeeks, getData } = await import(`${FRONTEND}/global.mjs`);
        const y = getYear(github);
        const { cohort, weeks, chapters } = await getData('syllabus', y);
        const fragment = document.createDocumentFragment();

        for (let w = 0; w < weeks.length; w++) {
            const week = weeks[w];
            const li = document.createElement('li');
            const h3 = document.createElement('h3');
            const nav = document.createElement('nav');
            const h2 = document.createElement('h2');
            const em = document.createElement('em');
            const bar = document.createElement('sw-bar');

            const y = getYear(github);
            const term = getTerm(github);
            await this.#getGroup(github, getData, getEmoji, y, term, w + 1, em);
            h2.textContent = getWeeks(term[1], y, cohort[term[1]][term[2]].start[0], cohort[term[1]][term[2]].start[1], w + 1);
            h3.textContent = `Week ${w + 1}`;
            bar.setAttribute("id", w + 1);
            // bar.week = w + 1;
            bar.render(github);

            fragment.append(li);
            li.append(h3, nav);
            nav.append(h2, em, document.createElement('br'), bar, document.createElement('br'));

            if (week.from && week.to) {
                for (let c = week.from - 1; c < week.to; c++) {
                    const chapter = chapters[c];
                    const h4 = document.createElement('h4');
                    const menu = document.createElement('menu');

                    h4.textContent = `Chapter ${c + 1}: ${chapter.title}`;

                    li.append(nav);
                    nav.append(h4, menu);

                    ['Learn', 'Practice', 'Review'].forEach(task => {
                        const taskLowerCase = task.toLowerCase();
                        const li = document.createElement('li');
                        const input = document.createElement('input');
                        const a = document.createElement('a');

                        li.classList.add(taskLowerCase);
                        input.id = `${taskLowerCase}-chapter${c + 1}`;
                        input.setAttribute('data-week', w + 1);
                        input.type = 'checkbox';
                        input.checked = Boolean(Number(localStorage.getItem(input.id)));
                        input.oninput = this.#checkMark.bind(this);
                        a.href = `#${input.id}`;
                        a.textContent = task;

                        menu.append(li);
                        li.append(input, " ", a);
                    });
                }
            }
        }

        this.shadowRoot.querySelector('ul').replaceChildren(fragment);
    }

    async #getGroup(github, getData, getEmoji, y, term, w, element) {
        if (github.login) {
            if (github.student) {
                const groups = await getData('groups', y, {system: term[1], season: term[2], w});
                if (groups.length > 0) {
                    const students = await getData('students');
                    const group = groups.find(group => group.members.includes(github.login));
                    const partners = group.pairs.find(pair => pair.includes(github.login));
                    
                    group.members.sort().forEach(member => {
                        const student = students[member];
                        const cohort = student.cohorts.find(cohort => cohort.year === y && cohort.system === term[1] && cohort.season === term[2]);
                        
                        const a = document.createElement('a');
                        a.target = "_blank";
                        a.href = `https://github.com/${member}`;
                        a.textContent = `@${member}`;

                        if (partners.includes(member)) {
                            a.style.fontWeight = "bold";
                            if (member === github.login) {
                                a.title = "You in your Study Group";
                            } else {
                                a.title = "Your Programming Partner";
                                a.style.textDecorationLine = "underline";
                            }
                        } else {
                            a.title = "Your Study Group Member";
                        }
                        a.title = getEmoji(cohort) + " " + a.title;
                        
                        element.append(a, " ");
                    });
                } else {
                    element.innerHTML = "<strong>TBA:</strong> Group Members and Programming Partner";
                }
            } else {
                element.innerHTML = "Please enroll to be assigned a <strong>Study Group</strong> and <strong>Programming Partner</strong>";
            }
        } else {
            element.innerHTML = "Please <u>enroll</u> and <u>login</u> to see your <strong>Study Group</strong> and <strong>Programming Partner</strong>";
        }
    }

    #checkMark(event) {
        localStorage.setItem(event.target.id, Number(event.target.checked));
        this.shadowRoot.getElementById(event.target.dataset.week).render();
        document.querySelector('sw-progress').render();
        if (event.target.id === window.location.hash.substring(1)) document.querySelector('sw-main').render();
    }

    changeLanguage(event) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("lang", event.target.value);
        window.location.search = searchParams.toString();
        //TODO: change base url to include language
    }
}

customElements.define("sw-header", SwHeader);