// const POSTS_URL = "https://gist.githubusercontent.com/milicazd/082f0783f3ac03d704b9b14ebd810e6e/raw/posts";
const POSTS_URL = "posts.json";

const feed = document.getElementById("feed");

function formatDate(isoString) {
    const date = new Date(isoString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function createPost(post) {
    const article = document.createElement("article");
    article.className = "post";

    const header = document.createElement("div");
    header.className = "post-header";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    const avatarImg = document.createElement("img");
    avatarImg.src = post.userPicture;
    avatarImg.alt = post.userName;
    avatar.appendChild(avatarImg);

    const name = document.createElement("strong");
    name.textContent = post.userName;

    const time = document.createElement("time");
    time.dateTime = post.creationTime;
    time.textContent = formatDate(post.creationTime);

    header.append(avatar, name, time);

    //post body - optional photo + text
    const body = document.createElement("div");
    body.className = "post-body";

    if(post.postPhoto) {
        const photo = document.createElement("img");
        photo.src = post.postPhoto;
        photo.alt = "Photo from " + post.userName;
        body.appendChild(photo);
    }

    const text = document.createElement("p");
    text.textContent = post.postText;
    body.appendChild(text);

    //post footer - like button (same as before)
    const footer = document.createElement("div");
    footer.className = "post-footer";

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.type = "button";

    let liked = false;
    let count = post.likes || 0;
    likeBtn.textContent = `👍 ${count}`;

    likeBtn.addEventListener("click", () => {
        liked = !liked;
        count += liked ? 1 : -1;
        likeBtn.classList.toggle("liked", liked);
        likeBtn.textContent = `👍 ${count}`;
    });

    footer.appendChild(likeBtn);

    article.append(header, body, footer);
    return article;
}

fetch(POSTS_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(posts => {
        const sorted = [...posts].sort((a, b) => b.creationTime.localeCompare(a.creationTime));
        sorted.forEach(post => feed.appendChild(createPost(post)));
    })
    .catch(error => {
        console.error("Could not load posts:", error);
        feed.textContent = "Sorry, the posts could not be loaded";
    });