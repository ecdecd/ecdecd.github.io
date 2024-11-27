//所有选项编码
const partsOptions = {
    brows: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    eyes: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    mouth: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    hair: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    tail: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    top: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    coat: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    pants: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    shoes: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    socks:  Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    gloves: Array.from({length: 118}, (_, i) => String(i + 1).padStart(3, '0')),
    glasses: ['012', '014', '030', '035', '040', '041', '014', '054', '059', '060', '063', '067', '068', '072', '073', '098', '105', '116'],
    head: ['001', '004'],
    face: ['002'],
    neck: ['001', '002', '003'],
    ear: ['001'],
    back: ['001'],
    emoji: ['001'],
    ground: ['001'],
    env: ['001'],
};

//中间的选项分类条左右滚动按钮
const scrollContainer = (direction) => {
    const container = document.querySelector('.controls-choices');
    const scrollAmount = document.querySelector('main').offsetWidth - 80;
    const newScrollLeft = container.scrollLeft + (scrollAmount * direction);
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const targetScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
    
    container.scrollTo({
        top: 0,
        left: targetScrollLeft,
        behavior: 'smooth'
    });
};

//中间的选项分类条
const generateControlHTML = (part, options) => {
    return `<div class="control ${part}-control" style="display: none;">
			<div class="choice" onclick="hideAllParts('${part}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 12 12"><path style="fill:none;stroke:#000;stroke-width:.6;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="M8.828 8.978a4.003 4.003 0 0 1-5.656 0 4.003 4.003 0 0 1 0-5.657 4.003 4.003 0 0 1 5.656 0 4.003 4.003 0 0 1 0 5.657zM11 1 1 11.15"/></svg>
            </div>
			${options.map(option => `<div class="choice" onclick="togglePart('${part}${option}')">${option}</div>`).join('')}
		</div>`;
};

const controlsContainer = document.querySelector('.controls');

for (const [part, options] of Object.entries(partsOptions)) {
    controlsContainer.insertAdjacentHTML('beforeend', generateControlHTML(part, options));
}

document.getElementById('outfitContainer').innerHTML += Array.from({
    length: 118
}, (_, i) => {
    const outfitNumber = String(i + 1).padStart(3, '0');
    return `<div class="choice" onclick="setOutfit('outfit${outfitNumber}')">${outfitNumber}</div>`;
}).join('');

const selectedParts = Object.fromEntries(Object.keys(partsOptions).map(part => [part, null]));

const outfitSettings = {};
for (let i = 1; i <= 118; i++) {
    const outfitKey = `outfit${String(i).padStart(3, '0')}`;
    // 过滤掉不在套装内的部件
    const filteredPartsOptions = Object.keys(partsOptions).filter(part => !['emoji', 'ground', 'env'].includes(part));
    outfitSettings[outfitKey] = Object.fromEntries(filteredPartsOptions.map(part => [part, [`${part}${String(i).padStart(3, '0')}`]]));
}

function showControl(part) {
    document.querySelectorAll('.control').forEach(control => {
        control.style.display = control.classList.contains(part + '-control') ? 'grid' : 'none';
    });
    document.querySelectorAll('.choose-control').forEach(button => {
        button.classList.toggle('controls-highlight', button.onclick.toString().includes(part));
    });
}

function setOutfit(outfit) {
    resetAll();
    displayOutfit(outfit);
}

//套装选项
function displayOutfit(outfit) {
    for (const [className, partIds] of Object.entries(outfitSettings[outfit])) {
        partIds.forEach(id => {
            const partElement = document.getElementById(id);
            partElement && (partElement.style.display = 'block');
            selectedParts[className] = partIds[0];
        });
    }
    activeHighlight();
}

function togglePart(partId) {
    const className = partId.slice(0, -3);
    const selectedPart = document.getElementById(partId);
    if (selectedPart) {
        const isVisible = selectedPart.style.display === 'block';
        selectedPart.style.display = isVisible ? 'none' : 'block';
        selectedParts[className] = isVisible ? null : partId;
        if (!isVisible) hideOtherParts(className, partId);
    }
    activeHighlight();
}

function hideAllParts(part) {
    document.querySelectorAll(`.${part} > g`).forEach(part => part.style.display = 'none');
    activeHighlight();
}

//全清特供的隐藏高亮
function hideAllPartsEx(part) {
    document.querySelectorAll(`.${part} > g`).forEach(part => part.style.display = 'none');
    const activeElements = document.querySelectorAll('.choice-active');
    activeElements.forEach(element => {
        element.classList.remove('choice-active');
    });
    const choices = document.querySelectorAll('div[onclick^="hideAllParts("]');
    choices.forEach(choice => {
        choice.classList.add('choice-active');
    });
}

function hideOtherParts(className, activePartId) {
    document.querySelectorAll(`.${className} > g`).forEach(part => {
        if (part.id !== activePartId) part.style.display = 'none';
    });
}

//选中选项的高亮
function activeHighlight() {
    let allHidden = true;
    Object.keys(partsOptions).forEach(prefix => {
        for (let i = 1; i <= 118; i++) {
            let paddedIndex = i.toString().padStart(3, '0');
            let element = document.getElementById(prefix + paddedIndex);
            let choice = document.querySelector(`.choice[onclick="togglePart('${prefix}${paddedIndex}')"]`);

            if (element && choice) {
                if (element.style.display === 'block') {
                    choice.classList.add('choice-active');
                    allHidden = false;
                } else {
                    choice.classList.remove('choice-active');
                }
            }
        }
        let hideAllChoice = document.querySelector(`div[onclick="hideAllParts('${prefix}')"]`);
        if (hideAllChoice) {
            if (allHidden) {
                hideAllChoice.classList.add('choice-active');
            } else {
                hideAllChoice.classList.remove('choice-active');
            }
        }
        allHidden = true;
    });
}

function resetAll() {
    Object.keys(selectedParts).forEach(hideAllPartsEx);
}

function changeSkinColor(event) {
    const fillColor = event.target.value;
    document.querySelectorAll('.soma').forEach(element => {
        element.setAttribute('fill', fillColor);
    });
}

function resetSkinColor() {
    const defaultColor = '#fffaf0';
    document.getElementById('skinColor').value = defaultColor;
    changeSkinColor({
        target: {
            value: defaultColor
        }
    });
}

resetSkinColor();
showControl('outfit');
setOutfit('outfit001');

 // 加载中
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loading-screen").style.display = "none";
});