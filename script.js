// =======================================
// BlogSphere X - Advanced JavaScript
// =======================================

let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
let activities = JSON.parse(localStorage.getItem("activities")) || [];
let editId = null;

// =======================================
// Profile Picture Upload
// =======================================

const profileUpload =
document.getElementById("profileUpload");

const profilePreview =
document.getElementById("profilePreview");

if(profileUpload){

profileUpload.addEventListener("change",function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        profilePreview.src =
        e.target.result;

        localStorage.setItem(
            "profilePic",
            e.target.result
        );

        toast("Profile Updated");

    };

    reader.readAsDataURL(file);

});

}

const savedPic =
localStorage.getItem("profilePic");

if(savedPic){

    profilePreview.src =
    savedPic;

}

// =======================================
// Follow Button
// =======================================

const followBtn =
document.getElementById("followBtn");

let following = false;

if(followBtn){

followBtn.addEventListener("click",()=>{

    following = !following;

    followBtn.innerText =
    following ?
    "Following" :
    "Follow";

    toast(
    following ?
    "Now Following Author" :
    "Unfollowed Author"
    );

});

}

// =======================================
// Image Preview
// =======================================

const imageInput =
document.getElementById("imageInput");

const preview =
document.getElementById("preview");

if(imageInput){

imageInput.addEventListener("change",function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        preview.src =
        e.target.result;

        preview.style.display =
        "block";

    };

    reader.readAsDataURL(file);

});

}

// =======================================
// Word Counter
// =======================================

const content =
document.getElementById("content");

if(content){

content.addEventListener("input",()=>{

    const text =
    content.value.trim();

    const words =
    text === ""
    ? 0
    : text.split(/\s+/).length;

    const chars =
    text.length;

    const reading =
    Math.max(
    1,
    Math.ceil(words / 200)
    );

    document.getElementById(
    "wordCount"
    ).innerText =
    `Words : ${words}`;

    document.getElementById(
    "charCount"
    ).innerText =
    `Characters : ${chars}`;

    document.getElementById(
    "readingTime"
    ).innerText =
    `Reading : ${reading} min`;

});

}

// =======================================
// Auto Save Draft
// =======================================

setInterval(()=>{

    if(content){

        localStorage.setItem(
        "draft",
        content.value
        );

    }

},3000);

// =======================================
// Toast Notification
// =======================================

function toast(message){

    const toastBox =
    document.getElementById("toast");

    if(!toastBox) return;

    toastBox.innerText =
    message;

    toastBox.style.display =
    "block";

    setTimeout(()=>{

        toastBox.style.display =
        "none";

    },3000);

}

// =======================================
// Activity Feed
// =======================================

function addActivity(text){

    activities.unshift(text);

    localStorage.setItem(
    "activities",
    JSON.stringify(activities)
    );

    renderActivities();

}

function renderActivities(){

    const feed =
    document.getElementById(
    "activityFeed"
    );

    if(!feed) return;

    feed.innerHTML = "";

    activities
    .slice(0,10)
    .forEach(item=>{

        const div =
        document.createElement("div");

        div.innerHTML =
        `✅ ${item}`;

        div.style.margin =
        "10px 0";

        feed.appendChild(div);

    });

}

// =======================================
// Publish Blog
// =======================================

function publishBlog(){

    const title =
    document.getElementById("title").value;

    const author =
    document.getElementById("author").value;

    const category =
    document.getElementById("category").value;

    const tags =
    document.getElementById("tags").value;

    const text =
    document.getElementById("content").value;

    if(
        title === "" ||
        author === "" ||
        category === "" ||
        text === ""
    ){

        toast("Fill All Fields");
        return;
    }

    const blog = {

        id: editId || Date.now(),

        title,
        author,
        category,
        tags,
        content:text,

        image:
        preview.src ||
        "https://picsum.photos/600/300",

        likes:0,
        dislikes:0,
        views:0,
        comments:[],
        bookmarked:false,

        date:
        new Date().toLocaleString()

    };

    if(editId){

        blogs =
        blogs.map(item=>
        item.id === editId
        ? blog
        : item
        );

        editId = null;

        addActivity(
        `Updated blog : ${title}`
        );

    }

    else{

        blogs.unshift(blog);

        addActivity(
        `Published blog : ${title}`
        );

    }

    saveBlogs();

    clearForm();

    toast("Blog Published");

}

// =======================================
// Render Blogs
// =======================================

function renderBlogs(){

    const container =
    document.getElementById(
    "blogContainer"
    );

    if(!container) return;

    container.innerHTML = "";

    blogs.forEach(blog=>{

        const card =
        document.createElement("div");

        card.className =
        "blog-card";

        card.innerHTML = `

        <img src="${blog.image}">

        <div class="blog-content">

        <h3>${blog.title}</h3>

        <div class="blog-meta">

        <span>${blog.author}</span>

        <span>${blog.date}</span>

        </div>

        <p class="blog-tags">
        ${blog.tags}
        </p>

        <p>
        ${blog.content.substring(0,120)}...
        </p>

        <div class="blog-actions">

        <button onclick="likeBlog(${blog.id})">
        ❤️ ${blog.likes}
        </button>

        <button onclick="dislikeBlog(${blog.id})">
        👎 ${blog.dislikes}
        </button>

        <button onclick="viewBlog(${blog.id})">
        👁️ ${blog.views}
        </button>

        <button onclick="commentBlog(${blog.id})">
        💬
        </button>

        <button onclick="bookmarkBlog(${blog.id})">
        🔖
        </button>

        <button onclick="shareBlog('${blog.title}')">
        📤
        </button>

        <button onclick="editBlog(${blog.id})">
        ✏️
        </button>

        <button onclick="deleteBlog(${blog.id})">
        🗑️
        </button>

        </div>

        </div>
        `;

        container.appendChild(card);

    });

    updateStats();

}

// =======================================
// Blog Actions
// =======================================

function likeBlog(id){

blogs.forEach(blog=>{

if(blog.id===id){

blog.likes++;

}

});

saveBlogs();

}

function dislikeBlog(id){

blogs.forEach(blog=>{

if(blog.id===id){

blog.dislikes++;

}

});

saveBlogs();

}

function viewBlog(id){

blogs.forEach(blog=>{

if(blog.id===id){

blog.views++;

alert(blog.content);

}

});

saveBlogs();

}

function commentBlog(id){

const comment =
prompt("Write Comment");

if(!comment) return;

blogs.forEach(blog=>{

if(blog.id===id){

blog.comments.push(comment);

}

});

saveBlogs();

toast("Comment Added");

}

function bookmarkBlog(id){

blogs.forEach(blog=>{

if(blog.id===id){

blog.bookmarked =
!blog.bookmarked;

}

});

saveBlogs();

toast("Bookmark Updated");

}

function editBlog(id){

const blog =
blogs.find(
b=>b.id===id
);

if(!blog) return;

editId = id;

document.getElementById("title").value =
blog.title;

document.getElementById("author").value =
blog.author;

document.getElementById("category").value =
blog.category;

document.getElementById("tags").value =
blog.tags;

document.getElementById("content").value =
blog.content;

preview.src =
blog.image;

preview.style.display =
"block";

window.scrollTo({
top:0,
behavior:"smooth"
});

}

function deleteBlog(id){

if(!confirm("Delete Blog?"))
return;

blogs =
blogs.filter(
blog=>blog.id!==id
);

saveBlogs();

toast("Blog Deleted");

}

// =======================================
// Search
// =======================================

const searchInput =
document.getElementById(
"searchInput"
);

if(searchInput){

searchInput.addEventListener(
"keyup",
function(){

const value =
this.value.toLowerCase();

document
.querySelectorAll(".blog-card")
.forEach(card=>{

card.style.display =
card.innerText
.toLowerCase()
.includes(value)
?
"block"
:
"none";

});

});

}

// =======================================
// Category Filter
// =======================================

const filter =
document.getElementById(
"filterCategory"
);

if(filter){

filter.addEventListener(
"change",
function(){

const selected =
this.value;

document
.querySelectorAll(".blog-card")
.forEach(card=>{

if(selected==="all"){

card.style.display =
"block";

}

else{

card.style.display =
card.innerText
.includes(selected)
?
"block"
:
"none";

}

});

});

}

// =======================================
// Share Blog
// =======================================

function shareBlog(title){

window.open(
`https://wa.me/?text=${title}`
);

}

// =======================================
// Reading Progress
// =======================================

window.addEventListener(
"scroll",
()=>{

const top =
document.documentElement
.scrollTop;

const height =
document.documentElement
.scrollHeight -
document.documentElement
.clientHeight;

const progress =
(top/height)*100;

const bar =
document.getElementById(
"progressBar"
);

if(bar){

bar.style.width =
progress + "%";

}

});

// =======================================
// Dark Mode
// =======================================

const themeToggle =
document.getElementById(
"themeToggle"
);

if(themeToggle){

themeToggle.addEventListener(
"click",
()=>{

document.body
.classList
.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList
.contains("dark")
);

});

}

// =======================================
// Scroll Top
// =======================================

const scrollBtn =
document.getElementById(
"scrollTop"
);

window.addEventListener(
"scroll",
()=>{

if(window.scrollY > 300){

scrollBtn.style.display =
"block";

}

else{

scrollBtn.style.display =
"none";

}

});

if(scrollBtn){

scrollBtn.addEventListener(
"click",
()=>{

window.scrollTo({

top:0,
behavior:"smooth"

});

});

}

// =======================================
// Stats
// =======================================

function updateStats(){

document.getElementById(
"totalBlogs"
).innerText =
blogs.length;

document.getElementById(
"blogCount"
).innerText =
blogs.length;

let likes=0;
let views=0;
let bookmarks=0;

blogs.forEach(blog=>{

likes += blog.likes;
views += blog.views;

if(blog.bookmarked){

bookmarks++;

}

});

document.getElementById(
"totalLikes"
).innerText =
likes;

document.getElementById(
"totalViews"
).innerText =
views;

document.getElementById(
"totalBookmarks"
).innerText =
bookmarks;

}

// =======================================
// Helpers
// =======================================

function saveBlogs(){

localStorage.setItem(
"blogs",
JSON.stringify(blogs)
);

renderBlogs();

}

function clearForm(){

document.getElementById("title").value="";
document.getElementById("author").value="";
document.getElementById("category").value="";
document.getElementById("tags").value="";
document.getElementById("content").value="";

preview.src="";
preview.style.display="none";

}

// =======================================
// App Load
// =======================================

window.onload = ()=>{

if(
localStorage.getItem("theme")
==="true"
){

document.body.classList
.add("dark");

}

const draft =
localStorage.getItem(
"draft"
);

if(draft && content){

content.value =
draft;

}

renderBlogs();
renderActivities();

};