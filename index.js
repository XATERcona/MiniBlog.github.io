let article = [];

const savedArticles = localStorage.getItem('postes');
if (savedArticles) {
  article = JSON.parse(savedArticles); 
}

let Error = document.querySelector(".error");
let create = document.querySelector("#create")
let list = document.querySelector('#list');
let findInput = document.querySelector('#findtext');
   findInput.className = "findInput";
let find = document.querySelector('#find');
   find.className = "findBtn";


let userName = document.querySelector('#userName');
let Localname = localStorage.getItem('userName') || 'Аноним';
userName.value = Localname;

userName.addEventListener('input', () => {
    Localname = userName.value;
    if (Localname) {
     localStorage.setItem('userName', Localname);
    }
    });


function render(){

    list.textContent = '';
    article.sort((a, b) => b.date - a.date);
    
    article.forEach(art => {

        const Container = document.createElement('div');
        Container.className = "Container";

        const Author_namedis = document.createElement('p');
        Author_namedis.textContent = art.name
        Author_namedis.className = "name";

        const headingdis = document.createElement('p');
        headingdis.textContent = art.heading
        headingdis.className = "heading";

        const mainTextdis = document.createElement('p');
        mainTextdis.innerHTML = formatText(art.mainText);
        mainTextdis.className = "mainText";

        const dateEl = document.createElement('p');
        dateEl.className = "date";
        dateEl.textContent = new Date(art.date).toLocaleDateString('ru-RU');

        const deletArt = document.createElement('button');
        deletArt.textContent = 'Удалить пост';
        deletArt.className = 'deletart';

        deletArt.addEventListener('click', () => {
              deleteArticle(art.id);  
        });

        const editArt = document.createElement('button');
        editArt.textContent = 'Редактировать';
        editArt.className = 'editart';


        const editCont = document.createElement('div');
        editCont.className = 'editCont';
        editCont.style.display = 'none';

        const editHeading = document.createElement('input');
        editHeading.className = 'editHeading';
        editHeading.value = art.heading;

        const editMainText = document.createElement('textarea');
        editMainText.className = 'editMainText';
        editMainText.value = art.mainText;

        const saveEdit = document.createElement('button');
        saveEdit.textContent = 'Сохранить';
        saveEdit.className = 'saveEdit';


        editCont.appendChild(editHeading);
        editCont.appendChild(editMainText);
        editCont.appendChild(saveEdit);
        Container.appendChild(editCont);

        editArt.addEventListener('click', () => {
            const isHidden = editCont.style.display === 'none';
            editCont.style.display = isHidden ? 'flex' : 'none';
        });

        saveEdit.addEventListener('click', () => {
            const newHeading = editHeading.value;
            const newMainText = editMainText.value;

            if (newHeading === '' || newMainText === '') {
                Error.textContent = 'Заголовок и текст не могут быть пустыми';
                return;
            }

            art.heading = newHeading;
            art.mainText = newMainText;

            localStorage.setItem('postes', JSON.stringify(article));
            render();
        });



        list.appendChild(Container);
        Container.appendChild(deletArt);
        Container.appendChild(editArt);
        Container.appendChild(dateEl);  
        Container.appendChild(Author_namedis);
        Container.appendChild(headingdis);
        Container.appendChild(mainTextdis);

        const Liked = document.createElement('button');
        Liked.textContent = art.Liked ? '♥' : '♡';
        Liked.className = "Liked";
        
        const likeCount = document.createElement('span');
        likeCount.textContent = ` ${art.likes}`;
        Liked.appendChild(likeCount);

        Liked.addEventListener('click', () => {
           art.Liked = !art.Liked;
           art.likes += art.Liked ? 1 : -1;

           localStorage.setItem('postes', JSON.stringify(article));
           render();
        });
        

        
        Container.appendChild(Liked);

        let CommentsDiv = document.createElement('div');
        CommentsDiv.className = 'commentsDiv';

            art.comments.forEach((comm, index) => {
                let commDiv = document.createElement('div');
                commDiv.className = 'commDiv';
                
                let nameCom = document.createElement('p');
                nameCom.textContent = comm.name
                nameCom.className = 'nameCom';

                let textCom = document.createElement('p');
                textCom.textContent = comm.text
                textCom.className = 'textCom';

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Удалить';
                delBtn.className = 'delBtn';
                delBtn.addEventListener('click', () => {
                    art.comments.splice(index, 1);
                    localStorage.setItem('postes', JSON.stringify(article));
                    render();
                });
                commDiv.appendChild(nameCom);
                commDiv.appendChild(textCom);
                commDiv.appendChild(delBtn);
                CommentsDiv.appendChild(commDiv);
                
            })

            let divtotalComm = document.createElement('div');
            divtotalComm.className = 'divtotalComm';

            const totalComments = document.createElement('p');
            totalComments.textContent =  art.comments.length;
            totalComments.className = 'total-comments';
            

            let label = document.createElement('p')
            label.textContent = "Оставить комментарий";
            label.className = 'label';

            let nameInput = document.createElement('input')
            nameInput.value = Localname;
            nameInput.className = 'nameInput';

            let textInput = document.createElement('textarea');
            textInput.className = 'textInput';
            
            let comment = document.createElement('button');
            comment.textContent = "Отправить комментарий"
            comment.className = "comment";
        
    
            comment.addEventListener("click", ()=>{
            let nameValue = nameInput.value;
            let textValue = textInput.value;

            if (nameValue === ''|| textValue === '' ) { 
            textInput.placeholder = 'Заполните все поля в комментарии!!!';
            nameInput.placeholder = 'Имя обязательно!!!';
            return;
             }

                const new_comment = {
                    name: nameValue,
                    text: textValue}

                art.comments.push(new_comment)
                localStorage.setItem('postes', JSON.stringify(article));
                render();
            
             })
             
             Container.appendChild(divtotalComm);
             divtotalComm.appendChild(label);
             divtotalComm.appendChild(totalComments);
             CommentsDiv.appendChild(nameInput);
             CommentsDiv.appendChild(textInput);
             CommentsDiv.appendChild(comment);
             Container.appendChild(CommentsDiv);

    })

}

const mainTextEl = document.querySelector('#mainText');

function wrapSelection(before, after = before) {
    const start = mainTextEl.selectionStart;
    const end = mainTextEl.selectionEnd;
    const value = mainTextEl.value;

    const selected = value.slice(start, end) || 'текст';
    const newValue =
        value.slice(0, start) +
        before + selected + after +
        value.slice(end);

    mainTextEl.value = newValue;

    const cursor = start + before.length + selected.length + after.length;
    mainTextEl.focus();
    mainTextEl.setSelectionRange(cursor, cursor);
}

document.querySelector('#kurs').addEventListener('click', (e) => {
    wrapSelection('*');          
});

document.querySelector('#big').addEventListener('click', (e) => {
    wrapSelection('**');         
});

document.querySelector('#abz').addEventListener('click', (e) => {
    const start = mainTextEl.selectionStart;
    const value = mainTextEl.value;
    const newValue = value.slice(0, start) + '\n\n' + value.slice(start);
    mainTextEl.value = newValue;
    mainTextEl.focus();
    mainTextEl.setSelectionRange(start + 2, start + 2);
});

function formatText(text) {
    let safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');
    safe = safe.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');

    return safe;
}

create.addEventListener("click", ()=>{
    
    let heading = document.querySelector('#heading');
    let mainText = document.querySelector('#mainText');
    
    let headingValue = heading.value;
    let mainTextValue = mainText.value;


    if (headingValue === ''|| mainTextValue === '' ) {
        Error.textContent = 'Заполните все поля!!!';
        return;
    }
    
    const new_article = {
        id: Date.now(),
        name: Localname,
        heading: headingValue,
        mainText: mainTextValue,
        date: Date.now(),
        comments: [], 
        likes: 0,
        Liked: false
    }

    article.push(new_article)
    
    localStorage.setItem("postes", JSON.stringify(article))

    heading.value = '';
    mainText.value = '';

    render()
})

function deleteArticle(id) {
    if (!confirm('Удалить статью?')) {
        return;
    }
    const index = article.findIndex(art => art.id === id);
    if (index === -1) return;

    article.splice(index, 1);
    localStorage.setItem('postes', JSON.stringify(article));
    render();
}


find.addEventListener('click', () => {
    const searchText = findInput.value;
    render();

    if (searchText === '') return;

    const containers = list.querySelectorAll('.Container');
    containers.forEach((container, i) => {
        const art = article[i];
        const match =
            art.heading.includes(searchText) ||
            art.mainText.includes(searchText);
        if (!match) container.style.display = 'none';
    });
});


render()

