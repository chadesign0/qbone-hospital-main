const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#all-menu');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = dialog.querySelector('.dialog-content');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '전체 메뉴 열기'); }
menuButton.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? '전체 메뉴 닫기' : '전체 메뉴 열기'); });
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
function openDialog(title) { closeMenu(); dialogContent.replaceChildren(); const heading = document.createElement('h2'); heading.id = 'dialog-title'; heading.textContent = title; dialogContent.append(heading); dialog.showModal(); return dialogContent; }
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
function addPhone(container) { const phone = document.createElement('a'); phone.className = 'dialog-phone'; phone.href = 'tel:0222348580'; phone.textContent = '02.2234.8580'; container.append(phone); }
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { const name = button.dataset.service; const content = openDialog(name); const text = document.createElement('p'); text.textContent = ['온라인상담', '온라인예약'].includes(name) ? '진료 상담과 예약은 대표전화로 문의해 주세요. 온라인 연결 주소는 준비 중입니다.' : `${name}의 상세 페이지는 준비 중입니다. 문의 사항은 큐본병원 대표전화로 안내해 드립니다.`; content.append(text); addPhone(content); }));
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => { const content = openDialog(button.dataset.title); const img = document.createElement('img'); img.src = button.dataset.image; img.alt = button.dataset.title; content.append(img); }));
const centerDescriptions = { '특화치료': '정확한 진단을 바탕으로 환자에게 맞는 치료 방법을 함께 선택합니다.', '관절센터': '관절의 통증을 세심하게 살피고 건강한 일상을 되찾도록 돕습니다.', '척추센터': '척추의 통증 원인을 확인하고 상태에 맞는 치료를 계획합니다.', '비수술센터': '환자의 상태에 맞는 비수술 치료와 회복을 위한 재활을 연결합니다.' };
document.querySelectorAll('[data-center-detail]').forEach(button => button.addEventListener('click', () => { const name = button.dataset.centerDetail; const content = openDialog(name); const img = document.createElement('img'); img.src = button.querySelector('.center-photo').getAttribute('src'); img.alt = name; img.className = 'detail-center-image'; const p = document.createElement('p'); p.textContent = centerDescriptions[name] + ' 자세한 진료 안내는 대표전화로 문의해 주세요.'; content.append(img, p); addPhone(content); }));
document.querySelectorAll('[data-center]').forEach(link => link.addEventListener('click', () => { const card = [...document.querySelectorAll('[data-center-detail]')].find(el => el.dataset.centerDetail === link.dataset.center); if (card) setTimeout(() => card.focus({preventScroll:true}), 400); }));
const doctorStage = document.querySelector('.doctors');
const doctorCards = [...doctorStage.querySelectorAll('.doctor-card')];
const doctorNext = doctorStage.querySelector('.doctor-next');
const doctorButtons = [...doctorStage.querySelectorAll('.doctor-pagination button')];
let doctorIndex = 0;
let doctorTransitioning = false;

async function setDoctor(index) {
  if (doctorTransitioning || index === doctorIndex) return;
  doctorTransitioning = true;
  doctorNext.setAttribute('aria-disabled', 'true');
  doctorStage.setAttribute('aria-busy', 'true');
  const incomingPortrait = doctorCards[index].querySelector('.doctor-portrait');
  incomingPortrait.loading = 'eager';
  await incomingPortrait.decode().catch(() => {});
  doctorIndex = index;
  doctorCards.forEach((card, i) => {
    const position = (i - index + doctorCards.length) % doctorCards.length;
    card.classList.remove('is-active', 'is-next', 'is-last');
    card.classList.add(['is-active', 'is-next', 'is-last'][position]);
    card.setAttribute('aria-hidden', String(position !== 0));
    card.inert = position !== 0;
  });
  doctorButtons.forEach((button, i) => {
    button.classList.toggle('active', i === index);
    button.setAttribute('aria-pressed', String(i === index));
  });
  document.querySelector('#doctor-status').textContent = doctorCards[index].dataset.doctorName + ' 원장';
  const finish = () => {
    doctorTransitioning = false;
    doctorNext.removeAttribute('aria-disabled');
    doctorStage.removeAttribute('aria-busy');
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
  else window.setTimeout(finish, 900);
}

doctorNext.addEventListener('click', () => setDoctor((doctorIndex + 1) % doctorCards.length));
doctorButtons.forEach((button, index) => button.addEventListener('click', () => setDoctor(index)));
const searchSections = [{title:'병원소개',words:'큐본 병원 소개',id:'hospital'},{title:'진료센터',words:'특화 관절 무릎 척추 비수술 치료',id:'centers'},{title:'치료원칙',words:'정밀 진단 단계 재활 회복',id:'principles'},{title:'의료진 소개',words:'전영식 신동협 백운영 원장 의사',id:'doctors'},{title:'병원 공간',words:'둘러보기 휴식 인테리어',id:'space'},{title:'큐본의 새로운 소식',words:'뉴스 방송 언론 TV',id:'news'},{title:'공지사항과 치료후기',words:'공지 소식 후기 수술',id:'community'},{title:'진료시간 및 오시는 길',words:'전화 연락 시간 예약 상담 주차 주소 위치 지도 신당역',id:'contact'}];
document.querySelector('.search-button').addEventListener('click', () => { const content = openDialog('큐본병원 페이지 검색'); const input = document.createElement('input'); input.type = 'search'; input.placeholder = '진료센터, 의료진, 오시는 길 등'; input.setAttribute('aria-label','페이지에서 찾을 내용'); const results = document.createElement('div'); results.className='search-results'; results.setAttribute('aria-live','polite'); function renderResults() { const query=input.value.trim().toLowerCase(); results.replaceChildren(); const matches=searchSections.filter(section => (section.title+' '+section.words).toLowerCase().includes(query)); if(!matches.length){const p=document.createElement('p');p.textContent='일치하는 항목이 없습니다.';results.append(p);} matches.forEach(section => { const link=document.createElement('a');link.href='#'+section.id;link.textContent=section.title+' →';link.addEventListener('click',()=>dialog.close());results.append(link); }); } input.addEventListener('input',renderResults); content.append(input,results);renderResults();input.focus(); });
const backTop = document.querySelector('.back-top');
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
function updateScrollState() {
  header.classList.toggle('is-scrolled', hero.getBoundingClientRect().bottom <= 0);
  backTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('pageshow', updateScrollState);
window.addEventListener('resize', updateScrollState);
updateScrollState();
