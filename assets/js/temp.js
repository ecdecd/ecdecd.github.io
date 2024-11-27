const eleData = {
    "001": { cn: '氢', la: 'Hydrogenium', symb: "H" },
    "002": { cn: '氦', la: 'Helium', symb: "He" },
    "003": { cn: '锂', la: 'Lithium', symb: "Li" }

};

// 字体颜色对应关系
const fontData = {
    "002": { color: 'blue', word: '002 - He - 氦' },
    "001": { color: 'red', word: '001 - H - 氢' },
    "003": { color: 'green', word: '003' }
};

// 动态内容替换函数
function replaceContent() {
    const contentElement = document.getElementById('content');
    let html = contentElement.innerHTML;

    // 替换color
    html = html.replace(/{{c\|(\d+)\|(.+?)}}/g, (match, colorCode, text) => {
        const fontInfo = fontData[colorCode] || { color: 'black', word: '' }; // 默认颜色
        const tooltipText = fontInfo.word || ''; // 获取对应的词语内容
        return `<span class="colored" style="color:${fontInfo.color}" data-tooltip="${tooltipText}">${text}</span>`;
    });

    // 替换info
    html = html.replace(/{{info\|(\d{3})}}/g, (match, code) => {
        const eleInfo = eleData[code];
        return `<table class="info-table">
<tr>
<th class="title-cell" colspan="6">${eleInfo.cn}</th>
<th class="info-pc-cell" rowspan="3">No：${code}.</th>
</tr>
<tr>
<th class="info-mobile-cell" colspan="6">No：${code}.　${eleInfo.symb}</th>
</tr>  
<tr>
<td colspan="6">${eleInfo.la}</th>
</tr>    
<tr>
<td colspan="6">Hydrogen　水素</td>
<th class="info-pc-cell">${eleInfo.symb}</th>
</tr>
<tr>
<th class="info-pc-cell" colspan="2">旧称</th>
<th class="info-pc-cell" colspan="2">别称</th>
<th class="info-pc-cell" colspan="2">昵称</th>
<th id="info-more" rowspan="15">
    <div class="info-imgbox">
    <div class="info-imgbox-images pixel">
        <img src="assets/img/pix/004.png" alt="Image 1" class="active">
        <img src="assets/img/pix/033.png" alt="Image 2">
        <img src="assets/img/pix/013.png" alt="Image 3">
    </div>
    <div class="info-imgbox-change">
        <button class="info-img-prev" onclick="changeImage(-1)">&#10094;</button>
        <p class="imgtext">占位的4</p>
        <p class="imgtext hide">占位33</p>
        <p class="imgtext hide">占位13</p>
    <button class="info-img-next" onclick="changeImage(1)">&#10095;</button>
    </div>
    </div>
</th>
</tr>
<tr>
<th class="info-mobile-cell" colspan="2">旧称</th>
<th class="info-mobile-cell" colspan="2">别称</th>
<th class="info-mobile-cell" colspan="2">昵称</th>
</tr>
<tr>
<td colspan="2">轻</td><td colspan="2">Hydro</td><td colspan="2">先生</td>
</tr>

<tr>
<th colspan="3">非识别编码</th><th colspan="3">住址</th>
</tr>
<tr>
<td colspan="3">1s1</td><td colspan="3">第一周期第一主族</td>
</tr>
<tr>
<th colspan="2">体重</th><th colspan="4">所属组织</th>
</tr>
<tr>
<td colspan="2">1</td><td colspan="4">s区非金属</td>
</tr>
<tr>
<th colspan="2">发色</th><th colspan="2">瞳色</th><th colspan="2">身高</th>
</tr>
<tr>
<td colspan="2">白</td><td colspan="2">【】</td><td colspan="2">178cm</td>
</tr>
<tr>
<th colspan="2">常用武器</th><th colspan="2">代表植物</th><th colspan="2">表情符号</th>
</tr>
<tr>
<td colspan="2">kkk</td><td colspan="2">kkk</td><td colspan="2">kkk</td>
</tr>
<tr>
<th>稳定</th><th>耐久</th><th>敏捷</th><th>亲和</th><th>爆发</th><th>制约</th>
</tr>
<tr>
<td>xx</td><td>xx</td><td>xx</td><td>xx</td><td>xx</td><td>xx</td>
</tr>
<tr>
<th colspan="6">主要关联元素</th>
</tr>
<tr>
<td colspan="6">氦，碳，氮，氧，氟</td>
</tr>
</table>`;
    });

    // 替换折叠
    const foldRegex = /\{\{fold\|([^\|]+)\|([^\|]+)\|([^\}]+)\}\}/gms;

    html = html.replace(foldRegex, (match, before, after, text) => {
        const foldId = 'fold-' + Math.random().toString(36).substring(2, 15); // 生成唯一ID
        return `
<div id="${foldId}" class="fold">
<span class="fold-text" onclick="foldText('${foldId}', '${before}', '${after}')">${before}</span>
    <div class="fold-content" id="${foldId}-content">${text}</div>
</div>
`;
    });

    // 替换story
    let storiesCounter = 0;

    html = html.replace(/{{story(.*?)}}/gs, (match, content) => {
        const stories = content.split(/\|/).slice(1);
        const tabs = stories.map((story, index) => `
<div class="tab ${index === 0 ? 'active' : ''}" id="story${storiesCounter}-${index}">${story}</div>
`).join('');

        const buttons = stories.map((_, index) => `
<button class="${index === 0 ? 'active-button' : ''}" onclick="showTab(${storiesCounter}, ${index})">摘选${index + 1}</button>
`).join('');

        storiesCounter++;
        return `<div class="story">
<div class="story-buttons">${buttons}</div>
<div>${tabs}</div>
</div>`;
    });

    contentElement.innerHTML = html;
}

window.foldText = function (foldId, before, after) {
    const foldTextElement = document.querySelector(`#${foldId} .fold-text`);
    const foldContentElement = document.querySelector(`#${foldId}-content`);

    if (foldTextElement.textContent === before) {
        foldTextElement.textContent = after;
        foldContentElement.classList.add('active');
    } else {
        foldTextElement.textContent = before;
        foldContentElement.classList.remove('active');
    }
};

function showTab(groupIndex, tabIndex) {
const tabs = document.querySelectorAll('[id^="story' + groupIndex + '"]');
tabs.forEach(function (tab) {
tab.classList.remove('active');
});

const tabShow = document.getElementById(`story${groupIndex}-${tabIndex}`);
if (tabShow) {
tabShow.classList.add('active');
}

const buttons = document.querySelectorAll(`.story button`);
const activeButton = [...buttons].find(button =>
button.onclick.toString().includes(`showTab(${groupIndex}, ${tabIndex})`)
);

buttons.forEach(function (button) {
if (button.onclick.toString().includes(`showTab(${groupIndex},`)) {
    button.classList.remove('active-button');
}
});


if (activeButton) {
activeButton.classList.add('active-button');
}
}

replaceContent();

let currentInfoImg = 0;

function changeImage(direction) {
    const images = document.querySelectorAll('.info-imgbox-images img');
    const imgtexts = document.querySelectorAll('.info-imgbox-change .imgtext');

    currentInfoImg = (currentInfoImg + direction + images.length) % images.length;

    images.forEach(img => img.classList.remove('active'));
    imgtexts.forEach(desc => desc.classList.add('hide'));

    images[currentInfoImg].classList.add('active');
    imgtexts[currentInfoImg].classList.remove('hide');
}

document.addEventListener("DOMContentLoaded", () => {
    changeImage(0);
});


function updateInfoTable() {
    const th = document.getElementById('info-more');
    if (window.innerWidth > 720) {
        th.setAttribute('rowspan', '15');
        th.removeAttribute('colspan');
    } else {
        th.setAttribute('colspan', '6');
        th.removeAttribute('rowspan');
    }
}

document.addEventListener('DOMContentLoaded', updateInfoTable);
window.addEventListener('resize', updateInfoTable);