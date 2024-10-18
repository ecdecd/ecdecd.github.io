//黑暗
if (localStorage.getItem('darkMode') === 'true') {
  $('body').css('transition', 'none');
  $('body').addClass('dark');
  setTimeout(function () {
      $('body').css('transition', 'background-color 0.6s, color 0.6s, border 0.6s');
  }, 0);
}

$('#darkButton').on('click', function () {
  $('body').toggleClass('dark');
  const isDarkMode = $('body').hasClass('dark');
  localStorage.setItem('darkMode', isDarkMode);
});


//侧边栏折叠
// 首次加载时，更新所有模态框位置
document.addEventListener('DOMContentLoaded', function () {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const sidebar = document.getElementById('sidebar');
    updateModalStyle(modal, sidebar.classList.contains('collapsed'));
  });
});

// 切换侧边栏状态并更新模态框
document.getElementById('sidebar-toggle').addEventListener('click', function () {
  const sidebar = document.getElementById('sidebar');
  const isCollapsed = sidebar.classList.toggle('collapsed');

  // 更新模态框位置和宽度
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    updateModalStyle(modal, isCollapsed);
  });
});

// 打开模态框
document.querySelectorAll('.modal-button').forEach((button) => {
  button.addEventListener('click', function () {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    
    if (modal) {
      modal.style.display = 'block';
      
      // 为按钮添加特殊样式
      document.querySelectorAll('.modal-button').forEach(btn => btn.classList.remove('active')); // 移除其他按钮的样式
      button.classList.add('active'); // 为当前按钮添加特殊样式
      
      const sidebar = document.getElementById('sidebar');
      updateModalStyle(modal, sidebar.classList.contains('collapsed'));
    }
  });
});

// 关闭模态框
document.querySelectorAll('.modal-close').forEach((closeButton) => {
  closeButton.addEventListener('click', function () {
    const modal = closeButton.closest('.modal');
    modal.style.display = 'none';
    
    // 关闭时移除按钮的特殊样式
    const button = document.querySelector(`.modal-button[data-modal="${modal.id}"]`);
    if (button) {
      button.classList.remove('active');
    }
  });
});

// 关闭模态框：点击模态框外部
window.addEventListener('click', function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    
    // 关闭时移除按钮的特殊样式
    const button = document.querySelector(`.modal-button[data-modal="${event.target.id}"]`);
    if (button) {
      button.classList.remove('active');
    }
  }
});

// 更新模态框样式
function updateModalStyle(modal, isCollapsed) {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 760) {
    modal.style.left = '0';
    modal.style.width = '100%';
  } else {
    modal.style.left = isCollapsed ? '40px' : '250px';
    modal.style.width = isCollapsed ? 'calc(100% - 40px)' : 'calc(100% - 250px)';
  }
}

// 窗口大小改变时，更新模态框样式
window.addEventListener('resize', function () {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const sidebar = document.getElementById('sidebar');
    updateModalStyle(modal, sidebar.classList.contains('collapsed'));
  });
});

//模态框
$(function () {
  $(".modal-button").click(function () {
    const modalId = $(this).data("modal");
    $(".modal").hide();
    $("#" + modalId).show();
  });

  $(".modal-close").click(function () {
    $(".modal").hide();
  });

  $(window).click(function (event) {
    $(".modal").each(function () {
      if ($(event.target).is(this)) {
        $(this).hide();
      }
    });
  });
});


//存档
const slots = 7;
let saves = JSON.parse(localStorage.getItem('saves')) || {};

function renderSlots() {
  const slotsContainer = document.getElementById('slots');
  slotsContainer.innerHTML = '';

  for (let i = 1; i <= slots; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    const save = saves[i] || {
      name: `存档 ${i}`,
      date: null,
      hash: null
    };

    slot.innerHTML = `
        <span class="slot-code">存档位 ${i}</span>
        <span class="slot-name">${save.name}</span>
        <span class="slot-time">${save.date ? new Date(save.date.timestamp).toLocaleString() : ''}</span>
        <div class="slot-buttons">
          <button onclick="saveSlot(${i})"><i class="fa-solid fa-cloud-arrow-up"></i></button>
          <button onclick="loadSlot(${i})" ${!save.date ? 'disabled' : ''}><i class="fa-solid fa-cloud-arrow-down"></i></button>
          <button onclick="deleteSlot(${i})" ${!save.date ? 'disabled' : ''}><i class="fa-solid fa-trash-can"></i></button>
          <button onclick="renameSlot(${i})"><i class="fa-solid fa-file-signature"></i></button>
        </div>
                  `;

    slotsContainer.appendChild(slot);
  }
}

function saveSlot(slotId) {
  const date = {
    timestamp: Date.now()
  };
  const hash = window.story.save();
  saves[slotId] = {
    name: saves[slotId] ?.name || `存档 ${slotId}`,
    date: date,
    hash: hash,
  };
  localStorage.setItem('saves', JSON.stringify(saves));
  renderSlots();
}

function loadSlot(slotId) {
  const save = saves[slotId];
  if (save && save.hash) {
    window.story.restore(save.hash);
    updateBars();
  }
}

function deleteSlot(slotId) {
  if (confirm(`确定要删除 ${saves[slotId].name} 吗？`)) {
    delete saves[slotId];
    localStorage.setItem('saves', JSON.stringify(saves));
    renderSlots();
  }
}

function renameSlot(slotId) {
  const newName = prompt(`请输入存档 ${saves[slotId].name} 的新名称:`, saves[slotId] ?.name || `存档 ${slotId}`);
  if (newName) {
    saves[slotId] = saves[slotId] || {};
    saves[slotId].name = newName;
    localStorage.setItem('saves', JSON.stringify(saves));
    renderSlots();
  }
}

function downloadSaves() {
  const savesJson = JSON.stringify(saves);
  const blob = new Blob([savesJson], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'elecode.save';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importSaves(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedSaves = JSON.parse(e.target.result);
        saves = importedSaves;
        localStorage.setItem('saves', JSON.stringify(saves));
        renderSlots();
        alert('存档导入成功！');
      } catch (error) {
        alert('导入失败：无效的存档文件');
      }
    };
    reader.readAsText(file);
  }
}

renderSlots();


//建立侧边栏血条
$(document.createElement('div'))
  .attr('id', 'states')
  .insertAfter('#sidebar-toggle');

//血条悬浮框定位
$(document).ready(function() {
  function positionBarNumbers() {
      var $sidebar = $('#sidebar');
      var $states = $('#states');
      var $barNumbers = $('#bar-numbers');
      
      var sidebarScrollTop = $sidebar.scrollTop();
      var statesOffset = $states.offset();
      var sidebarOffset = $sidebar.offset();
      
      $barNumbers.css({
          'left': 40,
          'top': 40 - sidebarScrollTop,
      });
  }
  positionBarNumbers();
  $('#sidebar').scroll(positionBarNumbers);
});


//段落渲染为元素
$(window).on('sm.passage.shown', function () {
  $('#states').html(window.story.render("states"));
});

$(window).on('sm.passage.shown', function () {
  $('#assayer').html(window.story.render("assayer"));
});

$(window).on('sm.passage.shown', function () {
  $('#box').html(window.story.render("box"));
});

$(window).on('sm.passage.shown', function () {
  $('#social').html(window.story.render("social"));
});

$(function () {window.story.render("footer");});
