
(() => {
'use strict';
const $ = (s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const storeKey='icemanCodeLearn.v1';
const defaults={username:'ICEMAN',goal:'Build my first website',courses:[],projects:[],snippets:[],notes:{},labNotes:{},activity:[],streak:0,theme:'dark'};
let state;
try{state={...defaults,...JSON.parse(localStorage.getItem(storeKey)||'{}')}}catch{state={...defaults}}
const save=()=>{try{localStorage.setItem(storeKey,JSON.stringify(state))}catch{};updateStats()};
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2400)}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const languages=[
{name:'HTML',icon:'5',color:'#e84b27',bg:'#511d1b',line:'#91352a',desc:'Build the structure of the web',course:'Learn HTML',lesson:'HTML gives a web page its structure. Start with headings, paragraphs, links, images, and semantic sections.',starter:'<!doctype html>\n<html>\n<body>\n  <h1>Hello, ICEMAN!</h1>\n  <p>My first webpage.</p>\n</body>\n</html>'},
{name:'CSS',icon:'5',color:'#2783f5',bg:'#082c65',line:'#1455a5',desc:'Style your ideas',course:'Learn CSS',lesson:'CSS controls color, spacing, layout, typography, and responsive design. Practice selectors, flexbox, and grid.',starter:'body {\n  background: #061225;\n  color: white;\n  font-family: sans-serif;\n}\nh1 { color: #12d9ff; }'},
{name:'JavaScript',icon:'JS',color:'#f4cb24',bg:'#4b3b06',line:'#8b7112',desc:'Make your websites interactive',course:'Learn JavaScript',lesson:'JavaScript adds behavior to web pages. Learn variables, functions, arrays, events, and DOM updates.',starter:"const button = document.querySelector('button');\nbutton?.addEventListener('click', () => {\n  alert('Hello, ICEMAN!');\n});"},
{name:'Python',icon:'🐍',color:'#5ba2f7',bg:'#092c5d',line:'#1554a3',desc:'Simple. Powerful. Versatile.',course:'Learn Python',lesson:'Python is a beginner-friendly language used for automation, web development, data, and AI. Learn variables, conditions, loops, and functions.',starter:'name = "ICEMAN"\nprint(f"Hello, {name}!")'},
{name:'Other Languages',icon:'•••',color:'#c18aff',bg:'#311064',line:'#6725ad',desc:'Explore more technologies',course:'Explore languages',lesson:'Explore TypeScript, Java, C, C++, PHP, SQL, Bash, and other technologies. Choose based on the project you want to build.',starter:'// Pick a language and start exploring!'}
];
const actions=[
{icon:'‹/›',name:'Code Editor',desc:'Write and run code online',color:'#08796f',view:'editor'},
{icon:'⚗',name:'Coding Labs',desc:'Practice with real projects',color:'#087f99',view:'lab'},
{icon:'✦',name:'AI Assistant',desc:'Get help from Gemini AI',color:'#3823a3',view:'ai'},
{icon:'🏆',name:'Challenges',desc:'Test your skills',color:'#7a5a08',view:'challenges'},
{icon:'▱',name:'My Projects',desc:'Build and manage projects',color:'#07576b',view:'projects'},
{icon:'▤',name:'Saved Snippets',desc:'Save useful code',color:'#672184',view:'snippets'},
{icon:'♧',name:'Developer Tools',desc:'Useful tools for developers',color:'#124f96',tool:'json'},
{icon:'▧',name:'Wallpapers',desc:'Beautiful coding wallpapers',color:'#6426a2',view:'wallpapers'}
];
const labs=[
{name:'Practice Lab',icon:'‹/›',desc:'Write, test and improve your code',color:'#087b69',line:'#0b746c',task:'Write a short HTML page with a heading and paragraph.'},
{name:'Debugging Lab',icon:'🐞',desc:'Find and fix errors',color:'#8b1e4b',line:'#842448',task:'Inspect this JavaScript: const total = 5; console.log(totla); Find the variable name typo.'},
{name:'Web Development Lab',icon:'◎',desc:'Build real websites',color:'#3b20a7',line:'#4333a5',task:'Describe or write a responsive page with a header, main content, and footer.'},
{name:'AI Assistant in Every Lab',icon:'🤖',desc:"Get help when you're stuck",color:'#087da0',line:'#08769b',task:'Write your coding question, then open the AI assistant for guidance.'}
];
function renderDashboard(){
$('#languageGrid').innerHTML=languages.map((l,i)=>`<article class="language-card" style="--cardbg:${l.bg};--cardline:${l.line};--iconbg:${l.color}"><div class="langicon">${l.icon}</div><h3>${l.name}</h3><p>${l.desc}</p><button class="btn small" data-course="${i}">Start Learning →</button></article>`).join('');
$('#actionsGrid').innerHTML=actions.map(a=>`<button class="action-card" data-view="${a.view||''}" ${a.tool?`data-tool="${a.tool}"`:''}><span class="chev">›</span><div class="action-icon" style="--tile:${a.color}">${a.icon}</div><h3>${a.name}</h3><p>${a.desc}</p></button>`).join('');
$('#labsGrid').innerHTML=labs.map((l,i)=>`<article class="lab-card" style="--labbg:${l.color}22;--labline:${l.line}"><div class="action-icon" style="--tile:${l.color}">${l.icon}</div><h3>${l.name}</h3><p>${l.desc}</p><button class="btn small" data-lab="${i}">Start Lab →</button></article>`).join('');
}
function updateStats(){
$('#topUsername').textContent=state.username||'ICEMAN';$('#helloUsername').textContent=state.username||'ICEMAN';$('#usernameInput').value=state.username||'ICEMAN';$('#goalInput').value=state.goal||'';
$('#coursesCount').textContent=state.courses.length;$('#projectsCount').textContent=state.projects.length;$('#streakCount').textContent=state.streak||0;
const p=Math.min(100,Math.round((state.courses.length/5)*100));$('#progressPercent').textContent=p+'%';$('#progressBar').style.width=p+'%';
}
const views=['dashboard','learn','editor','lab','ai','projects','snippets','challenges','profile','wallpapers','admin','tool'];
function showView(name){
if(!views.includes(name))name='dashboard';
$$('.view').forEach(v=>v.classList.toggle('active',v.id===name+'View'));
$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name&&b.classList.contains('navitem')));
$('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
if(name==='projects')renderProjects();if(name==='snippets')renderSnippets();if(name==='learn')renderCourses();if(name==='lab')renderLabs();if(name==='wallpapers')renderWallpapers();if(name==='profile')updateStats();
}
function openCourse(index){
const l=languages[Number(index)]||languages[0];$('#learnTitle').textContent=l.course;$('#lessonTitle').textContent=l.course+' — Starter lesson';$('#lessonText').textContent=l.lesson;$('#lessonPractice').value=state.notes[l.name]||l.starter.replaceAll('\n','\n');$('#saveLesson').dataset.course=l.name;showView('learn');
}
function renderCourses(){
$('#courseList').innerHTML=languages.map((l,i)=>`<button class="mini-card" data-course="${i}" style="text-align:left;color:var(--text)"><div class="langicon" style="--iconbg:${l.color}">${l.icon}</div><h3>${l.name}</h3><p>${l.desc}</p><small style="color:var(--cyan)">${state.courses.includes(l.name)?'✓ Completed':'Open starter lesson →'}</small></button>`).join('');
}
function renderLabs(){
$('#labList').innerHTML=labs.map((l,i)=>`<button class="mini-card" data-lab="${i}" style="text-align:left;color:var(--text)"><div class="action-icon" style="--tile:${l.color}">${l.icon}</div><h3>${l.name}</h3><p>${l.desc}</p></button>`).join('');
}
function openLab(i){const l=labs[Number(i)]||labs[0];$('#labTitle').textContent=l.name;$('#labTaskTitle').textContent=l.name+' challenge';$('#labTaskText').textContent=l.task;$('#labSolution').value=state.labNotes[l.name]||'';$('#labFeedback').textContent='';showView('lab')}
function renderProjects(){
const list=$('#projectList');list.innerHTML=state.projects.length?state.projects.map((p,i)=>`<article class="mini-card"><div class="action-icon">📁</div><h3>${esc(p.name)}</h3><p>${esc(p.description||'Personal coding project')}</p><small style="color:var(--muted)">${esc(p.date||'Saved locally')}</small><div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn small" data-open-project="${i}">Open in editor</button><button class="btn small secondary" data-delete-project="${i}">Delete</button></div></article>`).join(''):'<div class="empty">No projects yet. Tap “New project” to create your first one.</div>';
}
function renderSnippets(){
$('#snippetList').innerHTML=state.snippets.length?state.snippets.map((s,i)=>`<article class="mini-card"><h3>${esc(s.name)}</h3><p>${esc(s.language)} · ${esc(s.date)}</p><pre style="white-space:pre-wrap;max-height:110px;overflow:auto;color:#9feeff;font-size:10px">${esc(s.code.slice(0,500))}</pre><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn small" data-open-snippet="${i}">Open</button><button class="btn small secondary" data-delete-snippet="${i}">Delete</button></div></article>`).join(''):'<div class="empty">No saved snippets yet. Open the editor and tap Save snippet.</div>';
}
function renderWallpapers(){
const w=[['Neon Grid','linear-gradient(135deg,#061225,#075c9e,#061225)'],['Cyber Purple','linear-gradient(135deg,#100b2c,#6528a6,#061225)'],['Electric Blue','linear-gradient(135deg,#020914,#0b6dff,#12d9ff)'],['Matrix Green','linear-gradient(135deg,#010e0b,#075c42,#03140f)']];
$('#wallpaperList').innerHTML=w.map(([name,bg])=>`<button class="mini-card" data-wallpaper="${esc(name)}" style="text-align:left;color:var(--text)"><div style="height:100px;border-radius:10px;background:${bg};border:1px solid #23507b"></div><h3>${name}</h3><p>Tap to preview as your page background.</p></button>`).join('');
}
function setEditor(lang='html',code){
$('#editorLanguage').value=lang;const starters={html:'<!doctype html>\n<html>\n<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Page</title></head>\n<body style="font-family:sans-serif;padding:20px">\n  <h1>Hello, ICEMAN!</h1>\n  <p>Build something amazing.</p>\n  <button onclick="this.textContent=\'You clicked me!\'">Click me</button>\n</body>\n</html>',javascript:"const message = 'Hello, ICEMAN!';\nconsole.log(message);\nconsole.log('2 + 3 =', 2 + 3);",python:'name = "ICEMAN"\nprint("Hello, " + name + "!")\n# Python is in example mode in this browser starter.',json:'{\n  "name": "ICEMAN CODE LEARN",\n  "version": "1.0.0",\n  "mobileFirst": true\n}'};$('#codeEditor').value=code??starters[lang]??starters.html;$('#codeOutput').textContent='Ready. Tap Run / Preview.';$('#htmlPreview').style.display='none'}
function runCode(){
const lang=$('#editorLanguage').value,code=$('#codeEditor').value,out=$('#codeOutput'),frame=$('#htmlPreview');frame.style.display='none';out.style.display='block';
try{
if(lang==='html'){frame.srcdoc=code;frame.style.display='block';out.style.display='none';toast('HTML preview updated');return}
if(lang==='json'){const parsed=JSON.parse(code);out.textContent=JSON.stringify(parsed,null,2);return}
if(lang==='python'){out.textContent='Python example mode — this browser does not execute Python.\n\nCode received:\n'+code;return}
const logs=[];const safeConsole={log:(...a)=>logs.push(a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ')),warn:(...a)=>logs.push('WARN: '+a.join(' ')),error:(...a)=>logs.push('ERROR: '+a.join(' '))};
const fn=new Function('console','alert','prompt','confirm',`"use strict";\n${code}`);fn(safeConsole,(m)=>logs.push('[alert] '+m),()=>'',()=>false);out.textContent=logs.join('\n')||'Code ran successfully (no console output).';
}catch(e){out.textContent='Error: '+e.message}
}
function download(filename,content,type='text/plain'){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function openModal(title,body){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modalBackdrop').classList.add('open');const first=$('input,textarea', $('#modalBody'));if(first)first.focus()}
function closeModal(){$('#modalBackdrop').classList.remove('open')}
function addProject(){openModal('Create a project',`<form id="projectForm"><div class="field"><label for="projectName">Project name</label><input id="projectName" required maxlength="70" placeholder="My first website"></div><div class="field"><label for="projectDescription">Description</label><textarea id="projectDescription" maxlength="300" placeholder="What are you building?"></textarea></div><button class="btn" type="submit">Create project</button></form>`)}
function askAI(question){
if(!question.trim())return;showView('ai');const msgs=$('#chatMessages');const user=document.createElement('div');user.className='activity';user.innerHTML=`<div class="dot">👤</div><div><strong>You</strong><small></small></div>`;$('.activity small',user).textContent=question;msgs.append(user);$('#chatInput').value='';const waiting=document.createElement('div');waiting.className='activity';waiting.innerHTML='<div class="dot">🤖</div><div><strong>ICEMAN AI</strong><small>Thinking…</small></div>';msgs.append(waiting);
fetch('/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question})}).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'AI backend is not configured');return d}).then(d=>{$('small',waiting).textContent=d.reply||'No response returned.'}).catch(()=>{$('small',waiting).textContent='AI backend is not connected yet. Add GEMINI_API_KEY to the server environment and restart. Meanwhile, try breaking your question into smaller steps, checking the browser console, and testing one change at a time.'});msgs.scrollIntoView({behavior:'smooth',block:'end'});
}
function openTool(tool){
const names={json:'JSON Formatter',base64:'Base64 Encoder / Decoder',url:'URL Encoder / Decoder',notes:'Quick Notes'};$('#toolTitle').textContent=names[tool]||'Developer Tool';$('#toolView').dataset.tool=tool;$('#toolInput').value=tool==='notes'?(state.quickNotes||''):'';$('#toolOutput').value='';showView('tool');
}
function runTool(){
const tool=$('#toolView').dataset.tool,input=$('#toolInput').value;try{
if(tool==='json')$('#toolOutput').value=JSON.stringify(JSON.parse(input),null,2);
else if(tool==='base64')$('#toolOutput').value=/^[A-Za-z0-9+/=\s]+$/.test(input)&&input.length%4===0?decodeURIComponent(escape(atob(input))):btoa(unescape(encodeURIComponent(input)));
else if(tool==='url')$('#toolOutput').value=input.includes('%')?decodeURIComponent(input):encodeURIComponent(input);
else {state.quickNotes=input;save();$('#toolOutput').value='Notes saved locally.'}
}catch(e){$('#toolOutput').value='Error: '+e.message}
}
const quizzes=[
{q:'Which HTML tag creates the largest standard heading?',options:['<h6>','<heading>','<h1>','<head>'],answer:2,explain:'Correct! <h1> is the highest-level heading.'},
{q:'Which CSS property changes text color?',options:['font-style','color','background','text-size'],answer:1,explain:'Correct! The color property sets text color.'},
{q:'Which keyword declares a block-scoped variable in JavaScript?',options:['var only','let','define','dim'],answer:1,explain:'Correct! let declares a block-scoped variable.'},
{q:'Which Python function displays output?',options:['echo()','write()','print()','show()'],answer:2,explain:'Correct! print() displays output.'}
];let quizIndex=0;
function renderQuiz(){const q=quizzes[quizIndex%quizzes.length];$('#quizQuestion').textContent=q.q;$('#quizFeedback').textContent='';$('#quizOptions').innerHTML=q.options.map((o,i)=>`<button class="mini-card" data-answer="${i}" style="color:var(--text);text-align:left">${esc(o)}</button>`).join('')}
function handleClick(e){
const view=e.target.closest('[data-view]');if(view&&view.dataset.view){showView(view.dataset.view);return}
const course=e.target.closest('[data-course]');if(course){openCourse(course.dataset.course);return}
const lab=e.target.closest('[data-lab]');if(lab){openLab(lab.dataset.lab);return}
const tool=e.target.closest('[data-tool]');if(tool){openTool(tool.dataset.tool);return}
const collapse=e.target.closest('[data-collapse]');if(collapse){const children=$('#nav-'+collapse.dataset.collapse);children.classList.toggle('collapsed');collapse.lastElementChild.textContent=children.classList.contains('collapsed')?'⌄':'⌃';return}
const answer=e.target.closest('[data-answer]');if(answer){const q=quizzes[quizIndex%quizzes.length];const correct=Number(answer.dataset.answer)===q.answer;$('#quizFeedback').textContent=correct?q.explain:'Not quite — try again. Hint: '+q.options[q.answer];$('#quizFeedback').style.color=correct?'var(--green)':'var(--red)';if(correct){state.courses=[...new Set([...state.courses,'Quiz '+(quizIndex+1)])];save()}return}
const op=e.target.closest('[data-open-project]');if(op){const p=state.projects[Number(op.dataset.openProject)];setEditor('html',p?.code||'<!doctype html>\n<h1>'+esc(p?.name||'My project')+'</h1>');showView('editor');return}
const dp=e.target.closest('[data-delete-project]');if(dp){state.projects.splice(Number(dp.dataset.deleteProject),1);save();renderProjects();toast('Project deleted');return}
const os=e.target.closest('[data-open-snippet]');if(os){const s=state.snippets[Number(os.dataset.openSnippet)];setEditor(s?.language||'html',s?.code||'');showView('editor');return}
const ds=e.target.closest('[data-delete-snippet]');if(ds){state.snippets.splice(Number(ds.dataset.deleteSnippet),1);save();renderSnippets();toast('Snippet deleted');return}
const wp=e.target.closest('[data-wallpaper]');if(wp){const bgs={'Neon Grid':'radial-gradient(ellipse at 50% -20%,#102e5d 0,transparent 45%),#030b18','Cyber Purple':'radial-gradient(ellipse at 50% -20%,#402065 0,transparent 45%),#030b18','Electric Blue':'radial-gradient(ellipse at 50% -20%,#075c9e 0,transparent 45%),#030b18','Matrix Green':'radial-gradient(ellipse at 50% -20%,#075c42 0,transparent 45%),#030b18'};document.body.style.background=bgs[wp.dataset.wallpaper]||'';toast(wp.dataset.wallpaper+' wallpaper preview applied');return}
const run=e.target.closest('[data-action="run-editor"]');if(run){showView('editor');runCode()}
}
document.addEventListener('click',handleClick);
$('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');state.theme=document.body.classList.contains('light')?'light':'dark';save();toast(state.theme==='light'?'Light theme enabled':'Dark theme enabled')});
$('#notificationsBtn').addEventListener('click',()=>toast('You are all caught up!'));
$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim().toLowerCase();if(!q)return;const l=languages.findIndex(x=>x.name.toLowerCase().includes(q));if(l>=0){openCourse(l);return}const v=[['editor',['editor','code','run']],['lab',['lab','practice','debug']],['ai',['ai','assistant','gemini','help']],['projects',['project']],['snippets',['snippet','saved']],['challenges',['challenge','quiz']],['wallpapers',['wallpaper']],['profile',['profile','setting']]].find(x=>x[1].some(k=>q.includes(k)));if(v){showView(v[0]);return}toast('No exact match. Try HTML, CSS, editor, labs, AI, projects, or tools.')}})
$('#saveLesson').addEventListener('click',()=>{const name=$('#saveLesson').dataset.course||'HTML';state.notes[name]=$('#lessonPractice').value;if(!state.courses.includes(name))state.courses.push(name);save();renderCourses();toast('Lesson notes saved and course marked in progress')});
$('#runCode').addEventListener('click',runCode);$('#clearCode').addEventListener('click',()=>{if(confirm('Clear the editor?')){setEditor($('#editorLanguage').value,'')}});$('#downloadCode').addEventListener('click',()=>{const lang=$('#editorLanguage').value;download(({html:'index.html',javascript:'script.js',python:'main.py',json:'data.json'})[lang],$('#codeEditor').value,lang==='html'?'text/html':'text/plain');toast('Code download started')});
$('#saveSnippet').addEventListener('click',()=>{const code=$('#codeEditor').value;if(!code.trim()){toast('Write some code first');return}openModal('Save snippet',`<form id="snippetForm"><div class="field"><label>Snippet name</label><input id="snippetName" required maxlength="70" placeholder="My useful snippet"></div><button class="btn" type="submit">Save snippet</button></form>`);$('#snippetForm').addEventListener('submit',e=>{e.preventDefault();state.snippets.unshift({name:$('#snippetName').value,language:$('#editorLanguage').value,code,date:new Date().toLocaleDateString()});save();closeModal();toast('Snippet saved');renderSnippets()},{once:true})});
$('#newProject').addEventListener('click',addProject);
$('#modalClose').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});
$('#modalBody').addEventListener('submit',e=>{if(e.target.id!=='projectForm')return;e.preventDefault();state.projects.unshift({name:$('#projectName').value,description:$('#projectDescription').value,date:new Date().toLocaleDateString(),code:''});save();closeModal();renderProjects();toast('Project created')});
$('#checkLab').addEventListener('click',()=>{const text=$('#labSolution').value;const name=$('#labTitle').textContent;state.labNotes[name]=text;save();$('#labFeedback').textContent=text.trim()?'Saved! Review your solution and keep improving it.':'Write a solution or note first.';if(text.trim())toast('Practice saved locally')});
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();askAI($('#chatInput').value)});$('#miniChatForm').addEventListener('submit',e=>{e.preventDefault();askAI($('#miniChatInput').value);$('#miniChatInput').value=''});$('#clearChat').addEventListener('click',()=>{$('#chatMessages').innerHTML='<div class="activity"><div class="dot">🤖</div><div><strong>ICEMAN AI</strong><small>Chat cleared. Ask a new coding question.</small></div></div>'});
$('#saveProfile').addEventListener('click',()=>{state.username=$('#usernameInput').value.trim()||'ICEMAN';state.goal=$('#goalInput').value.trim();save();toast('Profile saved')});
$('#resetProgress').addEventListener('click',()=>{if(confirm('Reset courses, projects, snippets, and notes on this device?')){state={...defaults,username:state.username,goal:state.goal,theme:state.theme};save();renderDashboard();renderProjects();renderSnippets();toast('Local progress reset')}})
$('#nextQuiz').addEventListener('click',()=>{quizIndex++;renderQuiz()});
$('#runTool').addEventListener('click',runTool);$('#copyTool').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#toolOutput').value);toast('Output copied')}catch{ $('#toolOutput').select();document.execCommand('copy');toast('Output copied if clipboard permission is available')}});
$('#adminLogin').addEventListener('click',()=>{$('#adminFeedback').textContent='Admin login is not connected. Configure secure admin authentication on the backend before enabling owner controls.';toast('Owner controls are disabled in this frontend starter')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
if(state.theme==='light')document.body.classList.add('light');
renderDashboard();renderCourses();renderLabs();renderQuiz();setEditor('html');updateStats();
})();
