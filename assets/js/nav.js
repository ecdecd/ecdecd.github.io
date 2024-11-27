const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const toggleThemeButton = document.getElementById('toggleTheme');
const scrollToTopButton = document.getElementById('scrollToTop');
const body = document.body;

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

toggleThemeButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});

scrollToTopButton.addEventListener('click', () => {
  smoothScroll(0);
});

// 平滑滚动到目标链接的自定义函数
function smoothScroll(targetY) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 300; // 滚动持续时间
  let startTime;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutQuad(progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// 缓动函数
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

scrollToTopButton.style.display = 'none';
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) { // 当滚动高度超过300px时显示按钮
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetId = link.getAttribute('href').substring(1);

    const targetElement = document.getElementById(targetId);

    smoothScroll(targetElement.offsetTop);
  });
});

const tips = [
  "需要“查询”之外的“输入”操作视作工具。",
  "没用工具是真的没啥用。那为什么还要放在这里？",
  "和ECD有什么关系呢，小编也很好奇。",
  "真正常用的游戏WIKI根本没有也不需要搁这儿。",
];

window.onload = function() {
  const tip = document.getElementById('tip');
  const randomIndex = Math.floor(Math.random() * tips.length);
  tip.innerText = "TIPS："+tips[randomIndex];
};
