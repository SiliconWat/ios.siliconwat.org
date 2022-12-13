import { FRONTEND, COHORT } from "/global.mjs";

window.onload = async () => {
    await import(`${COHORT}/components/sw-header/element.mjs`);
    await import(`${COHORT}/components/sw-footer/element.mjs`);

    await import(`${FRONTEND}/components/sw-main/sw-learn/element.mjs`);
    await import(`${FRONTEND}/components/sw-main/sw-practice/element.mjs`);
    await import(`${FRONTEND}/components/sw-main/sw-review/element.mjs`);
    await import(`${FRONTEND}/components/sw-main/sw-home/element.mjs`);
    await import(`${FRONTEND}/components/sw-main/element.mjs`);

    await import(`${FRONTEND}/components/sw-progress/element.mjs`);
    await import(`${FRONTEND}/components/sw-music/element.mjs`);

    const { BACKGROUND, getGitHub } = await import(`${FRONTEND}/global.mjs`);
    if (!window.TESTING) window.clearCache();
    const github = await getGitHub();
    
    await document.querySelector('sw-main').render(github);
    document.documentElement.style.backgroundImage = BACKGROUND;
    document.body.style.display = 'flex';
    await document.querySelector('sw-header').render(github);
    await document.querySelector('sw-progress').render(github);
};

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-K3RK0J61TG');