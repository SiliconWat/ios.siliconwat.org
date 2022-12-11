const template = document.createElement("template");
// Reference: https://codepen.io/danmindru/pen/pwBGbp

template.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
        <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="wavies">
            <use xlink:href="#gentle-wave" x="50" y="0" fill="#2C8C99" />
            <use xlink:href="#gentle-wave" x="50" y="3" fill="#326771" />
            <use xlink:href="#gentle-wave" x="50" y="6" fill="#28464B" />
        </g>
    </svg>
    <slot></slot>
    <footer>
        <p>If you’re already a Medium member or don't like Medium, please consider <strong>donating</strong> to <a href="https://github.com/sponsors/SiliconWat">@SiliconWat</a> to receive the same <strong>Udemy discount</strong>!</p>
    </footer>
`;

export default template;